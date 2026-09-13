"use client";

import { useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

export type SetupStep = "intent" | "travel" | "audience" | "preferences";

type PanelRefs = Record<SetupStep, RefObject<HTMLElement | null>>;

const order: SetupStep[] = ["intent", "travel", "audience", "preferences"];

export default function useSetupPanelAnimation(
  refs: PanelRefs,
  step: SetupStep,
) {
  const initialized = useRef(false);

  useLayoutEffect(() => {
    const currentIndex = order.indexOf(step);
    const elements = order
      .map((panelStep) => refs[panelStep].current)
      .filter((element): element is HTMLElement => element !== null);

    const context = gsap.context(() => {
      // Establish a correct, invisible-first state synchronously. This prevents
      // inactive setup panels from flashing before GSAP gets its first frame.
      if (!initialized.current) {
        order.forEach((panelStep, index) => {
          const element = refs[panelStep].current;
          if (!element) return;

          gsap.set(element, {
            xPercent: (index - currentIndex) * 100,
            autoAlpha: index === currentIndex ? 1 : 0,
            pointerEvents: index === currentIndex ? "auto" : "none",
          });
        });

        initialized.current = true;
        return;
      }

      order.forEach((panelStep, index) => {
        const element = refs[panelStep].current;
        if (!element) return;

        gsap.to(element, {
          xPercent: (index - currentIndex) * 100,
          autoAlpha: index === currentIndex ? 1 : 0,
          pointerEvents: index === currentIndex ? "auto" : "none",
          duration: 0.42,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      });
    }, elements);

    return () => context.revert();
  }, [refs, step]);
}
