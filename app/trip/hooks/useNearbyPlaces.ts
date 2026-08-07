"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { NearbyPlace } from "@/app/place";
import type { Coordinates } from "../types";

type UseNearbyPlacesOptions = {
  location: Coordinates | null;
  radius?: number;
  includedTypes?: string[];
};

type PlacesApiResponse = {
  places?: NearbyPlace[];
  error?: string;
};

type LoadPlacesOptions = {
  force?: boolean;
  signal?: AbortSignal;
};

const MINIMUM_REFRESH_DISTANCE_METERS = 300;

function getDistanceInMeters(
  first: Coordinates,
  second: Coordinates,
) {
  const earthRadius = 6_371_000;

  const latitude1 = (first.latitude * Math.PI) / 180;
  const latitude2 = (second.latitude * Math.PI) / 180;

  const latitudeDifference =
    ((second.latitude - first.latitude) * Math.PI) / 180;

  const longitudeDifference =
    ((second.longitude - first.longitude) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

async function fetchNearbyPlaces({
  location,
  radius,
  includedTypes,
  signal,
}: {
  location: Coordinates;
  radius: number;
  includedTypes?: string[];
  signal?: AbortSignal;
}): Promise<NearbyPlace[]> {
  const response = await fetch("/api/places", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      latitude: location.latitude,
      longitude: location.longitude,
      radius,
      includedTypes,
    }),
  });

  const data = (await response.json()) as PlacesApiResponse;

  if (!response.ok) {
    throw new Error(
      data.error ?? "Failed to load nearby places.",
    );
  }

  return data.places ?? [];
}

export default function useNearbyPlaces({
  location,
  radius = 1500,
  includedTypes,
}: UseNearbyPlacesOptions) {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
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
      if (!location) {
        return;
      }

      const lastLocation = lastSearchLocationRef.current;

      if (!force && lastLocation) {
        const distance = getDistanceInMeters(
          lastLocation,
          location,
        );

        if (distance < MINIMUM_REFRESH_DISTANCE_METERS) {
          return;
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const nextPlaces = await fetchNearbyPlaces({
          location,
          radius,
          includedTypes:
            includedTypesKey.length > 0
              ? includedTypesKey.split(",")
              : undefined,
          signal,
        });

        if (signal?.aborted) {
          return;
        }

        setPlaces(nextPlaces);
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
    [
      location,
      radius,
      includedTypesKey,
    ],
  );

useEffect(() => {
  if (!location) {
    return;
  }

  const controller = new AbortController();

  const run = async () => {
    await Promise.resolve();

    if (controller.signal.aborted) {
      return;
    }

    await loadPlaces({
      signal: controller.signal,
    });
  };

  void run();

  return () => {
    controller.abort();
  };
}, [location, loadPlaces]);

  return {
    places,
    isLoading,
    error,
    refresh: () => loadPlaces({ force: true }),
  };
}