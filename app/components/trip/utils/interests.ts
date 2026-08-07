import type { InterestId } from "@/app/types/trip";

export const PLACE_TYPES_BY_INTEREST: Record<InterestId, string[]> = {
  restaurants: ["restaurant"],
  coffee: ["cafe", "coffee_shop", "bakery"],
  study: ["library", "university"],
  parks: ["park", "hiking_area"],
  beaches: ["beach"],
  attractions: ["tourist_attraction", "amusement_park"],
  shopping: ["shopping_mall", "store"],
  museums: ["museum", "art_gallery"],
  "live-events": [
    "event_venue",
    "performing_arts_theater",
    "concert_hall",
  ],
  nightlife: ["bar", "night_club"],
  "filming-locations": [
    "tourist_attraction",
    "historical_landmark",
  ],
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
