"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  AdvancedMarker,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import type {
  Coordinates,
  Discovery,
  Mode,
} from "@/app/trip/types";

type MapSectionProps = {
  location: Coordinates;
  discoveries: Discovery[];
  selectedPlaceId: string | null;
  mode: Mode;
  routeDestination: Coordinates | null;
  routeStop?: Coordinates | null;
  onSelectPlace: (placeId: string) => void;
};

type RouteApiResponse = {
  distanceMeters: number;
  duration: string | null;
  encodedPolyline: string | null;
  error?: string;
};

type MapPolyline = google.maps.Polyline;
type MapPoint = google.maps.LatLng;

export default function MapSection({
  location,
  discoveries,
  selectedPlaceId,
  mode,
  routeDestination,
  routeStop = null,
  onSelectPlace,
}: MapSectionProps) {
  const userPosition = useMemo(
    () => ({
      lat: location.latitude,
      lng: location.longitude,
    }),
    [location.latitude, location.longitude],
  );

  return (
    <Map
      defaultCenter={userPosition}
      defaultZoom={15}
      mapId="DEMO_MAP_ID"
      disableDefaultUI
      gestureHandling="greedy"
      className="h-full w-full"
    >
      <SelectedPlaceCamera
        discoveries={discoveries}
        selectedPlaceId={selectedPlaceId}
      />

      <RoutePolyline
        location={location}
        destination={routeDestination}
        stop={routeStop}
        mode={mode}
      />

      {/* Current location */}
      <AdvancedMarker position={userPosition}>
        <div className="size-5 rounded-full border-4 border-white bg-blue-600 shadow-lg" />
      </AdvancedMarker>

      {/* Discoveries */}
      {discoveries.map((discovery) => {
        const { place } = discovery;

        const selected = place.id === selectedPlaceId;

        return (
          <AdvancedMarker
            key={place.id}
            position={{
              lat: place.location.latitude,
              lng: place.location.longitude,
            }}
            title={place.name}
            onClick={() => onSelectPlace(place.id)}
          >
            <Pin
              background={selected ? "#22d3ee" : "#ea580c"}
              borderColor={selected ? "#0e7490" : "#9a3412"}
              glyphColor="#ffffff"
              scale={selected ? 1.2 : 1}
            />
          </AdvancedMarker>
        );
      })}
    </Map>
  );
}

type SelectedPlaceCameraProps = {
  discoveries: Discovery[];
  selectedPlaceId: string | null;
};

function SelectedPlaceCamera({
  discoveries,
  selectedPlaceId,
}: SelectedPlaceCameraProps) {
  const map = useMap();

  const previousSelectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!map || !selectedPlaceId) {
      return;
    }

    /*
     * Don't pan just because the component mounted with an
     * already-selected discovery.
     *
     * We only want movement when the user actually changes
     * the selection.
     */
    if (previousSelectedIdRef.current === null) {
      previousSelectedIdRef.current = selectedPlaceId;
      return;
    }

    if (previousSelectedIdRef.current === selectedPlaceId) {
      return;
    }

    const discovery = discoveries.find(
      ({ place }) => place.id === selectedPlaceId,
    );

    previousSelectedIdRef.current = selectedPlaceId;

    if (!discovery) {
      return;
    }

    map.panTo({
      lat: discovery.place.location.latitude,
      lng: discovery.place.location.longitude,
    });
  }, [map, discoveries, selectedPlaceId]);

  return null;
}

type RoutePolylineProps = {
  location: Coordinates;
  destination: Coordinates | null;
  stop: Coordinates | null;
  mode: Mode;
};

