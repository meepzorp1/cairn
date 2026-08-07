"use client";

import type { Place } from "@/app/place";

type SelectedPlaceModalProps = {
  place: Place;
  onClose: () => void;
  onStartRoute: (place: Place) => void;
};

export default function SelectedPlaceModal({
  place,
  onClose,
  onStartRoute,
}: SelectedPlaceModalProps) {
  const handleStartRoute = () => {
    onStartRoute(place);
    onClose();
  };

  return (
    <div className="absolute inset-x-3 bottom-3 z-30 rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-white shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            {place.primaryTypeLabel ?? "Nearby place"}
          </p>

          <h2 className="mt-1 text-lg font-semibold">{place.name}</h2>

          {place.address && (
            <p className="mt-1 text-sm text-white/60">{place.address}</p>
          )}

          {place.rating && (
            <p className="mt-2 text-sm text-white/80">
              ★ {place.rating}
              {place.userRatingCount ? ` (${place.userRatingCount})` : ""}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 py-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Close selected place"
        >
          ×
        </button>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold transition hover:bg-orange-500"
        onClick={handleStartRoute}
      >
        Start route
      </button>
    </div>
  );
}