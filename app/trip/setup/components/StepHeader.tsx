"use client";

import { ArrowLeft } from "lucide-react";

type StepHeaderProps = {
  title: string;
  description: string;
  onBack: () => void;
  backLabel: string;
};

export default function StepHeader({
  title,
  description,
  onBack,
  backLabel,
}: StepHeaderProps) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="max-w-68 text-2xl font-bold leading-tight tracking-tight sm:max-w-none sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-sc-muted sm:text-base">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sc-muted transition hover:bg-white/10 hover:text-sc-text active:scale-95"
        aria-label={backLabel}
      >
        <ArrowLeft className="size-5" />
      </button>
    </header>
  );
}