function RoutePolyline({
  location,
  destination,
  stop,
  mode,
}: RoutePolylineProps) {
  const map = useMap();

  const mapsLibrary = useMapsLibrary("maps");
  const geometryLibrary = useMapsLibrary("geometry");

  const routeOutlineRef = useRef<MapPolyline | null>(null);
  const routeLineRef = useRef<MapPolyline | null>(null);
  const fittedRouteRef = useRef<string | null>(null);

  /*
   * Pull primitives out so object identity changes don't
   * unnecessarily rerun the route request.
   */
  const originLatitude = location.latitude;
  const originLongitude = location.longitude;

  const destinationLatitude = destination?.latitude ?? null;
  const destinationLongitude = destination?.longitude ?? null;

  const stopLatitude = stop?.latitude ?? null;
  const stopLongitude = stop?.longitude ?? null;

  /*
   * Used only to determine whether this route has already
   * had its camera bounds fitted.
   */
  const routeKey =
    destinationLatitude !== null &&
    destinationLongitude !== null
      ? [
          destinationLatitude,
          destinationLongitude,
          stopLatitude ?? "",
          stopLongitude ?? "",
          mode,
        ].join(":")
      : null;

  useEffect(() => {
    /*
     * No route to display yet.
     */
    if (
      !map ||
      !mapsLibrary ||
      !geometryLibrary ||
      destinationLatitude === null ||
      destinationLongitude === null
    ) {
      routeOutlineRef.current?.setMap(null);
      routeOutlineRef.current = null;

      routeLineRef.current?.setMap(null);
      routeLineRef.current = null;

      return;
    }

    const controller = new AbortController();

    const loadRoute = async () => {
      const response = await fetch("/api/routes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: controller.signal,

        body: JSON.stringify({
          origin: {
            latitude: originLatitude,
            longitude: originLongitude,
          },

          destination: {
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          },

          mode,

          intermediates:
            stopLatitude !== null && stopLongitude !== null
              ? [
                  {
                    latitude: stopLatitude,
                    longitude: stopLongitude,
                  },
                ]
              : [],
        }),
      });

      const data = (await response.json()) as RouteApiResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to calculate route.",
        );
      }

      if (
        controller.signal.aborted ||
        !data.encodedPolyline
      ) {
        return;
      }

      /*
       * Decode Google's encoded route into map points.
       */
      const decodedPath =
        geometryLibrary.encoding.decodePath(
          data.encodedPolyline,
        );

      const path = decodedPath as MapPoint[];

      if (path.length === 0) {
        return;
      }

      /*
       * Remove the previous route before drawing
       * the new one.
       */
      routeOutlineRef.current?.setMap(null);
      routeLineRef.current?.setMap(null);

      /*
       * Dark outline under the route.
       */
      routeOutlineRef.current =
        new mapsLibrary.Polyline({
          map,
          path,

          strokeColor: "#0f172a",
          strokeOpacity: 0.9,
          strokeWeight: 12,

          clickable: false,
          zIndex: 10,
        });

      /*
       * Main visible route.
       */
      routeLineRef.current =
        new mapsLibrary.Polyline({
          map,
          path,

          strokeColor: "#22d3ee",
          strokeOpacity: 1,
          strokeWeight: 8,

          clickable: false,
          zIndex: 11,
        });

      /*
       * Only refit the camera when the destination,
       * stop, or travel mode actually changes.
       *
       * GPS location updates should NOT keep
       * zooming the map in and out.
       */
      if (
        routeKey &&
        fittedRouteRef.current !== routeKey
      ) {
        const latitudes = path.map(
          (point) => point.lat(),
        );

        const longitudes = path.map(
          (point) => point.lng(),
        );

        const bounds = {
          north: Math.max(...latitudes),
          south: Math.min(...latitudes),
          east: Math.max(...longitudes),
          west: Math.min(...longitudes),
        };

        map.fitBounds(bounds, 48);

        fittedRouteRef.current = routeKey;
      }
    };

    void loadRoute().catch((error) => {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Route error:", error);
    });

    return () => {
      controller.abort();

      routeOutlineRef.current?.setMap(null);
      routeOutlineRef.current = null;

      routeLineRef.current?.setMap(null);
      routeLineRef.current = null;
    };
  }, [
    map,
    mapsLibrary,
    geometryLibrary,

    originLatitude,
    originLongitude,

    destinationLatitude,
    destinationLongitude,

    stopLatitude,
    stopLongitude,

    mode,
    routeKey,
  ]);

  return null;
}