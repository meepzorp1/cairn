"use client";

import type { Audience, Preferences } from "@/app/types/trip";
import PreferencesContainer from "@/app/trip/setup/PreferencesContainer";

type PreferencesStepProps = {
  preferencesPageRef: React.Ref<HTMLDivElement>;
  audience: Audience;
  onBack: () => void;
  onChange: (preferences: Preferences) => void;
};

export default function PreferencesStep({
  preferencesPageRef,
  audience,
  onBack,
  onChange,
}: PreferencesStepProps) {
  return (
    <section ref={preferencesPageRef} className="PREFERENCES PANEL z-30 snap-mandatory snap-y absolute inset-0 min-h-0 bg-sc-bg">
      <PreferencesContainer
        audience={audience}
        onBack={onBack}
        onChange={onChange}
      />
    </section>
  );
}
