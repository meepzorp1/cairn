export type Options = {
  mode: Mode;
  audience: Audience;
  preferences: Preferences;
};

export type Mode = "walking" | "driving" | "biking";

export type Audience = "student" | "visitor" | "lostboys" | "local" | "custom";

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

export type InterestId =
  | "restaurants"
  | "coffee"
  | "study"
  | "parks"
  | "beaches"
  | "attractions"
  | "shopping"
  | "museums"
  | "live-events"
  | "nightlife"
  | "filming-locations"
  | "hidden-gems";

  export type Budget = "low" | "medium" | "high" | "any";

export type Destination = {
  placeId: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
};