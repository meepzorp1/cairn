import type { Coordinates } from "../types";

export default function getDistanceInMeters(
  first: Coordinates,
  second: Coordinates,
): number {
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

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
