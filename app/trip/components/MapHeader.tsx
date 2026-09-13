"use client";

import { Compass, MapPin, Route, X } from "lucide-react";

import type { Place } from "@/app/place";
import type { Discovery, Options } from "../types";

export type MapHeaderProps = {
  trip: Options;
  destinationPlace: Place | null;
  destinationDiscovery: Discovery | null;
  placesLoading: boolean;
  discoveries: Discovery[];
  exploreAlongRoute: boolean;
  onExploreAlongRouteChange: (value: boolean) => void;
  openPlace: (placeId: string) => void;
  onEndTrip: () => void;
};

export default function MapHeader({
  trip,
  destinationPlace,
  destinationDiscovery,
  placesLoading,
  discoveries,
  exploreAlongRoute,
  onExploreAlongRouteChange,
  openPlace,
  onEndTrip,
}: MapHeaderProps) {
  const hasActiveRoute = destinationPlace !== null;

  const placesStatus = placesLoading ? (
    <span className="flex items-center gap-2 text-cairn-gold">
      <span className="size-1.5 animate-pulse rounded-full bg-current" />
      {discoveries.length > 0
        ? `Updating ${discoveries.length} ${discoveries.length === 1 ? "place" : "places"}…`
        : "Searching…"}
    </span>
  ) : (
    <span>
      {discoveries.length} {discoveries.length === 1 ? "place" : "places"} found
    </span>
  );

  return (
    <header className="texture-grain relative z-30 shrink-0 border-b border-cairn-border/70 bg-cairn-bg">
      <div className="flex items-start justify-between gap-4 px-4 py-3">
        <div className="min-w-0 flex-1">
          {destinationPlace ? (
            <button
              type="button"
              onClick={() => openPlace(destinationPlace.id)}
              className="flex w-full min-w-0 items-center gap-3 text-left"
              aria-label={`Open details for ${destinationPlace.name}`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cairn-gold-soft text-cairn-gold">
                <MapPin className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-cairn-gold">
                  Destination
                </p>
                <p className="truncate text-sm font-semibold">
                  {destinationPlace.name}
                </p>
                {destinationDiscovery && (
                  <p className="mt-0.5 text-xs text-cairn-muted">
                    {destinationDiscovery.distance} · {destinationDiscovery.duration}
                  </p>
                )}
              </div>
            </button>
          ) : (
            <div>
              <p className="text-sm font-semibold">Exploring nearby</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-cairn-muted">
                <span>{trip.mode} · {trip.audience}</span>
                <span className="text-cairn-border/70">•</span>
                {placesStatus}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onEndTrip}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cairn-border/70 text-cairn-muted transition hover:text-cairn-text"
          aria-label="End exploration"
        >
          <X className="size-5" />
        </button>
      </div>

      {hasActiveRoute && (
        <>
          <div className="px-4 pb-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-cairn-muted">
              <span>{trip.mode} · {trip.audience}</span>
              <span className="text-cairn-border/70">•</span>
              {placesStatus}
            </div>
          </div>

          <div className="flex gap-2 px-4 pb-3">
            <button
              type="button"
              aria-pressed={exploreAlongRoute}
              onClick={() => onExploreAlongRouteChange(true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                exploreAlongRoute
                  ? "border-cairn-gold/60 bg-cairn-gold-soft text-cairn-gold"
                  : "border-cairn-border/70 bg-cairn-card text-cairn-muted hover:text-cairn-text"
              }`}
            >
              <Compass className="size-4" />
              Explore
            </button>

            <button
              type="button"
              aria-pressed={!exploreAlongRoute}
              onClick={() => onExploreAlongRouteChange(false)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                !exploreAlongRoute
                  ? "border-cairn-gold/60 bg-cairn-gold-soft text-cairn-gold"
                  : "border-cairn-border/70 bg-cairn-card text-cairn-muted hover:text-cairn-text"
              }`}
            >
              <Route className="size-4" />
              Stay on Route
            </button>
          </div>
        </>
      )}
    </header>
  );
}
