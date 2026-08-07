"use client";

import type { ReactNode } from "react";

type TripOptionProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

export default function TripOption({
  label,
  icon,
  onClick,
}: TripOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-sm font-semibold text-sc-muted transition hover:border-sc-ocean hover:bg-sc-ocean hover:text-sc-bg active:scale-[0.98]"
    >
      {icon}
      {label}
    </button>
  );
}
