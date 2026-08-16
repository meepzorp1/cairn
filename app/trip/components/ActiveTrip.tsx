"use client";

import { useState } from "react";

import SelectedPlaceModal from "@/app/components/modals/SelectedPlaceModal";
import type { Place } from "@/app/place";
import useActiveTrip from "@/app/trip/hooks/useActiveTrip";
import type { Options } from "../types";
import Map from "./Map";
import MapDrawer from "./MapDrawer";
import MapHeader from "./MapHeader";

type ActiveTripProps = {
  trip: Options;
  onEndTrip: () => void;
};

export default function ActiveTrip({ trip, onEndTrip }: ActiveTripProps) {
  const [placesExpanded, setPlacesExpanded] = useState(false);
  const [exploreAlongRoute, setExploreAlongRoute] = useState(false);
  const [routeStopId, setRouteStopId] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] = useState<Place | null>(null);

  const {
    location,
    status,
    locationError,
    startTracking,
    placesLoading,
    placesError,
    refresh,
    discoveries,
    selectedDiscovery,
    selectedDiscoveryId,
    selectDiscovery,
    selectedPlace,
    openPlace,
    closePlace,
  } = useActiveTrip(trip, exploreAlongRoute);

  const destinationPlace =
    trip.intent === "destination"
      ? discoveries.find(({ place }) => place.id === trip.destination.placeId)?.place ?? null
      : activeDestination;

  const destinationDiscovery = destinationPlace
    ? discoveries.find(({ place }) => place.id === destinationPlace.id) ?? null
    : null;

  const hasActiveRoute = destinationPlace !== null;

  const routeStop =
    routeStopId !== null
      ? discoveries.find(({ place }) => place.id === routeStopId) ?? null
      : null;

  const routeDestination = destinationPlace?.location ?? null;

  const selectedIsDestination = selectedDiscovery?.place.id === destinationPlace?.id;
  const selectedIsRouteStop = selectedDiscovery?.place.id === routeStopId;

  const handleSetDestination = (place: Place) => {
    setActiveDestination(place);
    selectDiscovery(place.id);
    setExploreAlongRoute(false);
    setRouteStopId(null);
    setPlacesExpanded(false);
  };

  const handleToggleRouteStop = (placeId: string) => {
    setRouteStopId((current) => (current === placeId ? null : placeId));
  };

  if (!location) {
    return (
      <section className="flex min-h-dvh flex-col items-center justify-center bg-sc-bg px-6 text-center text-sc-text">
        <div className="max-w-sm">
          <h1 className="text-xl font-semibold">
            {status === "unavailable" || status === "denied"
              ? "Location unavailable"
              : "Finding your location"}
          </h1>

          <p className="mt-3 text-sm text-sc-muted">
            {locationError ?? "Allow location access so we can find real places near you."}
          </p>

          <button
            type="button"
            onClick={startTracking}
            className="mt-5 rounded-xl bg-sc-ocean px-4 py-3 font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-dvh flex-col bg-sc-bg text-sc-text">
      <MapHeader
        trip={trip}
        destinationPlace={destinationPlace}
        destinationDiscovery={destinationDiscovery}
        placesLoading={placesLoading}
        discoveries={discoveries}
        exploreAlongRoute={exploreAlongRoute}
        onExploreAlongRouteChange={setExploreAlongRoute}
        openPlace={openPlace}
        onEndTrip={onEndTrip}
      />

      <div className="relative min-h-0 flex-1">
        <Map
          mode={trip.mode}
          location={location}
          discoveries={discoveries}
          selectedDiscoveryId={selectedDiscoveryId}
          routeDestination={routeDestination}
          routeStop={routeStop?.place.location ?? null}
          onSelectPlace={selectDiscovery}
        />

        <MapDrawer
          expanded={placesExpanded}
          discoveries={discoveries}
          selectedDiscovery={selectedDiscovery}
          selectedDiscoveryId={selectedDiscoveryId}
          placesLoading={placesLoading}
          placesError={placesError}
          hasActiveRoute={hasActiveRoute}
          selectedIsDestination={selectedIsDestination}
          selectedIsRouteStop={selectedIsRouteStop}
          onToggle={() => setPlacesExpanded((current) => !current)}
          onRefresh={refresh}
          onSelectDiscovery={selectDiscovery}
          onOpenPlace={openPlace}
          onSetDestination={handleSetDestination}
          onToggleRouteStop={handleToggleRouteStop}
        />
      </div>

      {selectedPlace && (
        <SelectedPlaceModal
          place={selectedPlace}
          onClose={closePlace}
          onStartRoute={handleSetDestination}
        />
      )}
    </section>
  );
}
