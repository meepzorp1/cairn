"use client";

import { SlidersHorizontal } from "lucide-react";
import type { InterestId, Preferences } from "../../types";
import StepHeader from "../components/StepHeader";

const interests: Array<{ id: InterestId; label: string }> = [
  { id: "food", label: "Food" },
  { id: "coffee", label: "Coffee" },
  { id: "nightlife", label: "Nightlife" },
  { id: "outdoors", label: "Outdoors" },
  { id: "beaches-water", label: "Beaches & Water" },
  { id: "hiking", label: "Hiking" },
  { id: "arts-culture", label: "Arts & Culture" },
  { id: "history", label: "History" },
  { id: "shopping", label: "Shopping" },
  { id: "entertainment", label: "Entertainment" },
  { id: "family", label: "Family" },
  { id: "hidden-gems", label: "Hidden gems" },
];

type PreferencesStepProps = {
  preferences: Preferences;
  onBack: () => void;
  onChange: (preferences: Preferences) => void;
};

export default function PreferencesStep({
  preferences,
  onBack,
  onChange,
}: PreferencesStepProps) {
  const toggleInterest = (interest: InterestId) => {
    const selected = preferences.interests.includes(interest);

    onChange({
      ...preferences,
      interests: selected
        ? preferences.interests.filter((id) => id !== interest)
        : [...preferences.interests, interest],
    });
  };

  return (
    <section
      className="flex h-full min-h-0 flex-col"
      aria-label="Choose preferences"
    >
      <StepHeader
        title="What sounds good?"
        description="Fine-tune the suggestions. You can change these again while exploring."
        onBack={onBack}
        backLabel="Return to experience choices"
        eyebrow="Fine-tune it"
        eyebrowIcon={<SlidersHorizontal className="size-3.5" />}
      />

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 pr-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cairn-muted">
          Interests
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {interests.map(({ id, label }) => {
            const selected = preferences.interests.includes(id);

            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleInterest(id)}
                className={`min-h-14 rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[0.98] ${
                  selected
                    ? "border-cairn-gold bg-cairn-gold-soft text-cairn-text"
                    : "border-cairn-border/70 bg-cairn-card/60 text-cairn-muted hover:bg-cairn-card/70"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
