"use client";

import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

export type SetupStep = "intent" | "travel" | "audience" | "preferences";

type PanelRefs = Record<SetupStep, RefObject<HTMLElement | null>>;

const order: SetupStep[] = ["intent", "travel", "audience", "preferences"];

export default function useSetupPanelAnimation(
  refs: PanelRefs,
  step: SetupStep,
) {
  useLayoutEffect(() => {
    const currentIndex = order.indexOf(step);

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
  }, [refs, step]);
}
