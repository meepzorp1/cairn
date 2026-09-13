import type { Coordinates, InterestId } from "@/app/trip/types";
import getDistanceInMeters from "@/app/trip/utils/getDistanceInMeters";
import { PLACE_TYPES_BY_INTEREST } from "@/app/trip/utils/interests";
import type { Place } from "../types";

export type PlaceRankingContext = {
  requestedTypes?: string[];
  interests?: InterestId[];
  origin?: Coordinates;
};

const MAX_TOTAL_RESULTS = 20;
const MAX_PER_INTEREST = 7;

/**
 * Orders candidate places for the current Cairn intent, then decides
 * which ones actually earn a slot in the drawer.
 *
 * Never dumps everything Google returns into the drawer: each selected
 * interest gets a capped share of the slots (roughly a third), an
 * over-performing interest doesn't get to backfill the rest just to
 * hit the max, and the final list is sorted by distance from the
 * search origin so it reads as "what's coming up next."
 */
export function rankPlaces(
  places: Place[],
  context: PlaceRankingContext = {},
): Place[] {
  const { interests, origin } = context;

  const sorted = origin
    ? [...places].sort(
        (first, second) =>
          getDistanceInMeters(origin, first.location) -
          getDistanceInMeters(origin, second.location),
      )
    : places;

  if (!interests || interests.length === 0) {
    return sorted.slice(0, MAX_TOTAL_RESULTS);
  }

  // Hidden Gems still shares a couple of raw Google types with History
  // and Outdoors (see interests.ts). Evaluate it last so a place that
  // clearly fits a more specific selected interest counts there
  // instead of just being reabsorbed into Hidden Gems.
  const priorityOrder = [...interests].sort(
    (first, second) => interestPriority(first) - interestPriority(second),
  );

  const countByInterest = new Map<InterestId, number>();
  const selected: Place[] = [];

  for (const place of sorted) {
    if (selected.length >= MAX_TOTAL_RESULTS) break;

    const matchedInterest = priorityOrder.find((interest) =>
      place.primaryType
        ? PLACE_TYPES_BY_INTEREST[interest].includes(place.primaryType)
        : false,
    );

    if (!matchedInterest) continue;

    const currentCount = countByInterest.get(matchedInterest) ?? 0;
    if (currentCount >= MAX_PER_INTEREST) continue;

    countByInterest.set(matchedInterest, currentCount + 1);
    selected.push(place);
  }

  return selected;
}

function interestPriority(interest: InterestId): number {
  return interest === "hidden-gems" ? 1 : 0;
}
