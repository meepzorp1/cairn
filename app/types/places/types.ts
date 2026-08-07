export type Place = {
    id: string;
    name: string;
    description?: string;

    location: Location;

    categories: Category[];

    tags: string[];

    image?: string;
    rating?: number;
    price?: PriceLevel;
    hours?: Hours;

    seasonal?: boolean;
    indoor?: boolean;
    familyFriendly?: boolean;
    dogFriendly?: boolean;
    featured?: boolean;
};

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
export type Hours = { open: string; close: string } | "24/7" | "seasonal" | "closed";

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
}