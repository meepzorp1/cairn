import type { Place } from "@/app/place";

export type Mode = "walking" | "driving" | "biking";

export type Intent = "nearby" | "destination";

export type Audience =
  | "student"
  | "visitor"
  | "lostboys"
  | "local"
  | "custom";

export type Budget = "low" | "medium" | "high" | "any";

export type InterestId =
  | "food"
  | "coffee"
  | "nightlife"
  | "outdoors"
  | "beaches-water"
  | "hiking"
  | "arts-culture"
  | "history"
  | "shopping"
  | "entertainment"
  | "family"
  | "hidden-gems";

export type Preferences = {
  interests: InterestId[];
  budget: Budget;
  misc: {
    openNow: boolean;
    highlyRated: boolean;
    petFriendly: boolean;
    kidFriendly: boolean;
    outdoorSeating: boolean;
    wheelchairAccessible: boolean;
  };
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Destination = {
  placeId: string;
  name: string;
  address: string;
  location: Coordinates;

  // Future destination-planning inputs. Intentionally not wired yet.
  arriveBy?: string;
  explorationFlexMinutes?: number;
};

type BaseOptions = {
  mode: Mode;
  audience: Audience;
  preferences: Preferences;
};

export type Options =
  | (BaseOptions & {
      intent: "nearby";
      destination?: never;
    })
  | (BaseOptions & {
      intent: "destination";
      destination: Destination;
    });

export type Discovery = {
  place: Place;
  distanceMiles: number;
  distance: string;
  duration: string;

  // Future route-awareness. Intentionally not wired yet.
  routePosition?: "ahead" | "passed";
  dismissed?: boolean;
};
