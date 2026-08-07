"use client";

import type { Ref } from "react";
import { Bike, Car, Footprints } from "lucide-react";
import type { Mode } from "../../types";
import StepHeader from "../components/StepHeader";
import TripOption from "../components/TripOption";

type TransportationStepProps = {
  panelRef: Ref<HTMLElement>;
  onBack: () => void;
  onSelectMode: (mode: Mode) => void;
};

export default function TransportationStep({
  panelRef,
  onBack,
  onSelectMode,
}: TransportationStepProps) {
  return (
    <section
      ref={panelRef}
      className="absolute inset-0 flex min-h-0 flex-col bg-sc-bg"
      aria-label="Choose travel mode"
    >
      <StepHeader
        title="How are you getting around?"
        description="Choose how you’re traveling and we’ll shape nearby discoveries around the way you move."
        onBack={onBack}
        backLabel="Return to landing page"
      />

      <div className="mt-auto pb-6 pt-8 sm:pb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-sc-muted">
          Travel mode
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <TripOption
            label="Drive"
            icon={<Car className="size-5" />}
            onClick={() => onSelectMode("driving")}
          />
          <TripOption
            label="Bike"
            icon={<Bike className="size-5" />}
            onClick={() => onSelectMode("biking")}
          />
          <TripOption
            label="Walk"
            icon={<Footprints className="size-5" />}
            onClick={() => onSelectMode("walking")}
          />
        </div>
      </div>
    </section>
  );
}
