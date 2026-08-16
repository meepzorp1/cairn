"use client";

import { useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type {
  Audience,
  Destination,
  Intent,
  Mode,
  Options,
  Preferences,
} from "../types";
import { DestinationModal } from "@/app/components/modals";
import useSetupPanelAnimation, {
  type SetupStep,
} from "./animations/useSetupPanelAnimation";
import AudienceStep from "./steps/AudienceStep";
import IntentStep from "./steps/IntentStep";
import PreferencesStep from "./steps/PreferencesStep";
import TransportationStep from "./steps/TransportationStep";

const presetPreferences: Record<Audience, Preferences> = {
  student: {
    interests: ["restaurants", "coffee", "study"],
    budget: "low",
    misc: {
      openNow: false,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },
  visitor: {
    interests: ["restaurants", "beaches", "attractions", "museums"],
    budget: "any",
    misc: {
      openNow: false,
      highlyRated: true,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },
  lostboys: {
    interests: ["filming-locations", "attractions", "hidden-gems"],
    budget: "any",
    misc: {
      openNow: false,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },
  local: {
    interests: ["restaurants", "live-events", "hidden-gems"],
    budget: "any",
    misc: {
      openNow: false,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },
  custom: {
    interests: [],
    budget: "any",
    misc: {
      openNow: false,
      highlyRated: false,
      petFriendly: false,
      kidFriendly: false,
      outdoorSeating: false,
      wheelchairAccessible: false,
    },
  },
};

function copyPreferences(preferences: Preferences): Preferences {
  return {
    ...preferences,
    interests: [...preferences.interests],
    misc: { ...preferences.misc },
  };
}

type StartTripPanelProps = {
  initialAudience?: Audience | null;
  onBack: () => void;
  onStartTrip: (options: Options) => void;
};

export default function StartTripPanel({
  initialAudience = null,
  onBack,
  onStartTrip,
}: StartTripPanelProps) {
  const [step, setStep] = useState<SetupStep>("intent");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [audience, setAudience] = useState<Audience | null>(initialAudience);
  const [preferences, setPreferences] = useState<Preferences>(() =>
    copyPreferences(presetPreferences[initialAudience ?? "custom"]),
  );

  const intentRef = useRef<HTMLElement>(null);
  const travelRef = useRef<HTMLElement>(null);
  const audienceRef = useRef<HTMLElement>(null);
  const preferencesRef = useRef<HTMLElement>(null);

  const panelRefs = useMemo(
    () => ({
      intent: intentRef,
      travel: travelRef,
      audience: audienceRef,
      preferences: preferencesRef,
    }),
    [],
  );

  useSetupPanelAnimation(panelRefs, step);

  const canStart =
    intent !== null &&
    (intent === "nearby" || destination !== null) &&
    mode !== null &&
    audience !== null &&
    preferences.interests.length > 0;

  const selectIntent = (selectedIntent: Intent) => {
    if (selectedIntent === "destination") {
      setDestinationModalOpen(true);
      return;
    }

    setIntent("nearby");
    setDestination(null);
    setStep("travel");
  };

  const confirmDestination = (selectedDestination: Destination) => {
    setIntent("destination");
    setDestination(selectedDestination);
    setDestinationModalOpen(false);
    setStep("travel");
  };

  const selectMode = (selectedMode: Mode) => {
    setMode(selectedMode);
    setStep("audience");
  };

  const selectAudience = (selectedAudience: Audience) => {
    setAudience(selectedAudience);
    setPreferences(copyPreferences(presetPreferences[selectedAudience]));
    setStep("preferences");
  };

  const start = () => {
    if (!intent || !mode || !audience || !canStart) return;

    if (intent === "destination") {
      if (!destination) return;

      onStartTrip({
        intent,
        destination,
        mode,
        audience,
        preferences,
      });
      return;
    }

    onStartTrip({
      intent,
      mode,
      audience,
      preferences,
    });
  };

  return (
    <main className="relative h-dvh min-h-0 w-full text-sc-text">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-sc-panel/20 via-sc-bg/70 to-sc-bg"
      />

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-md flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:max-w-3xl sm:px-8">
        <div className="flex shrink-0 items-center gap-2 text-sc-ocean">
          <Sparkles className="size-4" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">
            Start exploring
          </span>
        </div>

        <div className="relative mt-5 min-h-0 flex-1">
          <IntentStep
            panelRef={intentRef}
            onBack={onBack}
            onSelectIntent={selectIntent}
          />
          <TransportationStep
            panelRef={travelRef}
            onBack={() => setStep("intent")}
            onSelectMode={selectMode}
          />
          <AudienceStep
            panelRef={audienceRef}
            audience={audience}
            onBack={() => setStep("travel")}
            onSelectAudience={selectAudience}
          />
          <PreferencesStep
            panelRef={preferencesRef}
            preferences={preferences}
            onBack={() => setStep("audience")}
            onChange={setPreferences}
          />
        </div>

        <footer className="shrink-0 border-t border-white/10 bg-sc-bg/95 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur">
          <button
            type="button"
            disabled={!canStart}
            onClick={start}
            className="flex h-12 w-full items-center justify-center rounded-xl px-4 font-semibold transition enabled:bg-sc-sun enabled:text-sc-bg enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-sc-muted"
          >
            Start exploring
          </button>
        </footer>
      </div>
      <DestinationModal
        isOpen={destinationModalOpen}
        onClose={() => setDestinationModalOpen(false)}
        onConfirm={confirmDestination}
      />
    </main>
  );
}
