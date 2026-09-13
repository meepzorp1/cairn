"use client";

import { Film, GraduationCap, Sparkles, Users } from "lucide-react";
import type { Audience } from "../../types";
import AudienceOption from "../components/AudienceOption";
import StepHeader from "../components/StepHeader";

type AudienceStepProps = {
  audience: Audience | null;
  onSelectAudience: (audience: Audience) => void;
  onBack: () => void;
};

export default function AudienceStep({
  audience,
  onSelectAudience,
  onBack,
}: AudienceStepProps) {
  return (
    <section
      className="flex h-full min-h-0 flex-col"
      aria-label="Choose exploration style"
    >
      <StepHeader
        title="What should we show you?"
        description="Choose the kind of Santa Cruz experience you want along the way."
        onBack={onBack}
        backLabel="Return to travel modes"
        eyebrow="Set the scene"
        eyebrowIcon={<Sparkles className="size-3.5" />}
      />

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cairn-muted">
          Show me
        </p>
        <div className="flex flex-col gap-2">
          <AudienceOption
            label="Lost Boys Tour"
            description="Follow filming locations from the cult classic through Santa Cruz."
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
            label="Custom"
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
