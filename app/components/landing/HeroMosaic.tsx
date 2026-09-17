"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useHeroDim } from "./Hero";

/**
 * The hero's "device demo" visual: a photo mosaic of Santa Cruz spots
 * flanking a phone mockup. Tapping the phone dims everything else down
 * (like house lights going out) so the phone reads as the thing that's lit.
 *
 * All positions/sizes are ported from a 1080px-wide reference mockup and
 * expressed in container-query width units (cqw) via the `cqw()` helper
 * below, so the whole graphic scales fluidly with its wrapper instead of
 * being locked to one pixel size. The reference frame's vertical span is
 * cropped to just the tiles + phone (y 470-1724 of the original 1080x1920
 * canvas, which also had title/tagline text above it that HeroContent
 * already renders separately) -> a 1080 x 1254 crop, hence the aspect-ratio
 * below and every top offset having 470 subtracted from it.
 */

const REF_W = 1080;
const cqw = (px: number) => `${(px / REF_W) * 100}cqw`;

const HERO_TILES = {
  left: [
    {
      src: "/hero/boardwalk.jpg",
      alt: "Cocoanut Grove and the boardwalk rides",
      objectPosition: "78% 42%",
    },
    {
      src: "/hero/mystery-spot.jpg",
      alt: "Mystery Spot entrance",
      objectPosition: "center 30%",
    },
    {
      src: "/hero/neptune.jpg",
      alt: "Neptune's Kingdom entrance",
      objectPosition: "center 25%",
    },
  ],
  right: [
    {
      src: "/hero/hell-hole.jpg",
      alt: "Hell Hole",
      objectPosition: "left center",
    },
    {
      src: "/hero/cave-beach.jpg",
      alt: "Rocky cave to the beach",
      objectPosition: "center 35%",
    },
    {
      src: "/hero/brewery.jpg",
      alt: "Brewery interior",
      objectPosition: "center 40%",
    },
  ],
};

const TILE_W = 250;
const TILE_H = 402;
const TILE_STEP = 416; // 402 + 14px gap

function HeroTile({
  src,
  alt,
  objectPosition,
  side,
  index,
}: {
  src: string;
  alt: string;
  objectPosition: string;
  side: "left" | "right";
  index: number;
}) {
  return (
    <div
      className="absolute overflow-hidden rounded-[14px] shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
      style={{
        [side]: cqw(16),
        top: cqw(index * TILE_STEP),
        width: cqw(TILE_W),
        height: cqw(TILE_H),
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="25vw"
        className="object-cover"
        style={{
          objectPosition,
          filter: "brightness(0.78) saturate(1.15) contrast(1.03)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[#14201c] opacity-[0.32] mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_46px_14px_rgba(20,32,28,0.55)]" />
    </div>
  );
}

export default function HeroMosaic() {
  const [playing, setPlaying] = useState(false);
  const setBgDim = useHeroDim();
  const tilesRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const breatheTween = useRef<gsap.core.Tween | null>(null);

  const startBreathing = () => {
    breatheTween.current?.kill();
    if (!playBtnRef.current) return;
    breatheTween.current = gsap.to(playBtnRef.current, {
      y: "-0.5rem",
      scale: 1.05,
      duration: 1.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  };

  useEffect(() => {
    startBreathing();
    return () => breatheTween.current?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    setBgDim(next);

    breatheTween.current?.kill();
    gsap.killTweensOf([
      tilesRef.current,
      phoneRef.current,
      glowRef.current,
      playBtnRef.current,
    ]);

    if (next) {
      gsap.to(playBtnRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(tilesRef.current, {
        opacity: 0.06,
        duration: 1.2,
        ease: "power2.out",
      });
      gsap.to(phoneRef.current, {
        scale: 1.04,
        duration: 1.2,
        ease: "power2.out",
      });
      gsap.to(glowRef.current, {
        opacity: 0.28,
        duration: 1.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(tilesRef.current, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      });
      gsap.to(phoneRef.current, {
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      });
      gsap.to(glowRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });
      startBreathing();
    }
  };

  return (
    <div
      className="cq-hero relative mx-auto w-full max-w-[420px]"
      style={{ aspectRatio: `${REF_W} / 1254`, marginTop: "0.5rem" }}
    >
      <div ref={tilesRef}>
        {HERO_TILES.left.map((tile, i) => (
          <HeroTile key={tile.src} side="left" index={i} {...tile} />
        ))}
        {HERO_TILES.right.map((tile, i) => (
          <HeroTile key={tile.src} side="right" index={i} {...tile} />
        ))}
      </div>

      {/* Phone mockup */}
      <div
        ref={phoneRef}
        className="absolute left-1/2 z-10 box-border -translate-x-1/2 border-[3px] border-cairn-text bg-[#0a100f] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        style={{
          top: `calc(${cqw(576 - 470)} - 0.5rem)`,
          width: cqw(588),
          height: cqw(1148),
          padding: cqw(20),
          borderRadius: cqw(78),
          transformOrigin: "center bottom",
        }}
      >
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 opacity-0 shadow-[0_0_32px_10px_rgba(210,162,76,0.28)]"
          style={{ borderRadius: cqw(90) }}
        />
        <div
          className="relative h-full w-full overflow-hidden bg-cairn-card"
          style={{ borderRadius: cqw(40) }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#0a100f]"
            style={{ top: cqw(18), width: cqw(140), height: cqw(22) }}
          />
          <button
            ref={playBtnRef}
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause preview" : "Play preview"}
            aria-pressed={playing}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-cairn-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cairn-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cairn-bg"
            style={{ width: cqw(136), height: cqw(136) }}
          >
            <span
              className="block"
              style={{
                marginLeft: cqw(10),
                width: 0,
                height: 0,
                borderTop: `${cqw(42)} solid transparent`,
                borderBottom: `${cqw(42)} solid transparent`,
                borderLeft: `${cqw(64)} solid var(--cairn-bg)`,
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
