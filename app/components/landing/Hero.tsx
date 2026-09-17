"use client";

import { createContext, useContext, useRef } from "react";
import gsap from "gsap";

type HeroProps = {
  children: React.ReactNode;
};

/**
 * Lets HeroMosaic's tap-to-play "theater dim" reach beyond its own bounds
 * to fade this whole hero's background mosaic too, even though HeroMosaic
 * is authored as Hero's `children` from page.tsx rather than nested code
 * here. React context still propagates through the actual render tree
 * (children render inside Hero's returned JSX), so HeroMosaic can consume
 * this without Hero needing to know about it directly.
 */
const HeroDimContext = createContext<(playing: boolean) => void>(() => {});

export function useHeroDim() {
  return useContext(HeroDimContext);
}

const BG_OPACITY_IDLE = 0.65;
const BG_OPACITY_PLAYING = 0.04;

export default function Hero({ children }: HeroProps) {
  const bgImageRef = useRef<HTMLDivElement>(null);

  const setDim = (playing: boolean) => {
    gsap.to(bgImageRef.current, {
      opacity: playing ? BG_OPACITY_PLAYING : BG_OPACITY_IDLE,
      duration: 1.2,
      ease: "power2.out",
    });
  };

  return (
    <section className="relative min-h-dvh overflow-hidden bg-cairn-bg text-cairn-text">
      <div
        ref={bgImageRef}
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero/mosaic-bg.jpg')",
          opacity: BG_OPACITY_IDLE,
        }}
      />

      {/* Keep the mosaic present, but make the center readable and let it disappear into Cairn's dark UI. */}
      <div aria-hidden="true" className="absolute inset-0 bg-cairn-bg/12" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_31%,transparent_0%,rgba(10,15,12,0.06)_35%,rgba(10,15,12,0.5)_82%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-cairn-bg/10 via-cairn-bg/30 to-cairn-bg"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[44%] bg-linear-to-b from-transparent to-cairn-bg"
      />

      <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-end px-6 pb-12 pt-24 sm:pt-24">
        <HeroDimContext.Provider value={setDim}>
          {children}
        </HeroDimContext.Provider>
      </div>
    </section>
  );
}
