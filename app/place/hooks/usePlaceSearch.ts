"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Coordinates, InterestId } from "@/app/trip/types";
import { searchPlaces } from "../engine/searchPlaces";
import type { Place } from "../types";

const MINIMUM_REFRESH_DISTANCE_METERS = 300;

type UsePlaceSearchOptions = {
  location: Coordinates | null;
  radius?: number;
  includedTypes?: string[];
  interests?: InterestId[];
};

type LoadPlacesOptions = {
  force?: boolean;
  signal?: AbortSignal;
};

export default function usePlaceSearch({
  location,
  radius = 1500,
  includedTypes,
  interests,
}: UsePlaceSearchOptions) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastSearchLocationRef =
    useRef<Coordinates | null>(null);

  const includedTypesKey =
    includedTypes?.slice().sort().join(",") ?? "";

  const loadPlaces = useCallback(
    async ({
      force = false,
      signal,
    }: LoadPlacesOptions = {}) => {
      if (!location) return;

      const lastLocation =
        lastSearchLocationRef.current;

      if (!force && lastLocation) {
        const distance = getDistanceInMeters(
          lastLocation,
          location,
        );

        if (
          distance < MINIMUM_REFRESH_DISTANCE_METERS
        ) {
          return;
        }
      }

      setIsLoading(true);

      try {
        const nextPlaces = await searchPlaces({
          location,
          radius,
          includedTypes:
            includedTypesKey.length > 0
              ? includedTypesKey.split(",")
              : undefined,
          ranking: interests ? { interests } : undefined,
          signal,
        });

        if (signal?.aborted) return;

        setPlaces(nextPlaces);
        setError(null);
        lastSearchLocationRef.current = location;
      } catch (caughtError) {
        if (
          signal?.aborted ||
          (caughtError instanceof DOMException &&
            caughtError.name === "AbortError")
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to load nearby places.",
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [location, radius, includedTypesKey, interests],
  );

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPlaces({
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [location, loadPlaces]);

  return {
    places,
    isLoading,
    error,
    refresh: () => loadPlaces({ force: true }),
  };
}

function getDistanceInMeters(
  first: Coordinates,
  second: Coordinates,
) {
  const earthRadius = 6_371_000;
  const latitude1 = (first.latitude * Math.PI) / 180;
  const latitude2 = (second.latitude * Math.PI) / 180;
  const latitudeDifference =
    ((second.latitude - first.latitude) * Math.PI) /
    180;
  const longitudeDifference =
    ((second.longitude - first.longitude) * Math.PI) /
    180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}
