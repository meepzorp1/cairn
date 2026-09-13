import type { Place } from "../types";

/**
 * Future merge point for Cairn-owned information.
 *
 * This is where partner/member/curated data can augment a Google result
 * without teaching the rest of the app about multiple data sources.
 */
export function enrichPlaces(places: Place[]): Place[] {
  // TODO: merge Cairn data by provider id / location / known mapping.
  return places;
}
