"use client";

import { Sparkles } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="relative flex flex-1 flex-col px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
      <div className="max-w-3xl">
        <div
          data-hero
          className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/15 px-4 py-2 text-xs text-white/60 backdrop-blur-md sm:text-sm lg:mt-22 lg:mb-12"
        >
          <Sparkles className="size-4 shrink-0 text-sc-sun" />

          <span>
            Built for Santa Cruz students, locals, and explorers
          </span>
        </div>
        <p
          data-hero
          className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-sc-sun sm:text-sm"
        >
          Discover what others missed
        </p>

        <h1
          data-hero
          className="text-6xl font-black tracking-[-0.055em] text-white sm:text-7xl lg:text-8xl"
        >
          Cairn
        </h1>

        <p
          data-hero
          className="mt-5 max-w-xl text-2xl font-semibold leading-tight text-sc-text sm:text-3xl"
        >
          This is worth exploring.
        </p>

        <p
          data-hero
          className="mt-4 max-w-lg text-base leading-7 text-sc-muted sm:text-lg sm:leading-8"
        >
          Find the local favorites, overlooked places, and unexpected stops
          hiding around you.
        </p>
      </div>

      <div className="mt-9 sm:mt-11">

      </div>
    </div>
  );
}