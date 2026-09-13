import type { Coordinates } from "@/app/trip/types";
import type { Place } from "../types";
import { fetchNearbyPlaces } from "../provider/googlePlaces";
import { dedupePlaces } from "./dedupePlaces";
import { enrichPlaces } from "./enrichPlaces";
import {
  rankPlaces,
  type PlaceRankingContext,
} from "./rankPlaces";

export type PlaceSearchInput = {
  location: Coordinates;
  radius: number;
  includedTypes?: string[];
  ranking?: PlaceRankingContext;
  signal?: AbortSignal;
};

/**
 * Cairn's place-search pipeline.
 *
 * Google supplies candidates. Everything after that is Cairn's decision.
 */
export async function searchPlaces({
  location,
  radius,
  includedTypes,
  ranking,
  signal,
}: PlaceSearchInput): Promise<Place[]> {
  const candidates = await fetchNearbyPlaces({
    location,
    radius,
    includedTypes,
    signal,
  });

  const enriched = enrichPlaces(candidates);
  const deduped = dedupePlaces(enriched);

  return rankPlaces(deduped, {
    requestedTypes: includedTypes,
    origin: location,
    ...ranking,
  });
}
