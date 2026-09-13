"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type LocationStatus =
  | "idle"
  | "requesting"
  | "tracking"
  | "denied"
  | "unavailable"
  | "unsupported";

export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
};

type UseCurrentLocationOptions = {
  enabled?: boolean;
  highAccuracy?: boolean;
};

type UseCurrentLocationResult = {
  location: CurrentLocation | null;
  status: LocationStatus;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => void;
};

const MINIMUM_MOVEMENT_METERS = 10;
const MAX_STATIONARY_DEADBAND_METERS = 30;
const FAST_MOVEMENT_METERS_PER_SECOND = 2.5;

function getDistanceInMeters(
  first: CurrentLocation,
  second: CurrentLocation,
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

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function smoothLocation(
  current: CurrentLocation,
  incoming: CurrentLocation,
): CurrentLocation {
  const distance = getDistanceInMeters(
    current,
    incoming,
  );

  // GPS fixes wander while the device is stationary. Treat movement
  // inside a portion of the reported accuracy radius as noise.
  const deadband = Math.max(
    MINIMUM_MOVEMENT_METERS,
    Math.min(
      Math.max(current.accuracy, incoming.accuracy) * 0.5,
      MAX_STATIONARY_DEADBAND_METERS,
    ),
  );

  if (distance <= deadband) {
    return {
      ...current,
      accuracy: Math.min(
        current.accuracy,
        incoming.accuracy,
      ),
      heading: incoming.heading ?? current.heading,
      speed: incoming.speed ?? current.speed,
      timestamp: incoming.timestamp,
    };
  }

  // Follow genuine movement quickly when driving/biking, but damp
  // noisy walking/stationary fixes.
  const weight =
    (incoming.speed ?? 0) >=
    FAST_MOVEMENT_METERS_PER_SECOND
      ? 0.75
      : 0.4;

  return {
    ...incoming,
    latitude:
      current.latitude +
      (incoming.latitude - current.latitude) * weight,
    longitude:
      current.longitude +
      (incoming.longitude - current.longitude) * weight,
  };
}

export default function useCurrentLocation({
  enabled = true,
  highAccuracy = true,
}: UseCurrentLocationOptions = {}): UseCurrentLocationResult {
  const [location, setLocation] =
    useState<CurrentLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>(
    enabled ? "requesting" : "idle",
  );
  const [error, setError] = useState<string | null>(
    null,
  );

  const watchIdRef = useRef<number | null>(null);
  const acceptedLocationRef =
    useRef<CurrentLocation | null>(null);

  const clearLocationWatch = useCallback(() => {
    if (
      watchIdRef.current === null ||
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }

    navigator.geolocation.clearWatch(
      watchIdRef.current,
    );
    watchIdRef.current = null;
  }, []);

  const createLocationWatch = useCallback(() => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }

    clearLocationWatch();

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          const incoming: CurrentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          };

          const current =
            acceptedLocationRef.current;

          const accepted = current
            ? smoothLocation(current, incoming)
            : incoming;

          acceptedLocationRef.current = accepted;
          setLocation(accepted);

          setStatus("tracking");
          setError(null);
        },
        (positionError) => {
          switch (positionError.code) {
            case positionError.PERMISSION_DENIED:
              clearLocationWatch();
              setStatus("denied");
              setError(
                "Location permission was denied. Enable it in your browser settings to use live exploration.",
              );
              break;

            case positionError.POSITION_UNAVAILABLE:
              setStatus("unavailable");
              setError(
                "Your current location could not be determined.",
              );
              break;

            case positionError.TIMEOUT:
              setStatus("unavailable");
              setError(
                "Finding your location took too long. Try again.",
              );
              break;

            default:
              setStatus("unavailable");
              setError(
                "Something went wrong while finding your location.",
              );
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 15_000,
          maximumAge: 5_000,
        },
      );
  }, [clearLocationWatch, highAccuracy]);

  const startTracking = useCallback(() => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      setStatus("unsupported");
      setError(
        "Location services are not supported by this browser.",
      );
      return;
    }

    setStatus("requesting");
    setError(null);
    createLocationWatch();
  }, [createLocationWatch]);

  const stopTracking = useCallback(() => {
    clearLocationWatch();
    setStatus("idle");
    setError(null);
  }, [clearLocationWatch]);

  useEffect(() => {
    if (!enabled) return;

    createLocationWatch();

    return clearLocationWatch;
  }, [
    enabled,
    createLocationWatch,
    clearLocationWatch,
  ]);

  return {
    location,
    status,
    error,
    startTracking,
    stopTracking,
  };
}
