import { NextResponse } from "next/server";
import type { NearbyPlace } from "@/app/types/place";

type PlacesRequestBody = {
  latitude?: number;
  longitude?: number;
  radius?: number;
  includedTypes?: string[];
};

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  rating?: number;
  userRatingCount?: number;
  primaryType?: string;
  primaryTypeDisplayName?: {
    text?: string;
  };
};

type GoogleNearbySearchResponse = {
  places?: GooglePlace[];
};

const DEFAULT_TYPES = [
  "restaurant",
  "cafe",
  "park",
  "tourist_attraction",
  "library",
];

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {

      return NextResponse.json(
        {
          error: "GOOGLE_PLACES_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body = await request.json();

    console.log("Places request body:", body);

    const {
      latitude,
      longitude,
      radius = 1500,
      includedTypes = DEFAULT_TYPES,
    }: PlacesRequestBody = body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Valid latitude and longitude are required.",
        },
        {
          status: 400,
        }
      );
    }

    const safeRadius = Math.min(Math.max(radius, 100), 5000);

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": [
            "places.id",
            "places.displayName",
            "places.formattedAddress",
            "places.location",
            "places.rating",
            "places.userRatingCount",
            "places.primaryType",
            "places.primaryTypeDisplayName",
          ].join(","),
        },

        body: JSON.stringify({
          includedTypes,
          maxResultCount: 20,

          locationRestriction: {
            circle: {
              center: {
                latitude,
                longitude,
              },

              radius: safeRadius,
            },
          },

          rankPreference: "POPULARITY",
        }),

        cache: "no-store",
      }
    );

    if (!response.ok) {
      const googleError = await response.text();

      console.error("Google Places error:", googleError);

      return NextResponse.json(
        {
          error: "Google Places request failed.",
          details:
            process.env.NODE_ENV === "development"
              ? googleError
              : undefined,
        },
        {
          status: response.status,
        }
      );
    }

    const data =
      (await response.json()) as GoogleNearbySearchResponse;

    const places: NearbyPlace[] = (data.places ?? [])
      .filter((place) => {
        return (
          place.id &&
          place.displayName?.text &&
          typeof place.location?.latitude === "number" &&
          typeof place.location?.longitude === "number"
        );
      })
      .map((place) => ({
        id: place.id!,
        name: place.displayName!.text!,
        latitude: place.location!.latitude!,
        longitude: place.location!.longitude!,
        address: place.formattedAddress,
        rating: place.rating,
        userRatingCount: place.userRatingCount,
        primaryType: place.primaryType,
        primaryTypeLabel:
          place.primaryTypeDisplayName?.text,
      }));

    return NextResponse.json({
      places,
    });
  } catch (error) {
    console.error("Places route error:", error);

    return NextResponse.json(
      {
        error: "Unable to load nearby places.",
      },
      {
        status: 500,
      }
    );
  }
}