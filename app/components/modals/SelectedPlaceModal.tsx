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
    <div className="absolute inset-x-3 bottom-3 z-30 rounded-2xl border border-cairn-border bg-cairn-outer/95 p-4 text-cairn-text shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cairn-gold">
            {place.primaryTypeLabel ?? "Nearby place"}
          </p>

          <h2 className="mt-1 font-display text-xl font-medium text-cairn-text">{place.name}</h2>

          {place.address && (
            <p className="mt-1 text-sm text-cairn-muted">{place.address}</p>
          )}

          {place.rating && (
            <p className="mt-2 text-sm text-cairn-text/80">
              ★ {place.rating}
              {place.userRatingCount ? ` (${place.userRatingCount})` : ""}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 py-1 text-cairn-muted transition hover:bg-cairn-card/70 hover:text-cairn-text"
          aria-label="Close selected place"
        >
          ×
        </button>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl bg-cairn-gold px-4 py-3 font-semibold transition hover:bg-cairn-gold"
        onClick={handleStartRoute}
      >
        Start route
      </button>
    </div>
  );
}