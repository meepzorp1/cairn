import { NextResponse } from "next/server";

import type { Coordinates, Mode } from "@/app/trip/types";

type RouteRequestBody = {
  origin: Coordinates;
  destination: Coordinates;
  mode: Mode;
  intermediates?: Coordinates[];
};

type GoogleRouteResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
    polyline?: {
      encodedPolyline?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const travelModeMap: Record<Mode, "WALK" | "DRIVE" | "BICYCLE"> = {
  walking: "WALK",
  driving: "DRIVE",
  biking: "BICYCLE",
};

function isCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;

  const coordinates = value as Partial<Coordinates>;

  return (
    typeof coordinates.latitude === "number" &&
    Number.isFinite(coordinates.latitude) &&
    typeof coordinates.longitude === "number" &&
    Number.isFinite(coordinates.longitude)
  );
}

function toWaypoint(coordinates: Coordinates) {
  return {
    location: {
      latLng: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    },
  };
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key is not configured." },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Partial<RouteRequestBody>;

    if (
      !isCoordinates(body.origin) ||
      !isCoordinates(body.destination) ||
      !body.mode ||
      !(body.mode in travelModeMap)
    ) {
      return NextResponse.json(
        { error: "Invalid route request." },
        { status: 400 },
      );
    }

    const intermediates = Array.isArray(body.intermediates)
      ? body.intermediates.filter(isCoordinates)
      : [];

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: toWaypoint(body.origin),
          destination: toWaypoint(body.destination),
          intermediates: intermediates.map(toWaypoint),
          travelMode: travelModeMap[body.mode],
          polylineQuality: "HIGH_QUALITY",
          polylineEncoding: "ENCODED_POLYLINE",
        }),
      },
    );

    const data = (await response.json()) as GoogleRouteResponse;

    if (!response.ok) {
      console.error("Google Routes API error:", response.status, data);

      return NextResponse.json(
        {
          error:
            data.error?.message ??
            "Failed to calculate route.",
        },
        { status: response.status },
      );
    }

    const route = data.routes?.[0];

    if (!route) {
      return NextResponse.json(
        { error: "No route was found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      distanceMeters: route.distanceMeters ?? 0,
      duration: route.duration ?? null,
      encodedPolyline: route.polyline?.encodedPolyline ?? null,
    });
  } catch (error) {
    console.error("Route request failed:", error);

    return NextResponse.json(
      { error: "Something went wrong calculating the route." },
      { status: 500 },
    );
  }
}
