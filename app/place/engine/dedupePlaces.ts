import type { Place } from "../types";

/**
 * Removes or groups results that represent the same real-world destination.
 *
 * Example we care about:
 * - a hotel qualifies for a restaurant search
 * - the hotel's actual restaurant is also returned
 * - keep the more useful result instead of spending two discovery slots
 */
export function dedupePlaces(places: Place[]): Place[] {
  // TODO: compare proximity, address, names, and type relevance.
  return places;
}
