"use client";

import MapSection from "@/app/trip/components/MapSection";
import type { Coordinates, Discovery, Mode } from "../types";

export type MapProps = {
  mode: Mode;
  location: Coordinates;
  discoveries: Discovery[];
  selectedDiscoveryId: string | null;
  routeDestination: Coordinates | null;
  routeStop: Coordinates | null;
  onSelectPlace: (placeId: string) => void;
};

export default function Map({
  mode,
  location,
  discoveries,
  selectedDiscoveryId,
  routeDestination,
  routeStop,
  onSelectPlace,
}: MapProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-cairn-card">
      <MapSection
        mode={mode}
        location={location}
        discoveries={discoveries}
        selectedPlaceId={selectedDiscoveryId}
        routeDestination={routeDestination}
        routeStop={routeStop}
        onSelectPlace={onSelectPlace}
      />
    </div>
  );
}
