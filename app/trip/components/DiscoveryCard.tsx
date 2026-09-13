"use client";

import { Clock3, Route } from "lucide-react";
import { getPlaceIcon } from "@/app/place/icons";
import type { Discovery } from "../types";

type DiscoveryCardProps = {
  discovery: Discovery;
  active: boolean;
  onSelect: () => void;
  onOpen?: () => void;
};

export default function DiscoveryCard({
  discovery,
  active,
  onSelect,
  onOpen,
}: DiscoveryCardProps) {
  const { place } = discovery;
  const icon = getPlaceIcon(place.primaryType, "size-5");
  const category =
    place.primaryTypeLabel ??
    place.primaryType?.replaceAll("_", " ") ??
    "Nearby place";

  return (
    <button
      type="button"
      onClick={onSelect}
      onDoubleClick={onOpen}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
        active
          ? "border-cairn-gold/60 bg-cairn-gold/10"
          : "border-cairn-border/70 bg-cairn-card/50 hover:bg-cairn-card/55"
      }`}
    >
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-cairn-gold text-cairn-outer"
            : "bg-cairn-card/70 text-cairn-muted"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-sm font-semibold">{place.name}</h3>

          {active && (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-cairn-gold">
              Selected
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs capitalize text-cairn-muted/75">
          {category}
        </p>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-cairn-muted/90">
          <span className="flex items-center gap-1">
            <Route className="size-3.5" />
            {discovery.distance}
          </span>

          <span className="flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {discovery.duration}
          </span>
        </div>
      </div>
    </button>
  );
}
