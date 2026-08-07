"use client";

import {
  ChevronDown,
  ChevronUp,
  Compass,
  Footprints,
  MapPin,
  Route,
  X,
} from "lucide-react";
import { useState } from "react";

import type { Place } from "@/app/place";
import SelectedPlaceModal from "@/app/components/modals/SelectedPlaceModal";
import MapSection from "@/app/trip/components/MapSection";
import useActiveTrip from "@/app/trip/hooks/useActiveTrip";
import Discoveries from "./Discoveries";
import type { Options } from "../types";

type ActiveTripProps = {
  trip: Options;
  onEndTrip: () => void;
};

export default function ActiveTrip({
  trip,
  onEndTrip,
}: ActiveTripProps) {
  const [placesExpanded, setPlacesExpanded] = useState(false);
  const [exploreAlongRoute, setExploreAlongRoute] = useState(false);
  const [routeStopId, setRouteStopId] = useState<string | null>(null);
  const [activeDestination, setActiveDestination] =
    useState<Place | null>(null);

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
      ? discoveries.find(
          ({ place }) => place.id === trip.destination.placeId,
        )?.place ?? null
      : activeDestination;

  const destinationDiscovery =
    destinationPlace
      ? discoveries.find(
          ({ place }) => place.id === destinationPlace.id,
        ) ?? null
      : null;

  const hasActiveRoute = destinationPlace !== null;

  const routeStop =
    routeStopId !== null
      ? discoveries.find(
          ({ place }) => place.id === routeStopId,
        ) ?? null
      : null;

  const routeDestination =
    destinationPlace?.location ?? null;

  const selectedIsDestination =
    selectedDiscovery?.place.id === destinationPlace?.id;

  const selectedIsRouteStop =
    selectedDiscovery?.place.id === routeStopId;

  const handleSetDestination = (place: Place) => {
    setActiveDestination(place);
    selectDiscovery(place.id);
    setExploreAlongRoute(false);
    setRouteStopId(null);
    setPlacesExpanded(false);
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
            {locationError ??
              "Allow location access so we can find real places near you."}
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
      <header className="relative z-30 shrink-0 border-b border-white/10 bg-sc-panel">
        <div className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            {destinationPlace ? (
              <button
                type="button"
                onClick={() => openPlace(destinationPlace.id)}
                className="flex w-full min-w-0 items-center gap-3 text-left"
                aria-label={`Open details for ${destinationPlace.name}`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sc-ocean-soft text-sc-ocean">
                  <MapPin className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sc-ocean">
                    Destination
                  </p>

                  <p className="truncate text-sm font-semibold">
                    {destinationPlace.name}
                  </p>

                  {destinationDiscovery && (
                    <p className="mt-0.5 text-xs text-sc-muted">
                      {destinationDiscovery.distance} ·{" "}
                      {destinationDiscovery.duration}
                    </p>
                  )}
                </div>
              </button>
            ) : (
              <div>
                <p className="text-sm font-semibold">
                  Exploring nearby
                </p>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-sc-muted">
                  <span>
                    {trip.mode} · {trip.audience}
                  </span>

                  <span className="text-white/20">•</span>

                  {placesLoading ? (
                    <span className="flex items-center gap-1.5 text-sc-ocean">
                      <span className="size-1.5 animate-pulse rounded-full bg-current" />

                      {discoveries.length > 0
                        ? `Updating ${discoveries.length} ${
                            discoveries.length === 1
                              ? "place"
                              : "places"
                          }…`
                        : "Searching…"}
                    </span>
                  ) : (
                    <span>
                      {discoveries.length}{" "}
                      {discoveries.length === 1
                        ? "place"
                        : "places"}{" "}
                      found
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onEndTrip}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-sc-muted transition hover:text-sc-text"
            aria-label="End exploration"
          >
            <X className="size-5" />
          </button>
        </div>

        {hasActiveRoute && (
          <>
            <div className="px-4 pb-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-sc-muted">
                <span>
                  {trip.mode} · {trip.audience}
                </span>

                <span className="text-white/20">•</span>

                {placesLoading ? (
                  <span className="flex items-center gap-1.5 text-sc-ocean">
                    <span className="size-1.5 animate-pulse rounded-full bg-current" />

                    {discoveries.length > 0
                      ? `Updating ${discoveries.length} ${
                          discoveries.length === 1
                            ? "place"
                            : "places"
                        }…`
                      : "Searching…"}
                  </span>
                ) : (
                  <span>
                    {discoveries.length}{" "}
                    {discoveries.length === 1
                      ? "place"
                      : "places"}{" "}
                    found
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 px-4 pb-3">
              <button
                type="button"
                aria-pressed={exploreAlongRoute}
                onClick={() =>
                  setExploreAlongRoute(true)
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  exploreAlongRoute
                    ? "border-sc-ocean/60 bg-sc-ocean-soft text-sc-ocean"
                    : "border-white/10 bg-sc-raised text-sc-muted hover:text-sc-text"
                }`}
              >
                <Compass className="size-4" />
                Explore
              </button>

              <button
                type="button"
                aria-pressed={!exploreAlongRoute}
                onClick={() =>
                  setExploreAlongRoute(false)
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  !exploreAlongRoute
                    ? "border-sc-ocean/60 bg-sc-ocean-soft text-sc-ocean"
                    : "border-white/10 bg-sc-raised text-sc-muted hover:text-sc-text"
                }`}
              >
                <Route className="size-4" />
                Stay on Route
              </button>
            </div>
          </>
        )}
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0 flex items-center justify-center bg-sc-raised">
          <MapSection
            mode={trip.mode}
            location={location}
            discoveries={discoveries}
            selectedPlaceId={selectedDiscoveryId}
            routeDestination={routeDestination}
            routeStop={routeStop?.place.location ?? null}
            onSelectPlace={selectDiscovery}
          />
        </div>

        <div
          className={`absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-4xl border-t border-white/10 bg-sc-panel/95 shadow-[0_-20px_60px_rgba(2,6,23,.8)] backdrop-blur-xl transition-[height] duration-300 ${
            placesExpanded ? "h-[72dvh]" : "h-42"
          }`}
        >
          <button
            type="button"
            onClick={() =>
              setPlacesExpanded((current) => !current)
            }
            className="mx-auto mt-2 flex h-7 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-sc-raised text-sc-muted"
            aria-label={
              placesExpanded
                ? "Collapse nearby places"
                : "Expand nearby places"
            }
            aria-expanded={placesExpanded}
          >
            {placesExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronUp className="size-4" />
            )}
          </button>

          {placesExpanded ? (
            <Discoveries
              discoveries={discoveries}
              selectedId={selectedDiscoveryId}
              isLoading={placesLoading}
              error={placesError}
              onRefresh={refresh}
              onSelectPlace={(discovery) => {
                selectDiscovery(discovery.place.id);
                setPlacesExpanded(false);
              }}
              onOpenPlace={(discovery) =>
                openPlace(discovery.place.id)
              }
            />
          ) : (
            <div className="flex min-h-0 flex-1 items-center px-3 pb-3">
              {placesLoading &&
              discoveries.length === 0 ? (
                <p className="px-1 text-sm text-sc-muted">
                  Searching nearby…
                </p>
              ) : selectedDiscovery ? (
                <div className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-sc-raised px-3 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      openPlace(
                        selectedDiscovery.place.id,
                      )
                    }
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-label={`Open details for ${selectedDiscovery.place.name}`}
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sc-ocean-soft text-sc-ocean">
                      <Footprints className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-sc-muted">
                        {selectedDiscovery.place
                          .primaryTypeLabel ??
                          selectedDiscovery.place.primaryType?.replaceAll(
                            "_",
                            " ",
                          ) ??
                          "Nearby place"}
                      </p>

                      <p className="truncate font-semibold">
                        {selectedDiscovery.place.name}
                      </p>

                      <p className="mt-1 text-xs text-sc-muted">
                        {selectedDiscovery.distance} ·{" "}
                        {selectedDiscovery.duration}
                      </p>
                    </div>
                  </button>

                  {!hasActiveRoute && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSetDestination(
                          selectedDiscovery.place,
                        )
                      }
                      className="shrink-0 rounded-xl bg-sc-sun px-3 py-2 text-xs font-semibold text-sc-bg transition hover:opacity-90 active:scale-[0.98]"
                    >
                      Set destination
                    </button>
                  )}

                  {hasActiveRoute &&
                    !selectedIsDestination && (
                      <button
                        type="button"
                        onClick={() =>
                          setRouteStopId(
                            selectedIsRouteStop
                              ? null
                              : selectedDiscovery.place.id,
                          )
                        }
                        className="shrink-0 rounded-xl border border-sc-sun/40 bg-sc-sun-soft px-3 py-2 text-xs font-semibold text-sc-sun transition hover:border-sc-sun/70 hover:text-sc-text"
                      >
                        {selectedIsRouteStop
                          ? "Remove stop"
                          : "Add to route"}
                      </button>
                    )}

                  {selectedIsDestination && (
                    <span className="shrink-0 text-xs font-semibold text-sc-ocean">
                      Destination
                    </span>
                  )}
                </div>
              ) : (
                <p className="px-1 text-sm text-sc-muted">
                  No nearby discoveries yet.
                </p>
              )}
            </div>
          )}
        </div>
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

// Cairn0

// This is worth exploring.

// Discover the places locals love, the stops worth taking, and the stories hidden along the way.

// [ Start Exploring ]