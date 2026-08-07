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
      className="flex-1 flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-sm font-semibold text-white/75 transition hover:border-cyan-300 hover:bg-cyan-300 hover:text-slate-950 active:scale-[0.98]"
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}