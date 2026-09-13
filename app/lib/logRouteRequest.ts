import { appendSheetRows } from "./googleSheetsLog";
import type { Coordinates, Mode } from "@/app/trip/types";

type LogRouteRequestInput = {
  origin: Coordinates;
  destination: Coordinates;
  mode: Mode;
  intermediates: Coordinates[];
  distanceMeters: number;
  duration: string | null;
  encodedPolyline: string | null;
};

const SHEET_RANGE = "RouteRequests!A:K";

/**
 * Dev/test instrumentation only. Appends one row per Routes API call
 * (the map's directions/route-ahead lookups) to a connected Google
 * Sheet, so route behavior can be reviewed outside the app.
 */
export async function logRouteRequest({
  origin,
  destination,
  mode,
  intermediates,
  distanceMeters,
  duration,
  encodedPolyline,
}: LogRouteRequestInput): Promise<void> {
  const timestamp = new Date().toISOString();
  const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const row = [
    timestamp,
    requestId,
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude,
    mode,
    intermediates.length,
    distanceMeters,
    duration ?? "",
    encodedPolyline ?? "",
  ];

  await appendSheetRows(SHEET_RANGE, [row]);
}
