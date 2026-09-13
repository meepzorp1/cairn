"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Place } from "@/app/place";
import { searchPlaces } from "@/app/place/engine/searchPlaces";
import { rankPlaces } from "@/app/place/engine/rankPlaces";
import type { Discovery, Mode, Options } from "@/app/trip/types";
import { getPlaceTypesForInterests } from "@/app/trip/utils/interests";
import getDistanceInMiles from "@/app/trip/utils/getDistanceInMiles";
import estimateDuration from "@/app/trip/utils/estimateDuration";
import formatDistance from "@/app/trip/utils/formatDistance";
import useCurrentLocation from "@/app/trip/hooks/useCurrentLocation";
import useRouteAheadPoint from "@/app/trip/hooks/useRouteAheadPoint";
import usePlaceSearch from "@/app/place/hooks/usePlaceSearch";

const DEFAULT_RADIUS_BY_MODE: Record<Mode, number> = {
  walking: 1200,
  biking: 2500,
  driving: 5000,
};

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
  const [modalPlaceId, setModalPlaceId] =
    useState<string | null>(null);

  const {
    location,
    status,
    error: locationError,
    startTracking,
  } = useCurrentLocation({
    enabled: true,
    highAccuracy: true,
  });

  const includedTypes = useMemo(
    () =>
      getPlaceTypesForInterests(
        trip.preferences.interests,
      ),
    [trip.preferences.interests],
  );

  const radius = exploreAlongRoute
    ? EXPLORE_RADIUS_BY_MODE[trip.mode]
    : DEFAULT_RADIUS_BY_MODE[trip.mode];

  /*
   * Destination trips lean the search into the direction of travel
   * instead of centering on the user: the search circle sits one
   * radius ahead along the route. This re-derives naturally as the
   * trip progresses because usePlaceSearch below already refreshes
   * once the fed-in location has moved far enough.
   */
  const followingRoute =
    trip.intent === "destination" && !exploreAlongRoute;

  const aheadPoint = useRouteAheadPoint({
    enabled: followingRoute,
    origin: location,
    destination: followingRoute ? trip.destination.location : null,
    mode: trip.mode,
    aheadDistanceMeters: radius,
  });

  const searchLocation =
    followingRoute && aheadPoint ? aheadPoint : location;

  const {
    places,
    isLoading: placesLoading,
    error: placesError,
    refresh,
  } = usePlaceSearch({
    location: searchLocation,
    radius,
    includedTypes,
    interests: trip.preferences.interests,
  });

  /*
   * Once, at the start of a destination trip, also search right where
   * the trip began. Every search after this one only looks ahead.
   */
  const hasLocation = location !== null;
  const startLocationRef = useRef<typeof location>(null);
  const bonusFiredRef = useRef(false);
  const [bonusPlaces, setBonusPlaces] = useState<Place[]>([]);

  useEffect(() => {
    startLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!followingRoute || bonusFiredRef.current) return;

    const startLocation = startLocationRef.current;
    if (!startLocation) return;

    bonusFiredRef.current = true;

    const controller = new AbortController();

    searchPlaces({
      location: startLocation,
      radius,
      includedTypes,
      ranking: { interests: trip.preferences.interests },
      signal: controller.signal,
    })
      .then((result) => {
        if (!controller.signal.aborted) setBonusPlaces(result);
      })
      .catch((error) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        console.error("Starting-location search failed:", error);
      });

    return () => controller.abort();
  }, [
    followingRoute,
    hasLocation,
    radius,
    includedTypes,
    trip.preferences.interests,
  ]);

  /*
   * Route-following search keeps moving the search window forward, and
   * usePlaceSearch replaces its results on every move (right behavior
   * for plain nearby trips, where you only want what's around you now).
   * For a route, that would make earlier finds - including whatever the
   * user has selected - vanish the moment the window moves past them.
   * Accumulate everything ever found instead, for as long as the trip
   * is following a route.
   */
  const [accumulatedPlaces, setAccumulatedPlaces] = useState<
    Record<string, Place>
  >({});

  useEffect(() => {
    if (!followingRoute) {
      setAccumulatedPlaces({});
      return;
    }

    setAccumulatedPlaces((current) => {
      let changed = false;
      const next = { ...current };

      for (const place of places) {
        if (!next[place.id]) {
          next[place.id] = place;
          changed = true;
        }
      }

      return changed ? next : current;
    });
  }, [places, followingRoute]);

  const mergedPlaces = useMemo(() => {
    if (!followingRoute) return places;

    const byId = new Map<string, Place>();
    for (const place of bonusPlaces) byId.set(place.id, place);
    for (const place of Object.values(accumulatedPlaces)) {
      byId.set(place.id, place);
    }
    for (const place of places) byId.set(place.id, place);

    return Array.from(byId.values());
  }, [places, bonusPlaces, accumulatedPlaces, followingRoute]);

  /*
   * Each individual search already caps itself, but route-following
   * accumulates results across many searches over the course of a trip
   * - their union can drift past the drawer's real limit. Re-rank the
   * merged pool once more, from the current position, so the drawer
   * never shows more than the cap regardless of how much has piled up.
   */
  const cappedPlaces = useMemo(() => {
    if (!location) return mergedPlaces;

    return rankPlaces(mergedPlaces, {
      interests: trip.preferences.interests,
      origin: location,
    });
  }, [mergedPlaces, location, trip.preferences.interests]);

  const nearbyDiscoveries = useMemo<Discovery[]>(() => {
    if (!location) return [];

    return cappedPlaces
      .map((place): Discovery => {
        const distanceMiles = getDistanceInMiles(
          location,
          place.location,
        );

        return {
          place,
          distanceMiles,
          distance: formatDistance(distanceMiles),
          duration: estimateDuration(
            distanceMiles,
            trip.mode,
          ),
        };
      })
      .sort(
        (first, second) =>
          first.distanceMiles - second.distanceMiles,
      );
  }, [location, cappedPlaces, trip.mode]);

  const destinationDiscovery =
    useMemo<Discovery | null>(() => {
      if (
        !location ||
        trip.intent !== "destination"
      ) {
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
        duration: estimateDuration(
          distanceMiles,
          trip.mode,
        ),
      };
    }, [location, trip]);

  const discoveries = useMemo<Discovery[]>(() => {
    if (!destinationDiscovery) {
      return nearbyDiscoveries;
    }

    return [
      destinationDiscovery,
      ...nearbyDiscoveries.filter(
        ({ place }) =>
          place.id !== destinationDiscovery.place.id,
      ),
    ];
  }, [destinationDiscovery, nearbyDiscoveries]);

  const selectedDiscovery = useMemo(() => {
    const explicitlySelected = discoveries.find(
      ({ place }) =>
        place.id === userSelectedDiscoveryId,
    );

    return (
      explicitlySelected ??
      destinationDiscovery ??
      discoveries[0] ??
      null
    );
  }, [
    discoveries,
    destinationDiscovery,
    userSelectedDiscoveryId,
  ]);

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

    placesLoading,
    placesError,
    refresh,

    discoveries,
    destinationDiscovery,
    selectedDiscovery,
    selectedDiscoveryId:
      selectedDiscovery?.place.id ?? null,
    selectDiscovery: setUserSelectedDiscoveryId,

    selectedPlace,
    openPlace: setModalPlaceId,
    closePlace: () => setModalPlaceId(null),
  };
}
