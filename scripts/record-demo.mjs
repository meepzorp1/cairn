/**
 * Records the landing page's phone demo: a scripted run through Cairn's map
 * screen with a visible cursor, captured as video.
 *
 * Why scripted rather than a hand screen-recording: the real OS cursor often
 * isn't captured at all, and when it is it's ~20px in a frame that gets
 * displayed at ~548px wide inside the hero phone. Here the cursor is a DOM
 * element we draw ourselves, so it's always in the capture and always the
 * right size. Re-shooting after a UI change is one command.
 *
 *   npm run dev                     # in another terminal
 *   node scripts/record-demo.mjs
 *
 * Output lands in scripts/demo-out/. Needs a real ffmpeg on PATH for the
 * mp4; without one you still get the raw .webm and a printed trim command.
 *
 * Env (PowerShell sets these as `$env:SLOW = 1.4` on their own line first,
 * not inline ahead of the command the way a POSIX shell does):
 *   BASE_URL   default http://localhost:3000
 *   HEADED=1   watch it run
 *   SLOW=1.4   stretch every pause by this factor
 *   MODE=Walk  travel mode, which sets the search radius (default Drive)
 */

import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "demo-out");
const RAW = join(OUT, "raw");

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const SLOW = Number(process.env.SLOW ?? 1);

// 390x844 is a stock iPhone viewport. The hero phone renders the reel at only
// about 190 CSS px wide, so this is already roughly double what it needs.
const VIEWPORT = { width: 390, height: 844 };

// Rasterize at 3x. This does NOT change the video's resolution (see below);
// it just gives the capture a supersampled frame to downsample from.
const SCALE = 3;

// Santa Cruz. The map screen won't render at all without a location fix, and a
// fixed one keeps every take identical.
const GEO = { latitude: 36.9741, longitude: -122.0308 };

// How full the map looks comes down to these two. Radius follows the travel
// mode, and every selected interest widens which Google place types survive
// ranking, so more of both means more pins. rankPlaces caps the drawer at 20
// no matter what, which is the most that can ever show up here.
const MODE = process.env.MODE ?? "Drive";
const EXTRA_INTERESTS = ["Beaches & Water", "History", "Arts & Culture"];

const pause = (page, ms) => page.waitForTimeout(Math.round(ms * SLOW));

/* -------------------------------------------------------------------------
 * The cursor. Injected into every document before the app's own scripts run.
 * ---------------------------------------------------------------------- */
const CURSOR_INIT = () => {
  const boot = () => {
    const style = document.createElement("style");
    style.textContent = `
      #__cursor{position:fixed;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;
        border-radius:50%;background:rgba(239,230,210,.95);
        box-shadow:0 2px 12px rgba(0,0,0,.6);
        z-index:2147483647;pointer-events:none;
        transition:width .12s ease-out,height .12s ease-out,margin .12s ease-out}
      #__ripple{position:fixed;left:0;top:0;width:30px;height:30px;margin:-15px 0 0 -15px;
        border-radius:50%;border:2px solid rgba(210,162,76,.9);
        z-index:2147483646;pointer-events:none;opacity:0}
      @keyframes __ripple-go{from{transform:scale(1);opacity:.9}to{transform:scale(2.8);opacity:0}}
      #__ripple.go{animation:__ripple-go .5s ease-out}`;
    document.head.appendChild(style);

    // The ripple sits under the cursor so the dot stays crisp on top of it.
    for (const id of ["__ripple", "__cursor"]) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }

    window.__cursorTo = (x, y) => {
      for (const id of ["__cursor", "__ripple"]) {
        const el = document.getElementById(id);
        if (el) el.style.transform = `translate(${x}px,${y}px)`;
      }
    };

    window.__cursorPress = (down) => {
      const c = document.getElementById("__cursor");
      if (c) {
        c.style.width = c.style.height = down ? "23px" : "30px";
        c.style.margin = down ? "-11.5px 0 0 -11.5px" : "-15px 0 0 -15px";
      }
      if (down) {
        const r = document.getElementById("__ripple");
        if (r) {
          r.classList.remove("go");
          void r.offsetWidth; // restart the animation
          r.classList.add("go");
        }
      }
    };
  };

  // addInitScript runs at document-start, when document.body is still null.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
};

