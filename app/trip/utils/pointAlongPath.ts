import type { Coordinates } from "../types";
import getDistanceInMeters from "./getDistanceInMeters";

function interpolate(
  start: Coordinates,
  end: Coordinates,
  fraction: number,
): Coordinates {
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * fraction,
    longitude: start.longitude + (end.longitude - start.longitude) * fraction,
  };
}

/**
 * Walks a route path from its start and returns the point that many
 * meters along it. Falls back to the last point if the path is shorter
 * than the requested distance.
 */
export default function pointAlongPath(
  path: Coordinates[],
  distanceMeters: number,
): Coordinates | null {
  if (path.length === 0) return null;
  if (distanceMeters <= 0) return path[0];

  let remaining = distanceMeters;

  for (let i = 0; i < path.length - 1; i++) {
    const segmentDistance = getDistanceInMeters(path[i], path[i + 1]);

    if (remaining <= segmentDistance) {
      const fraction =
        segmentDistance === 0 ? 0 : remaining / segmentDistance;

      return interpolate(path[i], path[i + 1], fraction);
    }

    remaining -= segmentDistance;
  }

  return path[path.length - 1];
}
