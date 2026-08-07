"use client";

import {
  Accessibility,
  Baby,
//   Beef,
  BookOpen,
  Coffee,
  DollarSign,
  Film,
  Landmark,
  Moon,
  Music,
  PawPrint,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Trees,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import PanelHeader from "@/app/trip/setup/PanelHeader";

import type {
  InterestId,
  Audience,
  Budget,
  Preferences,
} from "@/app/types/trip";
import {
  TRIP_PRESETS,
  copyTripPreferences,
} from "@/app/trip/components/presets";

type PreferencesContainerProps = {
  audience: Audience;
  onBack: () => void;
  onChange: (preferences: Preferences) => void;
};

type InterestOption = {
  id: InterestId;
  label: string;
  description: string;
  icon: LucideIcon;
};

type ToggleOption = {
  id: keyof Preferences["misc"];
  label: string;
  icon: LucideIcon;
};

const INTEREST_OPTIONS: InterestOption[] = [
  {
    id: "restaurants",
    label: "Restaurants",
    description: "Meals, quick bites, and local favorites.",
    icon: Utensils,
  },
  {
    id: "coffee",
    label: "Coffee",
    description: "Coffee shops, cafés, and bakeries.",
    icon: Coffee,
  },
  {
    id: "study",
    label: "Study",
    description: "Libraries and places suited for focusing.",
    icon: BookOpen,
  },
  {
    id: "parks",
    label: "Parks",
    description: "Green spaces, gardens, and trails.",
    icon: Trees,
  },
  {
    id: "beaches",
    label: "Beaches",
    description: "Beaches and coastal stops.",
    icon: Waves,
  },
  {
    id: "attractions",
    label: "Attractions",
    description: "Popular landmarks and things to do.",
    icon: Landmark,
  },
  {
    id: "shopping",
    label: "Shopping",
    description: "Local stores, markets, and thrift shops.",
    icon: ShoppingBag,
  },
  {
    id: "museums",
    label: "Museums",
    description: "Museums, galleries, and cultural spaces.",
    icon: Sparkles,
  },
  {
    id: "live-events",
    label: "Live Events",
    description: "Music, performances, and local events.",
    icon: Music,
  },
  {
    id: "nightlife",
    label: "Nightlife",
    description: "Evening entertainment and late-night spots.",
    icon: Moon,
  },
  {
    id: "filming-locations",
    label: "Filming Locations",
    description: "Recognizable movie and television locations.",
    icon: Film,
  },
  {
    id: "hidden-gems",
    label: "Hidden Gems",
    description: "Less obvious places worth discovering.",
    icon: Star,
  },
];

const MISC_OPTIONS: ToggleOption[] = [
  {
    id: "openNow",
    label: "Open now",
    icon: Sun,
  },
  {
    id: "highlyRated",
    label: "Highly rated",
    icon: Star,
  },
  {
    id: "petFriendly",
    label: "Pet friendly",
    icon: PawPrint,
  },
  {
    id: "kidFriendly",
    label: "Kid friendly",
    icon: Baby,
  },
  {
    id: "outdoorSeating",
    label: "Outdoor seating",
    icon: Trees,
  },
  {
    id: "wheelchairAccessible",
    label: "Wheelchair accessible",
    icon: Accessibility,
  },
];

const BUDGET_OPTIONS: {
  value: Budget;
  label: string;
  description: string;
}[] = [
  {
    value: "low",
    label: "$",
    description: "Budget",
  },
  {
    value: "medium",
    label: "$$",
    description: "Moderate",
  },
  {
    value: "high",
    label: "$$$",
    description: "Higher end",
  },
  {
    value: "any",
    label: "Any",
    description: "No preference",
  },
];

export default function PreferencesContainer({
  audience,
  onBack,
  onChange,
}: PreferencesContainerProps) {
  const [preferences, setPreferences] = useState<Preferences>(() =>
    copyTripPreferences(TRIP_PRESETS[audience])
  );

  const toggleInterest = (interestId: InterestId) => {
    setPreferences((current) => {
      const selected = current.interests.includes(interestId);

      return {
        ...current,
        interests: selected
          ? current.interests.filter((id) => id !== interestId)
          : [...current.interests, interestId],
      };
    });
  };

  const setBudget = (budget: Budget) => {
    setPreferences((current) => ({
      ...current,
      budget,
    }));
  };

  const toggleMiscOption = (
    optionId: keyof Preferences["misc"]
  ) => {
    setPreferences((current) => ({
      ...current,
      misc: {
        ...current.misc,
        [optionId]: !current.misc[optionId],
      },
    }));
  };

  useEffect(() => {
    onChange(preferences);
  }, [preferences, onChange]);

  return (
    <div className="overflow-y-auto flex h-full min-h-0 flex-col">
      <PanelHeader
        title="What sounds good?"
        description="Add or remove interests before starting your trip."
        onBack={onBack}
        backLabel="Return to audience options"
      />

      <div className="h-full snap-mandatory snap-y mt-4 min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain pb-4">
        <PreferenceSection
          title="Interests"
          description="Choose the places you want to discover."
        >
          <div className="grid grid-cols-2 gap-2">
            {INTEREST_OPTIONS.map((option) => {
              const active = preferences.interests.includes(option.id);

              return (
                <InterestButton
                  key={option.id}
                  option={option}
                  active={active}
                  onClick={() => toggleInterest(option.id)}
                />
              );
            })}
          </div>
        </PreferenceSection>

        <PreferenceSection
          title="Budget"
          description="Choose a general price range."
        >
          <div className="grid grid-cols-2 gap-3">
            {BUDGET_OPTIONS.map((option) => {
              const active = preferences.budget === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBudget(option.value)}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    active
                      ? "border-cyan-300/70 bg-cyan-300/10 text-white"
                      : "border-white/10 bg-white/4 text-white/65 hover:border-white/20 hover:bg-white/7",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />

                    <span className="font-semibold">{option.label}</span>
                  </div>

                  <p className="mt-1 text-xs text-white/45">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </PreferenceSection>

        <PreferenceSection
          title="More preferences"
          description="These filters may depend on available place data."
        >
          <div className="space-y-2">
            {MISC_OPTIONS.map((option) => (
              <MiscToggle
                key={option.id}
                option={option}
                active={preferences.misc[option.id]}
                onClick={() => toggleMiscOption(option.id)}
              />
            ))}
          </div>
        </PreferenceSection>
      </div>

      <p className="shrink-0 pt-3 text-center text-xs text-white/40">
        {preferences.interests.length} interest
        {preferences.interests.length === 1 ? "" : "s"} selected
      </p>
    </div>
  );
}

function PreferenceSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-dvh snap-start">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <p className="mt-0.5 text-[11px] text-white/45">{description}</p>
      </div>

      {children}
    </section>
  );
}

function InterestButton({
  option,
  active,
  onClick,
}: {
  option: InterestOption;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "flex min-h-14 items-center gap-3 rounded-xl border px-3 py-2 text-left transition",
        active
          ? "border-cyan-300/70 bg-cyan-300/10 text-white"
          : "border-white/10 bg-white/4 text-white/65 hover:border-white/20 hover:bg-white/[0.07]",
      ].join(" ")}
    >
      {active ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-slate-950 text-xs font-bold">
          ✓
        </span>
      ) : (
        <Icon className="h-4 w-4 shrink-0 text-white/50" />
      )}

      <span className="min-w-0 flex-1 text-sm font-semibold leading-tight">
        {option.label}
      </span>
    </button>
  );
}

function MiscToggle({
  option,
  active,
  onClick,
}: {
  option: ToggleOption;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/4 p-3 text-left transition hover:bg-white/[0.07]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/6">
        <Icon className="h-4 w-4 text-white/65" />
      </div>

      <span className="flex-1 text-sm font-medium text-white/80">
        {option.label}
      </span>

      <span
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          active ? "bg-cyan-300" : "bg-white/15",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
            active ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </span>
    </button>
  );
}
