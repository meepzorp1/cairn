"use client";

import type { ReactNode } from "react";
import { Star } from "lucide-react";

type AudienceOptionProps = {
  label: string;
  description: string;
  icon: ReactNode;
  active: boolean;
  featured?: boolean;
  onClick: () => void;
};

export default function AudienceOption({
  label,
  description,
  icon,
  active,
  featured = false,
  onClick,
}: AudienceOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 active:scale-[0.99] ${
        active
          ? "min-h-23.5 border-sc-ocean bg-sc-ocean-soft px-4 py-4"
          : "h-12 border-white/10 bg-white/5 px-3 hover:border-white/25 hover:bg-white/10"
      } ${
        featured
          ? "border-sc-feature/50 bg-sc-feature-soft"
          : ""
      }`}
    >
      {featured && (
        <span className="absolute right-3 top-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-sc-feature">
          <Star className="size-3" />
          Featured
        </span>
      )}

      <span
        className={`flex gap-3 ${
          active ? "items-start" : "h-full items-center"
        }`}
      >
        <span
          className={`flex shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            active
              ? "h-9 w-11 bg-sc-ocean text-sc-bg"
              : "size-8 bg-white/10 text-sc-muted"
          }`}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block font-semibold text-sc-text ${
              active ? "text-base" : "text-sm"
            }`}
          >
            {label}
          </span>

          <span
            className={`block overflow-hidden text-sm leading-5 text-sc-muted transition-all duration-300 ${
              active
                ? "mt-1 max-h-14 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {description}
          </span>
        </span>
      </span>
    </button>
  );
}