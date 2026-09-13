"use client";

import { Compass, MapPinned, Navigation } from "lucide-react";
import type { Intent } from "../../types";
import StepHeader from "../components/StepHeader";


type IntentStepProps = {
  onBack: () => void;
  onSelectIntent: (intent: Intent) => void;
};

export default function IntentStep({
  onBack,
  onSelectIntent,
}: IntentStepProps) {
  return (
    <section
      className="flex h-full min-h-0 flex-col"
      aria-label="Choose how to explore"
    >
      <StepHeader
        title="What are you up for?"
        description="Explore what’s around you, or make the trip there part of the adventure."
        onBack={onBack}
        backLabel="Return to landing page"
        eyebrow="Plan your next move"
        eyebrowIcon={<Compass className="size-3.5" />}
      />

      <div className="mt-8 flex flex-col gap-3.5 pb-6 sm:mt-10 sm:pb-10">
        <button
          type="button"
          onClick={() => onSelectIntent("nearby")}
          className="group flex w-full items-start gap-4 rounded-2xl border border-cairn-border/70 bg-cairn-card/60 p-5 text-left transition hover:border-cairn-gold hover:bg-cairn-raised active:scale-[0.99]"
        >
          <span className="flex size-10.5 shrink-0 items-center justify-center rounded-xl bg-cairn-gold-soft text-cairn-gold">
            <MapPinned className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-medium text-cairn-text">Explore Nearby</p>
            <p className="mt-1.5 max-w-52 text-sm leading-5.5 text-cairn-muted">
              Start with where you are and discover what’s worth checking out nearby.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectIntent("destination")}
          className="group flex w-full items-start gap-4 rounded-2xl border border-cairn-border/70 bg-cairn-card/60 p-5 text-left transition hover:border-cairn-gold hover:bg-cairn-raised active:scale-[0.99]"
        >
          <span className="flex size-10.5 shrink-0 items-center justify-center rounded-xl bg-cairn-gold-soft text-cairn-gold">
            <Navigation className="size-5" />
          </span>
          <div>
            <p className="font-display text-lg font-medium text-cairn-text">I’m Going Somewhere</p>
            <p className="mt-1.5 max-w-52 text-sm leading-5.5 text-cairn-muted">
              Already have somewhere in mind? We’ll build discoveries around the way there.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
