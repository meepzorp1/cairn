export type Location = {
  latitude: number;
  longitude: number;
};

export type Category =
  | "beach"
  | "nature"
  | "hidden-gem"
  | "attraction"
  | "food"
  | "entertainment"
  | "study"
  | "campus";

export type PriceLevel = "free" | "$" | "$$" | "$$$";

export type Hours =
  | { open: string; close: string }
  | "24/7"
  | "seasonal"
  | "closed";

/**
 * Canonical place model used by the app UI and feature logic.
 * It can represent curated places or normalized API places.
 */
export type Place = {
  id: string;
  name: string;
  description?: string;
  location: Location;

  categories: Category[];
  tags: string[];

  address?: string;
  primaryType?: string;
  primaryTypeLabel?: string;
  image?: string;
  rating?: number;
  userRatingCount?: number;
  price?: PriceLevel;
  hours?: Hours;

  seasonal?: boolean;
  indoor?: boolean;
  familyFriendly?: boolean;
  dogFriendly?: boolean;
  featured?: boolean;
};

/** Raw response shape returned by the nearby-places API. */
export type NearbyPlace = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  primaryTypeLabel?: string;
};
