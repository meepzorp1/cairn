import { appendSheetRows } from "@/app/lib/googleSheetsLog";
import getDistanceInMeters from "@/app/trip/utils/getDistanceInMeters";
import type { NearbyPlace } from "../types";

type LogSearchResultsInput = {
  latitude: number;
  longitude: number;
  radius: number;
  includedTypes: string[];
  places: NearbyPlace[];
};

const SHEET_RANGE = "SearchResults!A:O";

/**
 * Dev/test instrumentation only. Appends one row per result (or a
 * single "no results" row) to a connected Google Sheet, so search
 * tuning can be reviewed outside the app.
 */
export async function logSearchResults({
  latitude,
  longitude,
  radius,
  includedTypes,
  places,
}: LogSearchResultsInput): Promise<void> {
  const timestamp = new Date().toISOString();
  const searchId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const includedTypesLabel = includedTypes.join(", ");

  const searchContext = [
    timestamp,
    searchId,
    latitude,
    longitude,
    radius,
    includedTypesLabel,
  ];

  const rows =
    places.length > 0
      ? places.map((place) => [
          ...searchContext,
          place.id,
          place.name,
          place.latitude,
          place.longitude,
          place.primaryType ?? "",
          place.primaryTypeLabel ?? "",
          place.rating ?? "",
          place.userRatingCount ?? "",
          Math.round(
            getDistanceInMeters(
              { latitude, longitude },
              { latitude: place.latitude, longitude: place.longitude },
            ),
          ),
        ])
      : [[...searchContext, "", "(no results)", "", "", "", "", "", "", ""]];

  await appendSheetRows(SHEET_RANGE, rows);
}
