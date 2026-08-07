export default function formatDistance(distanceMiles: number): string {
  if (distanceMiles < 0.1) {
    const feet = Math.max(100, Math.round((distanceMiles * 5280) / 50) * 50);

    return `${feet} ft`;
  }

  return `${distanceMiles.toFixed(1)} miles`;
}