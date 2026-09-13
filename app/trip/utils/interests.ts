import type { InterestId } from "../types";

export const PLACE_TYPES_BY_INTEREST: Record<InterestId, string[]> = {
  food: ["restaurant"],
  coffee: ["cafe", "coffee_shop", "bakery"],
  nightlife: ["bar", "night_club"],
  outdoors: ["park"],
  "beaches-water": ["beach"],
  hiking: ["hiking_area"],
  "arts-culture": ["art_gallery", "museum"],
  history: ["historical_landmark", "tourist_attraction"],
  // Deliberately narrow: visitor/lifestyle retail, not Google's broad
  // "store" catch-all (which pulls in hardware stores, etc.).
  shopping: [
    "clothing_store",
    "gift_shop",
    "jewelry_store",
    "shoe_store",
    "department_store",
  ],
  entertainment: [
    "event_venue",
    "performing_arts_theater",
    "concert_hall",
    "amusement_park",
  ],
  family: ["zoo", "aquarium", "water_park", "playground"],
  // Still a literal type stopgap - the real Cairn-scored, cross-category
  // version of Hidden Gems isn't built yet. Deliberately overlaps with
  // History and Outdoors; rankPlaces treats it as the lowest-priority
  // match so it doesn't just re-absorb everything those already cover.
  "hidden-gems": ["tourist_attraction", "park"],
};

export function getPlaceTypesForInterests(
  interests: InterestId[]
): string[] {
  return Array.from(
    new Set(
      interests.flatMap(
        (interest) => PLACE_TYPES_BY_INTEREST[interest] ?? []
      )
    )
  );
}
