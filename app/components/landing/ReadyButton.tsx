"use client";

import { useRef } from "react";
import { Compass } from "lucide-react";
import gsap from "gsap";

type ReadyButtonProps = { onClick: () => void };

export default function ReadyButton({ onClick }: ReadyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  const handlePress = () => {
    gsap.killTweensOf([buttonRef.current, glowRef.current, iconRef.current]);
    gsap.to(buttonRef.current, { scale: 0.97, y: 2, duration: 0.14, ease: "power2.out" });
    gsap.to(glowRef.current, { opacity: 0.7, scale: 1.05, duration: 0.18 });
    gsap.to(iconRef.current, { rotate: -55, duration: 0.18, ease: "power2.out" });
  };

  const handleRelease = () => {
    gsap.killTweensOf([buttonRef.current, glowRef.current, iconRef.current]);
    gsap.to(buttonRef.current, { scale: 1, y: 0, duration: 0.24, ease: "back.out(2)" });
    gsap.to(glowRef.current, { opacity: 0, scale: 1.2, duration: 0.35 });
    gsap.to(iconRef.current, { rotate: 0, duration: 0.35, ease: "back.out(2)" });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onPointerLeave={(event) => event.buttons === 1 && handleRelease()}
      onClick={() => {
        handleRelease();
        onClick();
      }}
      className="group relative flex min-h-14 w-full max-w-xs items-center justify-center gap-3 overflow-hidden rounded-full bg-cairn-gold px-8 py-4 font-semibold text-cairn-bg shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition-colors hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cairn-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cairn-bg"
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-cairn-text/20 opacity-0 blur-xl"
      />
      <span>Are You Ready?</span>
      <Compass ref={iconRef} aria-hidden="true" className="size-5 text-cairn-bg" />
    </button>
  );
}
