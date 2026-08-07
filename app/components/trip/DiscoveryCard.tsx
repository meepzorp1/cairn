"use client";

import { Clock3, Navigation, Route } from "lucide-react";
import { renderPlaceIcon } from  "@/app/place/icons";
import type { Discovery } from "@/app/trip";

type DiscoveryCardProps = {
  discovery: Discovery;
  active: boolean;
  onSelect: () => void;
};

export default function DiscoveryCard({
  discovery,
  active,
  onSelect,
}: DiscoveryCardProps) {
  const { place, distance, duration } = discovery;

const icon = active ? (
  <Navigation className="h-5 w-5" />
) : (
  renderPlaceIcon(place.primaryType, "h-5 w-5")
);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
        active
          ? "border-cyan-300/60 bg-cyan-300/10"
          : "border-white/10 bg-white/4 hover:bg-white/4"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-cyan-300 text-slate-950"
            : "bg-white/10 text-white/60"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-sm font-semibold">
            {place.name}
          </h3>

          {active && (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
              Selected
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs capitalize text-white/45">
          {place.primaryTypeLabel ??
            place.primaryType?.replaceAll("_", " ") ??
            "Nearby place"}
        </p>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-white/55">
          <span className="flex items-center gap-1">
            <Route className="h-3.5 w-3.5" />
            {distance}
          </span>

          <span className="flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {duration}
          </span>
        </div>
      </div>
    </button>
  );
}