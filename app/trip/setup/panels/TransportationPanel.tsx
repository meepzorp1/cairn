"use client";

import TransportationOption from "@/app/trip/setup/TransportationOption";
import PanelHeader from "@/app/trip/setup/PanelHeader";
import { Mode } from "@/app/types/trip";

import { Car, Bike, Footprints } from "lucide-react";

export default function TransportationStep({
  transportationPageRef,
  onBack,
  onSelectMode,
}: {
  transportationPageRef: React.Ref<HTMLDivElement>;
  onBack: () => void;
  mode: Mode | null;
  onSelectMode: (mode: "driving" | "biking" | "walking") => void;
}) {

  const handleModeSelect = (selectedMode: "driving" | "biking" | "walking") => {
    onSelectMode(selectedMode);
  }

    return (
        <section
        ref={transportationPageRef}
            className="TRANSPORTATION PANEL absolute z-50 inset-0 flex min-h-0 flex-col justify-between bg-sc-bg"
            aria-label="Choose travel mode"
          >
            <PanelHeader
              title="How are you getting around?"
              description="Choose how you are traveling and we’ll shape nearby discoveries around your trip."
              onBack={onBack}
              backLabel="Return to landing page"
            />

            {/** TRAVEL MODE/TRIPOPTIONS */}

            <div className="pt-6 flex flex-col w-full gap-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Travel mode
              </p>

              <TransportationOption
                label="Drive"
                icon={Car}
                onClick={() => handleModeSelect("driving")}
              />

              <TransportationOption
                label="Bike"
                icon={Bike}
                onClick={() => handleModeSelect("biking")}
              />

              <TransportationOption
                label="Walk"
                icon={Footprints}
                onClick={() => handleModeSelect("walking")}
              />
            </div>
          </section>
          )
        }