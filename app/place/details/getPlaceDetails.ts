import type { Place } from "../types";

/**
 * Rich details are intentionally separate from nearby discovery.
 * We should only hydrate a place when the user actually opens it.
 */
export async function getPlaceDetails(
  _place: Place,
): Promise<Place> {
  // TODO: fetch photos, hours, website, phone, price, etc.
  throw new Error("getPlaceDetails is not wired yet.");
}
