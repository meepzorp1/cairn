"use client";

import { ChevronDown, ChevronUp, Footprints } from "lucide-react";

import type { Place } from "@/app/place";
import type { Discovery } from "../types";
import Discoveries from "./Discoveries";

type MapDrawerProps = {
  expanded: boolean;
  discoveries: Discovery[];
  selectedDiscovery: Discovery | null;
  selectedDiscoveryId: string | null;
  placesLoading: boolean;
  placesError: string | null;
  hasActiveRoute: boolean;
  selectedIsDestination: boolean;
  selectedIsRouteStop: boolean;
  onToggle: () => void;
  onRefresh: () => void | Promise<void>;
  onSelectDiscovery: (placeId: string) => void;
  onOpenPlace: (placeId: string) => void;
  onSetDestination: (place: Place) => void;
  onToggleRouteStop: (placeId: string) => void;
};

export default function MapDrawer({
  expanded,
  discoveries,
  selectedDiscovery,
  selectedDiscoveryId,
  placesLoading,
  placesError,
  hasActiveRoute,
  selectedIsDestination,
  selectedIsRouteStop,
  onToggle,
  onRefresh,
  onSelectDiscovery,
  onOpenPlace,
  onSetDestination,
  onToggleRouteStop,
}: MapDrawerProps) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden rounded-t-4xl border-t border-white/10 bg-sc-panel/95 shadow-[0_-20px_60px_rgba(2,6,23,.8)] backdrop-blur-xl transition-[height] duration-300 ${
        expanded ? "h-[72dvh]" : "h-42"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mx-auto mt-2 flex h-7 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 bg-sc-raised text-sc-muted"
        aria-label={expanded ? "Collapse nearby places" : "Expand nearby places"}
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronUp className="size-4" />
        )}
      </button>

      {expanded ? (
        <Discoveries
          discoveries={discoveries}
          selectedId={selectedDiscoveryId}
          isLoading={placesLoading}
          error={placesError}
          onRefresh={onRefresh}
          onSelectPlace={(discovery) => {
            onSelectDiscovery(discovery.place.id);
            onToggle();
          }}
          onOpenPlace={(discovery) => onOpenPlace(discovery.place.id)}
        />
      ) : (
        <div className="flex min-h-0 flex-1 items-center px-3 pb-3">
          {placesLoading && discoveries.length === 0 ? (
            <p className="px-1 text-sm text-sc-muted">Searching nearby…</p>
          ) : selectedDiscovery ? (
            <div className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-sc-raised px-3 py-3">
              <button
                type="button"
                onClick={() => onOpenPlace(selectedDiscovery.place.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-label={`Open details for ${selectedDiscovery.place.name}`}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sc-ocean-soft text-sc-ocean">
                  <Footprints className="size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-sc-muted">
                    {selectedDiscovery.place.primaryTypeLabel ??
                      selectedDiscovery.place.primaryType?.replaceAll("_", " ") ??
                      "Nearby place"}
                  </p>
                  <p className="truncate font-semibold">{selectedDiscovery.place.name}</p>
                  <p className="mt-1 text-xs text-sc-muted">
                    {selectedDiscovery.distance} · {selectedDiscovery.duration}
                  </p>
                </div>
              </button>

              {!hasActiveRoute && (
                <button
                  type="button"
                  onClick={() => onSetDestination(selectedDiscovery.place)}
                  className="shrink-0 rounded-xl bg-sc-sun px-3 py-2 text-xs font-semibold text-sc-bg transition hover:opacity-90 active:scale-[0.98]"
                >
                  Set destination
                </button>
              )}

              {hasActiveRoute && !selectedIsDestination && (
                <button
                  type="button"
                  onClick={() => onToggleRouteStop(selectedDiscovery.place.id)}
                  className="shrink-0 rounded-xl border border-sc-sun/40 bg-sc-sun-soft px-3 py-2 text-xs font-semibold text-sc-sun transition hover:border-sc-sun/70 hover:text-sc-text"
                >
                  {selectedIsRouteStop ? "Remove stop" : "Add to route"}
                </button>
              )}

              {selectedIsDestination && (
                <span className="shrink-0 text-xs font-semibold text-sc-ocean">
                  Destination
                </span>
              )}
            </div>
          ) : (
            <p className="px-1 text-sm text-sc-muted">No nearby discoveries yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
