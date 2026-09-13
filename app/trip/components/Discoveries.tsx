"use client";

import { useEffect, useRef } from "react";
import { RefreshCw } from "lucide-react";
import type { Discovery } from "../types";
import DiscoveryCard from "./DiscoveryCard";

type DiscoveriesProps = {
  discoveries: Discovery[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void | Promise<void>;
  onSelectPlace: (place: Discovery) => void;
  onOpenPlace?: (place: Discovery) => void;
};

export default function Discoveries({
  discoveries,
  selectedId,
  isLoading,
  error,
  onRefresh,
  onSelectPlace,
  onOpenPlace,
}: DiscoveriesProps) {
  const selectedCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    selectedCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedId]);

  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-5 sm:px-6">
      <div className="flex shrink-0 items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cairn-gold">
            Keep exploring
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium text-cairn-text">
            {discoveries.length} places nearby
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-cairn-border px-3 py-2 text-sm text-cairn-text/75 transition hover:bg-cairn-card/70 disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 shrink-0 rounded-xl border border-cairn-danger/25 bg-cairn-danger-soft p-3 text-sm text-cairn-danger">
          {error}
        </div>
      )}

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
        <div className="space-y-3">
          {discoveries.map((discovery) => {
            const selected = discovery.place.id === selectedId;

            return (
              <div
                key={discovery.place.id}
                ref={selected ? selectedCardRef : undefined}
              >
                <DiscoveryCard
                  discovery={discovery}
                  active={selected}
                  onSelect={() => onSelectPlace(discovery)}
                  onOpen={
                    onOpenPlace
                      ? () => onOpenPlace(discovery)
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
