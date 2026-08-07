"use client";

import { useRef } from "react";
import { Compass } from "lucide-react";
import gsap from "gsap";

type ReadyButtonProps = {
  onClick: () => void;
};

export default function ReadyButton({ onClick }: ReadyButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  const handlePress = () => {
    gsap.killTweensOf([
      buttonRef.current,
      glowRef.current,
      iconRef.current,
    ]);

    gsap.to(buttonRef.current, {
      scale: 0.96,
      y: 2,
      duration: 0.16,
      ease: "power2.out",
    });

    gsap.to(glowRef.current, {
      opacity: 0.8,
      scale: 1.08,
      duration: 0.2,
      ease: "power2.out",
    });

    gsap.to(iconRef.current, {
      rotate: -10,
      scale: 0.92,
      duration: 0.16,
      ease: "power2.out",
    });
  };

  const handleRelease = () => {
    gsap.killTweensOf([
      buttonRef.current,
      glowRef.current,
      iconRef.current,
    ]);

    const timeline = gsap.timeline();

    timeline
      .to(buttonRef.current, {
        scale: 1.08,
        y: -2,
        duration: 0.16,
        ease: "back.out(2.8)",
      })
      .to(buttonRef.current, {
        scale: 1,
        y: 0,
        duration: 0.22,
        ease: "power2.out",
      });

    gsap.to(glowRef.current, {
      opacity: 0,
      scale: 1.3,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.fromTo(
      iconRef.current,
      {
        rotate: 12,
        scale: 1.25,
      },
      {
        rotate: 0,
        scale: 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.45)",
      },
    );
  };

  const handleClick = () => {
    handleRelease();
    onClick();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={handlePress}
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onPointerLeave={(event) => {
        if (event.buttons === 1) {
          handleRelease();
        }
      }}
      onClick={handleClick}
      className="absolute inset-x-4 bottom-6 flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-full border border-sc-sun/40 bg-sc-raised px-8 py-4 font-semibold text-sc-text shadow-lg transition-colors hover:border-sc-sun/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-sun lg:right-6 lg:left-auto lg:w-80"
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-sc-sun-soft opacity-0 blur-xl"
      />

      <span>Are You Ready?</span>

      <Compass
        ref={iconRef}
        aria-hidden="true"
        className="size-5 text-sc-sun"
      />
    </button>
  );
}