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
          ? "min-h-23.5 border-cairn-gold bg-cairn-gold-soft px-4 py-4"
          : "h-12 border-cairn-border/70 bg-cairn-card/60 px-3 hover:border-cairn-text/25 hover:bg-cairn-card/70"
      } ${
        featured
          ? "border-cairn-feature/50 bg-cairn-feature-soft"
          : ""
      }`}
    >
      {featured && (
        <span className="absolute right-3 top-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-cairn-feature">
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
              ? "h-9 w-11 bg-cairn-gold text-cairn-bg"
              : "size-8 bg-cairn-gold-soft text-cairn-gold"
          }`}
        >
          {icon}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block font-semibold text-cairn-text ${
              active ? "text-base" : "text-sm"
            }`}
          >
            {label}
          </span>

          <span
            className={`block overflow-hidden text-sm leading-5 text-cairn-muted transition-all duration-300 ${
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