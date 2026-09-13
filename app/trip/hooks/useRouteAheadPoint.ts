"use client";

import { useEffect, useRef, useState } from "react";

import type { Coordinates, Mode } from "../types";
import decodePolyline from "../utils/decodePolyline";
import getDistanceInMeters from "../utils/getDistanceInMeters";
import pointAlongPath from "../utils/pointAlongPath";

const MINIMUM_REFRESH_DISTANCE_METERS = 300;

type UseRouteAheadPointOptions = {
  enabled: boolean;
  origin: Coordinates | null;
  destination: Coordinates | null;
  mode: Mode;
  aheadDistanceMeters: number;
};

type RouteApiResponse = {
  encodedPolyline: string | null;
  error?: string;
};

/**
 * For a destination trip, the search center should lean into the
 * direction of travel instead of sitting on top of the user. This looks
 * up the live route ahead and returns the point `aheadDistanceMeters`
 * along it from the current position.
 *
 * Re-fetches only after real movement, mirroring the refresh gate
 * usePlaceSearch already uses.
 */
export default function useRouteAheadPoint({
  enabled,
  origin,
  destination,
  mode,
  aheadDistanceMeters,
}: UseRouteAheadPointOptions) {
  const [aheadPoint, setAheadPoint] = useState<Coordinates | null>(null);
  const lastOriginRef = useRef<Coordinates | null>(null);

  const destinationLatitude = destination?.latitude ?? null;
  const destinationLongitude = destination?.longitude ?? null;

  useEffect(() => {
    if (
      !enabled ||
      !origin ||
      destinationLatitude === null ||
      destinationLongitude === null
    ) {
      lastOriginRef.current = null;
      setAheadPoint(null);
      return;
    }

    const lastOrigin = lastOriginRef.current;

    if (
      lastOrigin &&
      getDistanceInMeters(lastOrigin, origin) < MINIMUM_REFRESH_DISTANCE_METERS
    ) {
      return;
    }

    lastOriginRef.current = origin;

    const controller = new AbortController();

    const load = async () => {
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          origin,
          destination: {
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          },
          mode,
        }),
      });

      const data = (await response.json()) as RouteApiResponse;

      if (!response.ok || controller.signal.aborted || !data.encodedPolyline) {
        return;
      }

      const path = decodePolyline(data.encodedPolyline);

      setAheadPoint(pointAlongPath(path, aheadDistanceMeters));
    };

    void load().catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Route-ahead lookup failed:", error);
    });

    return () => controller.abort();
  }, [
    enabled,
    origin,
    destinationLatitude,
    destinationLongitude,
    mode,
    aheadDistanceMeters,
  ]);

  return aheadPoint;
}
