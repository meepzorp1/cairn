"use client";

import { Film, GraduationCap, Sparkles, Users } from "lucide-react";
import type { Audience } from "@/app/types/trip";

type AudienceStepProps = {
  audiencePageRef: React.Ref<HTMLDivElement>;
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
      className="AUDIENCE PANEL z-40 absolute inset-0 flex min-h-0 flex-col bg-sc-bg"
      aria-label="Choose trip audience"
    >
      <StepHeader
        title="What should we show you?"
        description="Choose the kind of Santa Cruz experience you want along the way."
        onBack={onBack}
        backLabel="Return to travel modes"
      />

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
          Show me
        </p>

        <div className="flex flex-col gap-2">
          <AudienceOption
            label="Lost Boys Tour"
            description="Follow the filming locations from the cult classic through Santa Cruz."
            icon={Film}
            featured
            accent="red"
            active={audience === "lostboys"}
            onClick={() => onSelectAudience("lostboys")}
          />

          <AudienceOption
            label="Student"
            description="Cheap eats, study spots, campus life and useful services."
            icon={GraduationCap}
            active={audience === "student"}
            onClick={() => onSelectAudience("student")}
          />

          <AudienceOption
            label="Visitor"
            description="Landmarks, attractions, history and local highlights."
            icon={Users}
            active={audience === "visitor"}
            onClick={() => onSelectAudience("visitor")}
          />

          <AudienceOption
            label="Custom Trip"
            description="Choose exactly what kinds of places and experiences you want."
            icon={Sparkles}
            active={audience === "custom"}
            onClick={() => onSelectAudience("custom")}
          />
        </div>
      </div>
    </section>
  );
}
