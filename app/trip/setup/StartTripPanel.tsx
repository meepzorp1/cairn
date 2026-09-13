"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import type {
  Audience,
  Destination,
  Intent,
  Mode,
  Options,
  Preferences,
} from "../types";
import { DestinationModal } from "@/app/components/modals";
import AudienceStep from "./steps/AudienceStep";
import IntentStep from "./steps/IntentStep";
import PreferencesStep from "./steps/PreferencesStep";
import TransportationStep from "./steps/TransportationStep";
import { TRIP_PRESETS, copyTripPreferences } from "../components/presets";

export type SetupStep = "intent" | "travel" | "audience" | "preferences";
type Direction = 1 | -1;

const stepOrder: SetupStep[] = ["intent", "travel", "audience", "preferences"];

type StartTripPanelProps = {
  initialAudience?: Audience | null;
  onBack: () => void;
  onStartTrip: (options: Options) => void;
};

export default function StartTripPanel({
  initialAudience = null,
  onBack,
  onStartTrip,
}: StartTripPanelProps) {
  const [step, setStep] = useState<SetupStep>("intent");
  const [direction, setDirection] = useState<Direction>(1);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [audience, setAudience] = useState<Audience | null>(initialAudience);
  const [preferences, setPreferences] = useState<Preferences>(() =>
    copyTripPreferences(TRIP_PRESETS[initialAudience ?? "custom"]),
  );
  const activePanelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useLayoutEffect(() => {
    const panel = activePanelRef.current;
    if (!panel) return;

    if (firstRender.current) {
      gsap.set(panel, { xPercent: 0, autoAlpha: 1 });
      firstRender.current = false;
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        panel,
        { xPercent: direction * 14, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.38, ease: "power3.out" },
      );
    }, panel);

    return () => context.revert();
  }, [step, direction]);

  const goToStep = (next: SetupStep) => {
    setDirection(stepOrder.indexOf(next) >= stepOrder.indexOf(step) ? 1 : -1);
    setStep(next);
  };

  const canStart =
    intent !== null &&
    (intent === "nearby" || destination !== null) &&
    mode !== null &&
    audience !== null &&
    preferences.interests.length > 0;

  const selectIntent = (selectedIntent: Intent) => {
    if (selectedIntent === "destination") {
      setDestinationModalOpen(true);
      return;
    }
    setIntent("nearby");
    setDestination(null);
    goToStep("travel");
  };

  const confirmDestination = (selectedDestination: Destination) => {
    setIntent("destination");
    setDestination(selectedDestination);
    setDestinationModalOpen(false);
    goToStep("travel");
  };

  const selectMode = (selectedMode: Mode) => {
    setMode(selectedMode);
    goToStep("audience");
  };

  const selectAudience = (selectedAudience: Audience) => {
    setAudience(selectedAudience);
    setPreferences(copyTripPreferences(TRIP_PRESETS[selectedAudience]));
    goToStep("preferences");
  };

  const start = () => {
    if (!intent || !mode || !audience || !canStart) return;
    if (intent === "destination") {
      if (!destination) return;
      onStartTrip({ intent, destination, mode, audience, preferences });
      return;
    }
    onStartTrip({ intent, mode, audience, preferences });
  };

  const activeStep = (() => {
    switch (step) {
      case "intent":
        return <IntentStep onBack={onBack} onSelectIntent={selectIntent} />;
      case "travel":
        return (
          <TransportationStep
            onBack={() => goToStep("intent")}
            onSelectMode={selectMode}
          />
        );
      case "audience":
        return (
          <AudienceStep
            audience={audience}
            onBack={() => goToStep("travel")}
            onSelectAudience={selectAudience}
          />
        );
      case "preferences":
        return (
          <PreferencesStep
            preferences={preferences}
            onBack={() => goToStep("audience")}
            onChange={setPreferences}
          />
        );
    }
  })();

  return (
    <main className="relative h-dvh min-h-0 w-full text-cairn-text">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(210,162,76,0.11),transparent_42%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-cairn-bg/20 via-cairn-bg/70 to-cairn-bg" />

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-md flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:max-w-3xl sm:px-8">
        <div className="flex shrink-0 items-center gap-2 text-cairn-gold">
          <Sparkles className="size-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">Start exploring</span>
        </div>

        <div className="relative mt-5 min-h-0 flex-1 overflow-hidden">
          <div ref={activePanelRef} key={step} className="h-full min-h-0">
            {activeStep}
          </div>
        </div>

        <footer className="shrink-0 border-t border-cairn-border/70 bg-cairn-bg/95 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur">
          <button
            type="button"
            disabled={!canStart}
            onClick={start}
            className="flex h-12 w-full items-center justify-center rounded-xl px-4 font-semibold transition enabled:bg-cairn-gold enabled:text-cairn-bg enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-cairn-card/70 disabled:text-cairn-muted"
          >
            Start exploring
          </button>
        </footer>
      </div>

      <DestinationModal
        isOpen={destinationModalOpen}
        onClose={() => setDestinationModalOpen(false)}
        onConfirm={confirmDestination}
      />
    </main>
  );
}
