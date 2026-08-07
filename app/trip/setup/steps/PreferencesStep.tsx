"use client";

import type { Ref } from "react";
import type { InterestId, Preferences } from "../../types";
import StepHeader from "../components/StepHeader";

const interests: Array<{ id: InterestId; label: string }> = [
  { id: "restaurants", label: "Food" },
  { id: "coffee", label: "Coffee" },
  { id: "study", label: "Study spots" },
  { id: "parks", label: "Parks" },
  { id: "beaches", label: "Beaches" },
  { id: "attractions", label: "Attractions" },
  { id: "shopping", label: "Shopping" },
  { id: "museums", label: "Museums" },
  { id: "live-events", label: "Live events" },
  { id: "nightlife", label: "Nightlife" },
  { id: "filming-locations", label: "Film locations" },
  { id: "hidden-gems", label: "Hidden gems" },
];

type PreferencesStepProps = {
  panelRef: Ref<HTMLElement>;
  preferences: Preferences;
  onBack: () => void;
  onChange: (preferences: Preferences) => void;
};

export default function PreferencesStep({
  panelRef,
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
      ref={panelRef}
      className="absolute inset-0 flex min-h-0 flex-col bg-sc-bg"
      aria-label="Choose preferences"
    >
      <StepHeader
        title="What sounds good?"
        description="Fine-tune the suggestions. You can change these again while exploring."
        onBack={onBack}
        backLabel="Return to experience choices"
      />

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4 pr-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-sc-muted">
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
                className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[0.98] ${
                  selected
                    ? "border-sc-sun bg-sc-sun-soft text-sc-text"
                    : "border-white/10 bg-white/5 text-sc-muted hover:bg-white/10"
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
