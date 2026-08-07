import type {
 Audience,
  Preferences,
} from "@/app/types/trip";

export const TRIP_PRESETS: Record<Audience, Preferences> = {
  local: {
    interests: [
      "restaurants",
      "coffee",
      "parks",
      "attractions",
      "hidden-gems",
    ],
    budget: "any",
    misc: {
      openNow: true,
      highlyRated: true,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },

  student: {
    interests: [
      "restaurants",
      "coffee",
      "study",
      "parks",
      "live-events",
    ],
    budget: "low",
    misc: {
      openNow: true,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },

  visitor: {
    interests: [
      "restaurants",
      "beaches",
      "attractions",
      "shopping",
      "hidden-gems",
    ],
    budget: "medium",
    misc: {
      openNow: true,
      highlyRated: true,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },

  lostboys: {
    interests: [
      "filming-locations",
      "attractions",
      "restaurants",
      "hidden-gems",
    ],
    budget: "any",
    misc: {
      openNow: false,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },

  custom: {
    interests: ["restaurants", "coffee", "parks"],
    budget: "any",
    misc: {
      openNow: true,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },
};

export function copyTripPreferences(
  preferences: Preferences
): Preferences {
  return {
    ...preferences,
    interests: [...preferences.interests],
    misc: { ...preferences.misc },
  };
}
