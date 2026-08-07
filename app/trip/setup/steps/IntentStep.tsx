"use client";

import type { Ref } from "react";
import { MapPinned, Navigation } from "lucide-react";
import type { Intent } from "../../types";
import StepHeader from "../components/StepHeader";


type IntentStepProps = {
  panelRef: Ref<HTMLElement>;
  onBack: () => void;
  onSelectIntent: (intent: Intent) => void;
};

export default function IntentStep({
  panelRef,
  onBack,
  onSelectIntent,
}: IntentStepProps) {
  return (
    <section
      ref={panelRef}
      className="absolute inset-0 flex min-h-0 flex-col bg-sc-bg"
      aria-label="Choose how to explore"
    >
      <StepHeader
        title="What are you up for?"
        description="Explore what’s around you, or make the trip there part of the adventure."
        onBack={onBack}
        backLabel="Return to landing page"
      />

      <div className="mt-auto grid gap-3 pb-6 pt-8 sm:grid-cols-2 sm:pb-10">
        <button
          type="button"
          onClick={() => onSelectIntent("nearby")}
          className="group flex min-h-28 flex-col items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-sc-ocean hover:bg-sc-ocean-soft active:scale-[0.98]"
        >
          <MapPinned className="size-6 text-sc-ocean" />
          <div>
            <p className="font-semibold text-sc-text">Explore Nearby</p>
            <p className="mt-1 text-sm leading-5 text-sc-muted">
              Start with where you are and discover what’s worth checking out nearby.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectIntent("destination")}
          className="group flex min-h-28 flex-col items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-sc-sun hover:bg-sc-sun-soft active:scale-[0.98]"
        >
          <Navigation className="size-6 text-sc-sun" />
          <div>
            <p className="font-semibold text-sc-text">I’m Going Somewhere</p>
            <p className="mt-1 text-sm leading-5 text-sc-muted">
              Already have somewhere in mind? We’ll build discoveries around the way there.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
