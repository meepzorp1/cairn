"use client";

import { LucideIcon } from "lucide-react";

type TransportationOptionProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

export default function TransportationOption({ label, icon: Icon, onClick }: TransportationOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cairn-border/70 bg-cairn-card/60 px-3 py-4 text-sm font-semibold text-cairn-text/75 transition hover:border-cairn-gold hover:bg-cairn-gold hover:text-cairn-outer active:scale-[0.98]"
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}