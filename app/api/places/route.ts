import { NextResponse } from "next/server";
import { logSearchResults } from "@/app/place/engine/logSearchResults";
import type { NearbyPlace } from "@/app/place/types";

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
  // Identity
  "places.id",
  "places.displayName",

  // Location / address
  "places.formattedAddress",
  "places.shortFormattedAddress",
  "places.location",
  "places.viewport",

  // Classification
  "places.primaryType",
  "places.primaryTypeDisplayName",
  "places.types",

  // Status
  "places.businessStatus",

  // Visuals
  "places.photos",

  // Useful structural/location info
  "places.containingPlaces",
  "places.subDestinations",
  "places.entrances",
  "places.navigationPoints",

  // Google links
  "places.googleMapsUri",
  "places.googleMapsLinks",

  // Misc useful metadata
  "places.timeZone",
  "places.utcOffsetMinutes",
  "places.openingDate",
  "places.accessibilityOptions",
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

    console.log('places', data.places?.length, "results", data.places)

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

    if (process.env.ENABLE_SEARCH_LOGGING === "true") {
      void logSearchResults({
        latitude,
        longitude,
        radius: safeRadius,
        includedTypes,
        places,
      }).catch((error) => {
        console.error("Search logging failed:", error);
      });
    }

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