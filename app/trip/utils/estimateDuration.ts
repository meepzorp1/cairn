import type { Mode } from "../types";

export default function estimateDuration(distanceMiles: number, mode: Mode): string {
  const speedByMode: Record<Mode, number> = {
    walking: 3,
    biking: 10,
    driving: 20,
  };

  const hours = distanceMiles / speedByMode[mode];

  const minutes = Math.max(1, Math.round(hours * 60));

  return `${minutes} min`;
}