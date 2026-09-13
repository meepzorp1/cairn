import type { Coordinates } from "@/app/trip/types";
import normalizeNearbyPlace from "../normalizeNearbyPlace";
import type {
  Place,
  PlacesApiResponse,
} from "../types";

export type GooglePlacesSearchOptions = {
  location: Coordinates;
  radius: number;
  includedTypes?: string[];
  signal?: AbortSignal;
};

/**
 * Google Places provider boundary.
 *
 * This file knows how Cairn talks to Google. It does not own React state,
 * effects, ranking, deduping, or trip behavior.
 */
export async function fetchNearbyPlaces({
  location,
  radius,
  includedTypes,
  signal,
}: GooglePlacesSearchOptions): Promise<Place[]> {
  const response = await fetch("/api/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
      includedTypes,
    }),
  });

  const data =
    (await response.json()) as PlacesApiResponse;

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to load nearby places.",
    );
  }

  return (data.places ?? []).map(
    normalizeNearbyPlace,
  );
}
