"use client";

import { ArrowLeft } from "lucide-react";

type StepHeaderProps = {
  title: string;
  description: string;
  onBack: () => void;
  backLabel: string;
};

export default function PanelHeader({
  title,
  description,
  onBack,
  backLabel,
}: StepHeaderProps) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="max-w-[16rem] text-2xl font-bold leading-tight tracking-tight">
          {title}
        </h2>

        <p className="mt-2 max-w-76 text-sm leading-6 text-white/60">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
        aria-label={backLabel}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    </div>
  );
}