const ease = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function makeHand(page) {
  // Start offscreen-bottom so the first move reads as a hand coming in.
  let pos = { x: VIEWPORT.width / 2, y: VIEWPORT.height + 60 };

  const sync = async (x, y) => {
    await page.mouse.move(x, y);
    await page.evaluate(([x, y]) => window.__cursorTo?.(x, y), [x, y]);
  };

  const glide = async (x, y, ms) => {
    const from = { ...pos };
    const steps = Math.max(2, Math.round((ms * SLOW) / 16));
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps);
      await sync(from.x + (x - from.x) * t, from.y + (y - from.y) * t);
      await page.waitForTimeout(16);
    }
    pos = { x, y };
  };

  const centerOf = async (target) => {
    const locator = typeof target === "string" ? page.locator(target) : target;
    const box = await locator.first().boundingBox();
    if (!box) throw new Error(`nothing to aim at: ${target}`);
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };

  return {
    async tap(target, { travel = 620, settle = 850 } = {}) {
      const { x, y } = await centerOf(target);
      await glide(x, y, travel);
      await pause(page, 150);
      await page.evaluate(() => window.__cursorPress?.(true));
      await page.mouse.down();
      await pause(page, 90);
      await page.mouse.up();
      await page.evaluate(() => window.__cursorPress?.(false));
      await pause(page, settle);
    },

    async rest() {
      await glide(VIEWPORT.width / 2, VIEWPORT.height + 60, 500);
    },
  };
}

/* ---------------------------------------------------------------------- */

rmSync(OUT, { recursive: true, force: true });
mkdirSync(RAW, { recursive: true });

const browser = await chromium.launch({
  headless: !process.env.HEADED,
  // Set PW_CHROME when Playwright's own download isn't what you want to film.
  executablePath: process.env.PW_CHROME || undefined,
});

const context = await browser.newContext({
  viewport: VIEWPORT,
  deviceScaleFactor: SCALE,
  isMobile: true,
  hasTouch: true,
  geolocation: GEO,
  permissions: ["geolocation"],
  locale: "en-US",
  colorScheme: "dark",
  // recordVideo.size must match the viewport. Playwright only ever scales a
  // capture DOWN to fit this box, never up, and it ignores deviceScaleFactor
  // entirely. Asking for 3x here does not give a 3x recording: it gives a 3x
  // canvas with the 390x844 capture sitting in the top-left corner and flat
  // grey filling the rest, which is what shows up inside the phone.
  recordVideo: {
    dir: RAW,
    size: { width: VIEWPORT.width, height: VIEWPORT.height },
  },
});

await context.addInitScript(CURSOR_INIT);

const page = await context.newPage();
page.setDefaultTimeout(30_000);

const startedAt = Date.now();
let mapReadyAt = 0;

try {
  await page.goto(`${BASE_URL}/explore`, { waitUntil: "domcontentloaded" });

  const hand = makeHand(page);

  // Every beat waits for its own target first, so a UI change fails here with
  // a sentence instead of a 30s boundingBox timeout further down.
  const beat = async (locator, missing, opts) => {
    await locator.waitFor({ timeout: 15_000 }).catch(() => {
      throw new Error(missing);
    });
    await hand.tap(locator, opts);
  };

  /* --- setup, at the same human pace as the rest ------------------------ */
  await pause(page, 700);

  await beat(
    page.getByRole("button", { name: /Explore Nearby/ }),
    "the intent step never rendered",
    { settle: 950 },
  );

  // Travel mode is what sets the search radius, in useActiveTrip:
  // walking 1200m, biking 2500m, driving 5000m. Driving is also the ceiling
  // the API route clamps to, so it's the most places the app can ever show.
  await beat(
    page.getByRole("button", { name: MODE, exact: true }),
    `no ${MODE} button on the travel step`,
    { settle: 950 },
  );

  await beat(
    page.getByRole("button", { name: /Student/ }),
    "no Student option on the audience step",
    { settle: 1100 },
  );

  // Picking an audience already ticks that preset's interests (Student comes
  // with Food, Coffee, Outdoors, Entertainment and Hidden gems), and these
  // buttons TOGGLE. Tapping one that's already on turns it off and shrinks the
  // search, so check the state first and only tick what's missing.
  for (const label of EXTRA_INTERESTS) {
    const option = page.getByRole("button", { name: label, exact: true });
    await option.waitFor({ timeout: 15_000 }).catch(() => {
      throw new Error(`no "${label}" interest button on the preferences step`);
    });
    if ((await option.getAttribute("aria-pressed")) === "false") {
      // Short hops: these sit next to each other in a grid.
      await hand.tap(option, { travel: 420, settle: 600 });
    }
  }

  await beat(
    page.getByRole("button", { name: "Start exploring", exact: true }),
    "the Start exploring button never became available",
    { settle: 900 },
  );

  /* --- the map ---------------------------------------------------------- */
  // "N places found" only renders once the Places call has come back, so this
  // is the honest signal that there's something worth filming on screen.
  const found = page.getByText(/places found/);
  await found.waitFor({ timeout: 45_000 });
  await pause(page, 1200);
  mapReadyAt = Date.now() - startedAt;

  console.log(`\n${(await found.textContent())?.trim()} (drawer caps at 20)`);

  // 1. Open the drawer on the list of nearby places.
  //    This has to be a tap, not a drag. The handle is a plain onClick button
  //    rather than a draggable sheet, and a press-move-release fires no click
  //    at all, because the down and the up land on different elements. Dragging
  //    it looks right on screen and does nothing.
  await beat(
    page.getByRole("button", { name: "Expand nearby places" }),
    "couldn't find the drawer handle on the map screen",
    { settle: 1000 },
  );

  await page
    .getByRole("button", { name: "Collapse nearby places" })
    .waitFor({ timeout: 5_000 })
    .catch(() => {
      throw new Error("tapped the drawer handle but the drawer never opened");
    });

  // 2. Pick a place. Selecting a card also collapses the drawer, so the map
  //    pans to the pin and the collapsed bar shows what you picked.
  await beat(
    page.locator("button:has(h3)").first(),
    "the drawer opened but no discovery cards rendered in it",
    { settle: 1600 },
  );

  // 3. Route to it. The payoff shot: the line draws across the map and the
  //    header turns into the destination with distance and time.
  await beat(
    page.getByRole("button", { name: "Set destination" }),
    "no Set destination button appeared after picking a place",
    { settle: 2400 },
  );

  // 4. Re-search along the route.
  await beat(
    page.getByRole("button", { name: "Explore", exact: true }),
    "no Explore button appeared after setting a destination",
    { settle: 2600 },
  );

  await hand.rest();
  await pause(page, 900);
} finally {
  await context.close();
  await browser.close();
}

