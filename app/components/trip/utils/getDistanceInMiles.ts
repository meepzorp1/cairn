import type { Coordinates } from "@/app/types/geo";

export default function getDistanceInMiles(start: Coordinates, end: Coordinates): number {

  const earthRadiusMiles = 3958.8;

  const latitude1 = (start.latitude * Math.PI) / 180;
  const latitude2 = (end.latitude * Math.PI) / 180;

  const latitudeDifference = ((end.latitude - start.latitude) * Math.PI) / 180;

  const longitudeDifference =
    ((end.longitude - start.longitude) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
}