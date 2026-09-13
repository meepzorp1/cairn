"use client";

import { Sparkles } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        data-hero
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-cairn-border bg-cairn-bg/55 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-cairn-muted backdrop-blur-md sm:text-xs"
      >
        <Sparkles className="size-3.5 text-cairn-gold" aria-hidden="true" />
        <span>Built for Santa Cruz students, locals, and explorers</span>
      </div>

      <p
        data-hero
        className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cairn-gold drop-shadow-[0_2px_10px_rgba(10,15,12,0.65)] sm:text-sm"
      >
        Discover what others missed
      </p>

      <h1
        data-hero
        className="font-display bg-linear-to-b from-cairn-text via-[#e5d6ae] to-cairn-gold bg-clip-text text-7xl font-semibold leading-none tracking-[-0.055em] text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.32)] sm:text-8xl lg:text-[7rem]"
      >
        Cairn
      </h1>

      <p
        data-hero
        className="mt-5 max-w-xl font-display text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-cairn-text drop-shadow-[0_2px_14px_rgba(10,15,12,0.65)] sm:text-4xl"
      >
        This is worth exploring.
      </p>

      <p
        data-hero
        className="mt-4 max-w-md text-base leading-7 text-cairn-muted drop-shadow-[0_2px_10px_rgba(10,15,12,0.65)] sm:text-lg sm:leading-8"
      >
        Find the local favorites, overlooked places, and unexpected stops hiding around you.
      </p>
    </div>
  );
}
