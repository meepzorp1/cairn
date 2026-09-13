import type {
 Audience,
  Preferences,
} from "@/app/trip/types";

export const TRIP_PRESETS: Record<Audience, Preferences> = {
  local: {
    interests: [
      "food",
      "coffee",
      "outdoors",
      "history",
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
      "food",
      "coffee",
      "outdoors",
      "entertainment",
      "hidden-gems",
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
      "food",
      "beaches-water",
      "history",
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
      "history",
      "entertainment",
      "food",
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
    interests: ["food", "coffee", "outdoors"],
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
