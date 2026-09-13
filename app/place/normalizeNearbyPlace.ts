import type { NearbyPlace, Place } from "./types";

export default function normalizeNearbyPlace(
  nearbyPlace: NearbyPlace,
): Place {
  console.log(nearbyPlace)
  return {
    id: nearbyPlace.id,
    name: nearbyPlace.name,
    location: {
      latitude: nearbyPlace.latitude,
      longitude: nearbyPlace.longitude,
    },
    categories: [],
    tags: [],
    address: nearbyPlace.address,
    rating: nearbyPlace.rating,
    userRatingCount: nearbyPlace.userRatingCount,
    primaryType: nearbyPlace.primaryType,
    primaryTypeLabel: nearbyPlace.primaryTypeLabel,
  };
}
