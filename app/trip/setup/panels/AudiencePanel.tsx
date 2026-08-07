"use client";

import {
  Film,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

import type { Audience } from "@/app/types/trip";
import StepHeader from "@/app/trip/setup/components/StepHeader";
import AudienceOption from "@/app/trip/setup/components/AudienceOption";

type AudienceStepProps = {
  audiencePageRef: React.Ref<HTMLElement>;
  audience: Audience | null;
  onSelectAudience: (audience: Audience) => void;
  onBack: () => void;
};

export default function AudiencePanel({
  audiencePageRef,
  audience,
  onSelectAudience,
  onBack,
}: AudienceStepProps) {
  return (
    <section
      ref={audiencePageRef}
      className="flex min-h-0 flex-1 flex-col"
    >
      <StepHeader
        title="Who are you exploring as?"
        onBack={onBack}
        description="Select the type of trip you want to create, and we’ll show you the best places for your audience."
        backLabel="Back to trip setup"
      />

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
          Show me
        </p>

        <div className="flex flex-col gap-2">
          <AudienceOption
            label="Lost Boys Tour"
            description="Follow the filming locations from the cult classic through Santa Cruz."
            icon={<Film className="size-4" />}
            featured
            active={audience === "lostboys"}
            onClick={() => onSelectAudience("lostboys")}
          />

          <AudienceOption
            label="Student"
            description="Cheap eats, study spots, campus life and useful services."
            icon={<GraduationCap className="size-4" />}
            active={audience === "student"}
            onClick={() => onSelectAudience("student")}
          />

          <AudienceOption
            label="Visitor"
            description="Landmarks, attractions, history and local highlights."
            icon={<Users className="size-4" />}
            active={audience === "visitor"}
            onClick={() => onSelectAudience("visitor")}
          />

          <AudienceOption
            label="Custom Trip"
            description="Choose exactly what kinds of places and experiences you want."
            icon={<Sparkles className="size-4" />}
            active={audience === "custom"}
            onClick={() => onSelectAudience("custom")}
          />
        </div>
      </div>
    </section>
  );
}