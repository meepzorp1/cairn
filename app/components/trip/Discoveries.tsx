"use client";

import { RefreshCw } from "lucide-react";
import type { Place } from "@/app/types/places";
import DiscoveryCard from "./DiscoveryCard";

type TripDiscoveriesProps = {
  places: Place[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void | Promise<void>;
  onSelectPlace: (place: Place) => void;
};

export default function TripDiscoveries({
  places,
  isLoading,
  error,
  onRefresh,
  onSelectPlace,
}: TripDiscoveriesProps) {
  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-5 sm:px-6">
      <div className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Keep exploring
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {places.length} other places nearby
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 shrink-0 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        <div className="space-y-3">
          {places.map((place) => (
            <DiscoveryCard
              key={place.id}
              place={place}
              active={false}
              onSelect={() => onSelectPlace(place)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
