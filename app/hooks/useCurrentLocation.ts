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

export default function useCurrentLocation({
  enabled = true,
  highAccuracy = true,
}: UseCurrentLocationOptions = {}): UseCurrentLocationResult {
  const [location, setLocation] =
    useState<CurrentLocation | null>(null);

  const [status, setStatus] = useState<LocationStatus>(
    enabled ? "requesting" : "idle",
  );

  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  /**
   * Clears the browser watcher only.
   *
   * This intentionally does not update React state, so it is safe
   * to call during effect cleanup.
   */
  const clearLocationWatch = useCallback(() => {
    if (
      watchIdRef.current === null ||
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }

    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
  }, []);

  /**
   * Starts the external geolocation subscription.
   *
   * State updates happen from the browser callbacks rather than
   * synchronously from the effect.
   */
  const createLocationWatch = useCallback(() => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }

    clearLocationWatch();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });

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

  /**
   * Public command used by buttons or other event handlers.
   * State updates are appropriate here.
   */
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

  /**
   * Public command used by buttons or other event handlers.
   */
  const stopTracking = useCallback(() => {
    clearLocationWatch();
    setStatus("idle");
    setError(null);
  }, [clearLocationWatch]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    createLocationWatch();

    return clearLocationWatch;
  }, [
    enabled,
    createLocationWatch,
    clearLocationWatch,
  ]);

  return {
    location,
    status: enabled ? status : "idle",
    error: enabled ? error : null,
    startTracking,
    stopTracking,
  };
}