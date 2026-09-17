"use client";

import { Sparkles } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center text-center">
      {/* <div
        data-hero
        className="mb-7 inline-flex items-center rounded-full border border-cairn-border bg-cairn-bg/55 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-cairn-muted backdrop-blur-md sm:text-xs"
      >
        <Sparkles className="size-3.5 text-cairn-gold" aria-hidden="true" />
        <span>Built for Santa Cruz students, locals, and explorers</span>
      </div> */}

      <p
        data-hero
        className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cairn-gold drop-shadow-[0_2px_10px_rgba(10,15,12,0.65)] sm:text-sm"
      >
        Discover what others missed
      </p>

      <h1
        data-hero
        data-text="Cairn"
        className="cairn-title font-display bg-linear-to-b from-cairn-text via-[#e5d6ae] to-cairn-gold bg-clip-text text-7xl font-semibold leading-none tracking-[-0.055em] text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.32)] sm:text-8xl lg:text-[7rem]"
      >
        Cairn
      </h1>
    </div>
  );
}
