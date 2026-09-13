"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AdvancedMarker,
  Map,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type {
  Cluster,
  ClusterStats,
  Marker,
  Renderer,
} from "@googlemaps/markerclusterer";

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
        <div className="size-5 rounded-full border-4 border-cairn-text bg-cairn-gold shadow-lg" />
      </AdvancedMarker>

      {/* Discoveries */}
      <ClusteredDiscoveryMarkers
        discoveries={discoveries}
        selectedPlaceId={selectedPlaceId}
        onSelectPlace={onSelectPlace}
      />
    </Map>
  );
}

/** Cluster badge styled like Cairn's own gold pins instead of the library default. */
class CairnClusterRenderer implements Renderer {
  render(
    { count, position }: Cluster,
    _stats: ClusterStats,
    map: google.maps.Map,
  ): Marker {
    const size = count >= 10 ? 44 : 36;

    const badge = document.createElement("div");
    badge.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      border-radius: 9999px;
      background: #D2A24C;
      border: 2px solid #8A6626;
      box-shadow: 0 2px 10px rgba(10, 15, 12, 0.45);
      color: #0A0F0C;
      font-family: "Work Sans", system-ui, sans-serif;
      font-size: 14px;
      font-weight: 700;
    `;
    badge.textContent = String(count);

    return new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: badge,
      zIndex: 1000 + count,
    });
  }
}

type ClusteredDiscoveryMarkersProps = {
  discoveries: Discovery[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
};

/**
 * Discoveries that land close together (e.g. a cluster of places in the
 * same block) collapse into a single numbered marker until the map is
 * zoomed in enough to tell them apart.
 */
function ClusteredDiscoveryMarkers({
  discoveries,
  selectedPlaceId,
  onSelectPlace,
}: ClusteredDiscoveryMarkersProps) {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const [markers, setMarkers] = useState<Record<string, Marker>>({});

  useEffect(() => {
    if (!map) return;

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        renderer: new CairnClusterRenderer(),
      });
    }

    return () => {
      clustererRef.current?.setMap(null);
      clustererRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    clustererRef.current?.clearMarkers();
    clustererRef.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = useCallback(
    (placeId: string, marker: Marker | null) => {
      setMarkers((current) => {
        if (marker && current[placeId] === marker) return current;
        if (!marker && !current[placeId]) return current;

        if (!marker) {
          const next = { ...current };
          delete next[placeId];
          return next;
        }

        return { ...current, [placeId]: marker };
      });
    },
    [],
  );

  return (
    <>
      {discoveries.map((discovery) => (
        <DiscoveryMarker
          key={discovery.place.id}
          discovery={discovery}
          selected={discovery.place.id === selectedPlaceId}
          onSelectPlace={onSelectPlace}
          setMarkerRef={setMarkerRef}
        />
      ))}
    </>
  );
}

type DiscoveryMarkerProps = {
  discovery: Discovery;
  selected: boolean;
  onSelectPlace: (placeId: string) => void;
  setMarkerRef: (placeId: string, marker: Marker | null) => void;
};

function DiscoveryMarker({
  discovery,
  selected,
  onSelectPlace,
  setMarkerRef,
}: DiscoveryMarkerProps) {
  const { place } = discovery;
  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    setMarkerRef(place.id, marker);
    return () => setMarkerRef(place.id, null);
  }, [marker, place.id, setMarkerRef]);

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{
        lat: place.location.latitude,
        lng: place.location.longitude,
      }}
      title={place.name}
      onClick={() => onSelectPlace(place.id)}
    >
      <Pin
        background={selected ? "#D2A24C" : "#9FB2A6"}
        borderColor={selected ? "#8A6626" : "#2E4B3F"}
        glyphColor="#0A0F0C"
        scale={selected ? 1.2 : 1}
      />
    </AdvancedMarker>
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

const ROUTE_REFRESH_DISTANCE_METERS = 40;

function coordinateDistanceInMeters(
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

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

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
   * The live GPS fix can update constantly. The route should not.
   * Keep a separate accepted route origin and only move it after
   * meaningful travel.
   */
  const routeOriginRef = useRef<Coordinates | null>(null);
  const [routeOriginVersion, setRouteOriginVersion] =
    useState(0);

  const destinationLatitude =
    destination?.latitude ?? null;
  const destinationLongitude =
    destination?.longitude ?? null;
  const stopLatitude = stop?.latitude ?? null;
  const stopLongitude = stop?.longitude ?? null;

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

  /*
   * Update the route origin only after the user has moved enough
   * to justify recalculating directions. This is intentionally
   * independent from the marker's smoother live location.
   */
  useEffect(() => {
    const currentRouteOrigin = routeOriginRef.current;

    if (!currentRouteOrigin) {
      routeOriginRef.current = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      setRouteOriginVersion((version) => version + 1);
      return;
    }

    const distance = coordinateDistanceInMeters(
      currentRouteOrigin,
      location,
    );

    if (distance < ROUTE_REFRESH_DISTANCE_METERS) {
      return;
    }

    routeOriginRef.current = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    setRouteOriginVersion((version) => version + 1);
  }, [location.latitude, location.longitude]);

  /*
   * If the destination disappears, remove the route immediately.
   * Normal route refreshes deliberately keep the old line visible
   * until the replacement path has arrived.
   */
  useEffect(() => {
    if (routeKey) return;

    routeOutlineRef.current?.setMap(null);
    routeLineRef.current?.setMap(null);
    routeOutlineRef.current = null;
    routeLineRef.current = null;
    fittedRouteRef.current = null;
  }, [routeKey]);

  useEffect(() => {
    const origin = routeOriginRef.current;

    if (
      !map ||
      !mapsLibrary ||
      !geometryLibrary ||
      !origin ||
      destinationLatitude === null ||
      destinationLongitude === null
    ) {
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
          origin,
          destination: {
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          },
          mode,
          intermediates:
            stopLatitude !== null &&
            stopLongitude !== null
              ? [
                  {
                    latitude: stopLatitude,
                    longitude: stopLongitude,
                  },
                ]
              : [],
        }),
      });

      const data =
        (await response.json()) as RouteApiResponse;

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

      const path =
        geometryLibrary.encoding.decodePath(
          data.encodedPolyline,
        ) as MapPoint[];

      if (path.length === 0) return;

      /*
       * Create each polyline once. Future route calculations only
       * replace its path, so the existing route never blinks out
       * while a new request is in flight.
       */
      if (!routeOutlineRef.current) {
        routeOutlineRef.current =
          new mapsLibrary.Polyline({
            map,
            path,
            strokeColor: "#0A0F0C",
            strokeOpacity: 0.9,
            strokeWeight: 7.5,
            clickable: false,
            zIndex: 10,
          });
      } else {
        routeOutlineRef.current.setPath(path);
        routeOutlineRef.current.setMap(map);
      }

      if (!routeLineRef.current) {
        routeLineRef.current =
          new mapsLibrary.Polyline({
            map,
            path,
            strokeColor: "#D2A24C",
            strokeOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            zIndex: 11,
          });
      } else {
        routeLineRef.current.setPath(path);
        routeLineRef.current.setMap(map);
      }

      if (
        routeKey &&
        fittedRouteRef.current !== routeKey
      ) {
        const latitudes = path.map((point) =>
          point.lat(),
        );
        const longitudes = path.map((point) =>
          point.lng(),
        );

        map.fitBounds(
          {
            north: Math.max(...latitudes),
            south: Math.min(...latitudes),
            east: Math.max(...longitudes),
            west: Math.min(...longitudes),
          },
          48,
        );

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

    /*
     * Abort only the request. Do NOT remove the existing route here.
     * That cleanup was the source of the visible blink.
     */
    return () => controller.abort();
  }, [
    map,
    mapsLibrary,
    geometryLibrary,
    routeOriginVersion,
    destinationLatitude,
    destinationLongitude,
    stopLatitude,
    stopLongitude,
    mode,
    routeKey,
  ]);

  /*
   * Actual map-object cleanup happens only when this route renderer
   * unmounts.
   */
  useEffect(() => {
    return () => {
      routeOutlineRef.current?.setMap(null);
      routeLineRef.current?.setMap(null);
      routeOutlineRef.current = null;
      routeLineRef.current = null;
    };
  }, []);

  return null;
}