/* --- two cuts of the same take ----------------------------------------- */
const raw = readdirSync(RAW).find((f) => f.endsWith(".webm"));
if (!raw) throw new Error("playwright produced no video");

const webm = join(OUT, "cairn-demo.webm");
renameSync(join(RAW, raw), webm);
rmSync(RAW, { recursive: true, force: true });

// The setup is now filmed at the same pace as the map, so it's worth keeping.
// Rather than guess which one you want in the phone, cut both from the one
// recording: the whole run, and the map on its own.
const trimAt = (Math.max(0, mapReadyAt - 600) / 1000).toFixed(2);

const cuts = [
  { name: "full", from: "0", mp4: join(OUT, "cairn-demo-full.mp4"), poster: join(OUT, "cairn-demo-full-poster.jpg") },
  { name: "map",  from: trimAt, mp4: join(OUT, "cairn-demo-map.mp4"), poster: join(OUT, "cairn-demo-map-poster.jpg") },
];

const ffmpeg = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;

console.log(`\nraw video:  ${webm}`);
console.log(`map starts: ${trimAt}s in`);

if (!ffmpeg) {
  const install =
    process.platform === "win32"
      ? "winget install Gyan.FFmpeg, then open a new terminal so PATH refreshes"
      : process.platform === "darwin"
        ? "brew install ffmpeg"
        : "sudo apt install ffmpeg";

  console.log(
    `\nNo ffmpeg on PATH, so there's no mp4 and no poster, only the raw webm.` +
      `\nInstall it (${install}) and run:\n` +
      cuts
        .map(
          (cut) =>
            `\n  ffmpeg -ss ${cut.from} -i "${webm}" -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "${cut.mp4}"`,
        )
        .join("") +
      `\n`,
  );
} else {
  // -an because it's a muted loop; libx264 + yuv420p because Safari, iOS
  // especially, is the one that won't take Playwright's VP8/WebM.
  const run = (args) => spawnSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

  for (const cut of cuts) {
    run(["-ss", cut.from, "-i", webm, "-an", "-c:v", "libx264", "-crf", "26",
         "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", cut.mp4]);

    // First frame of that cut, for the phone's poster so it isn't a grey
    // rectangle before anyone presses play.
    run(["-ss", cut.from, "-i", webm, "-frames:v", "1", "-q:v", "4", cut.poster]);
  }

  console.log(`\nwhole run:  ${cuts[0].mp4}`);
  console.log(`map only:   ${cuts[1].mp4}`);
  console.log(`posters:    ${cuts[0].poster}\n            ${cuts[1].poster}`);
  console.log(`\nWatch both, pick one, and copy it into public/hero/.`);
}
