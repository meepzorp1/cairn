"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type StepHeaderProps = {
  title: string;
  description: string;
  onBack: () => void;
  backLabel: string;
  eyebrow?: string;
  eyebrowIcon?: ReactNode;
};

export default function StepHeader({
  title,
  description,
  onBack,
  backLabel,
  eyebrow,
  eyebrowIcon,
}: StepHeaderProps) {
  return (
    <header className="flex shrink-0 flex-col items-start">
      <button
        type="button"
        onClick={onBack}
        className="flex size-9.5 shrink-0 items-center justify-center rounded-full border border-cairn-border/70 bg-cairn-card/35 text-cairn-muted transition hover:border-cairn-text/20 hover:bg-cairn-card/70 hover:text-cairn-text active:scale-95"
        aria-label={backLabel}
      >
        <ArrowLeft className="size-4.5" />
      </button>

      {eyebrow && (
        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-cairn-gold-soft px-3.5 py-1.5 text-sm font-medium text-cairn-gold">
          {eyebrowIcon}
          {eyebrow}
        </span>
      )}

      <div className="min-w-0">
        <h2 className="mt-3 max-w-68 font-display text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-cairn-text sm:max-w-none sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-cairn-muted sm:text-base">
          {description}
        </p>
      </div>
    </header>
  );
}
