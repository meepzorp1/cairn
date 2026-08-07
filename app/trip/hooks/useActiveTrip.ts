"use client";

import { useMemo, useState } from "react";
import { normalizeNearbyPlace } from "@/app/place";
import type { Place } from "@/app/place";
import type { Discovery, Mode, Options } from "@/app/trip/types";
import { getPlaceTypesForInterests } from "@/app/trip/utils/interests";
import getDistanceInMiles from "@/app/trip/utils/getDistanceInMiles";
import estimateDuration from "@/app/trip/utils/estimateDuration";
import formatDistance from "@/app/trip/utils/formatDistance";
import useCurrentLocation from "@/app/trip/hooks/useCurrentLocation";
import useNearbyPlaces from "@/app/trip/hooks/useNearbyPlaces";

const DEFAULT_RADIUS_BY_MODE: Record<Mode, number> = {
  walking: 1200,
  biking: 2500,
  driving: 5000,
};

// Temporary stand-in for the future route-corridor search.
// When Explore is enabled, search closer to the user's current position.
const EXPLORE_RADIUS_BY_MODE: Record<Mode, number> = {
  walking: 600,
  biking: 1200,
  driving: 2500,
};

export default function useActiveTrip(
  trip: Options,
  exploreAlongRoute = false,
) {
  const [userSelectedDiscoveryId, setUserSelectedDiscoveryId] =
    useState<string | null>(null);
  const [modalPlaceId, setModalPlaceId] = useState<string | null>(null);

  const {
    location,
    status,
    error: locationError,
    startTracking,
  } = useCurrentLocation({ enabled: true, highAccuracy: true });

  const includedTypes = useMemo(
    () => getPlaceTypesForInterests(trip.preferences.interests),
    [trip.preferences.interests],
  );

  const radius = exploreAlongRoute
    ? EXPLORE_RADIUS_BY_MODE[trip.mode]
    : DEFAULT_RADIUS_BY_MODE[trip.mode];

  const {
    places: nearbyPlaces,
    isLoading: placesLoading,
    error: placesError,
    refresh,
  } = useNearbyPlaces({ location, radius, includedTypes });

  const places = useMemo(
    () => nearbyPlaces.map(normalizeNearbyPlace),
    [nearbyPlaces],
  );

  const nearbyDiscoveries = useMemo<Discovery[]>(() => {
    if (!location) return [];

    return places
      .map((place): Discovery => {
        const distanceMiles = getDistanceInMiles(
          location,
          place.location,
        );

        return {
          place,
          distanceMiles,
          distance: formatDistance(distanceMiles),
          duration: estimateDuration(distanceMiles, trip.mode),
        };
      })
      .sort(
        (first, second) =>
          first.distanceMiles - second.distanceMiles,
      );
  }, [location, places, trip.mode]);

  /**
   * A user-entered destination is normalized into the same Discovery shape
   * used everywhere else in the active experience. This means the map,
   * selected card, modal, and route code do not need a second destination
   * branch.
   */
  const destinationDiscovery = useMemo<Discovery | null>(() => {
    if (!location || trip.intent !== "destination") {
      return null;
    }

    const destination = trip.destination;

    const place: Place = {
      id: destination.placeId,
      name: destination.name,
      address: destination.address,
      location: destination.location,
      categories: [],
      tags: [],
      primaryType: "destination",
      primaryTypeLabel: "Destination",
    };

    const distanceMiles = getDistanceInMiles(
      location,
      destination.location,
    );

    return {
      place,
      distanceMiles,
      distance: formatDistance(distanceMiles),
      duration: estimateDuration(distanceMiles, trip.mode),
    };
  }, [location, trip]);

  /**
   * Destination-mode trips start with the entered destination selected.
   * Nearby discoveries remain available underneath it.
   *
   * Future route behavior:
   * - Stay on Route will filter discoveries to places ahead/on-route.
   * - Passed discoveries will remain available until manually dismissed.
   */
  const discoveries = useMemo<Discovery[]>(() => {
    if (!destinationDiscovery) {
      return nearbyDiscoveries;
    }

    return [
      destinationDiscovery,
      ...nearbyDiscoveries.filter(
        ({ place }) => place.id !== destinationDiscovery.place.id,
      ),
    ];
  }, [destinationDiscovery, nearbyDiscoveries]);

  const selectedDiscovery = useMemo(() => {
    const explicitlySelected = discoveries.find(
      ({ place }) => place.id === userSelectedDiscoveryId,
    );

    if (explicitlySelected) {
      return explicitlySelected;
    }

    return destinationDiscovery ?? discoveries[0] ?? null;
  }, [
    discoveries,
    destinationDiscovery,
    userSelectedDiscoveryId,
  ]);

  const remainingDiscoveries = useMemo(
    () =>
      discoveries.filter(
        ({ place }) =>
          place.id !== selectedDiscovery?.place.id,
      ),
    [discoveries, selectedDiscovery?.place.id],
  );

  const selectedPlace = useMemo(
    () =>
      discoveries.find(
        ({ place }) => place.id === modalPlaceId,
      )?.place ?? null,
    [discoveries, modalPlaceId],
  );

  return {
    location,
    status,
    locationError,
    startTracking,
    nearbyPlaces,
    places,
    placesLoading,
    placesError,
    refresh,
    radius,
    discoveries,
    selectedDiscovery,
    remainingDiscoveries,
    selectedDiscoveryId: selectedDiscovery?.place.id ?? null,
    selectDiscovery: setUserSelectedDiscoveryId,
    selectedPlace,
    openPlace: (placeId: string) => setModalPlaceId(placeId),
    closePlace: () => setModalPlaceId(null),
  };
}
