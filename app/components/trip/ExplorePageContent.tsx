"use client";

import type { Audience } from "@/app/types/trip";

// import ActiveTrip from "@/app/components/trip/ActiveTrip";
// import StartTripPanel from "@/app/components/trip/setup/ExplorationPanel";
// import { useActiveTrip } from "../../stores/active-trip";
// import { TripDrawerView } from "../components/trip/Drawer/types";
// import { ActiveTripProvider } from "../../stores/active-trip";
// import type { TripAudience, TripMode, TripOptions } from "@/app/types/trip";
// import type { ActiveTripConfig } from "../../stores/active-trip";
import useActiveTrip from "@/app/hooks/useActiveTrip";
import { useEffect, useState } from "react";

type ExploreView = "setup" | "active";

export default function ExplorePageContent() {
  const { state: activeTrip, dispatch: activeTripDispatch } = useActiveTrip();

  console.log("new State: ", activeTrip);

  const initialAudience: Audience | null =
    requestedAudience === "student" || requestedAudience === "visitor"
      ? requestedAudience
      : null;

  const [view, setView] = useState<ExploreView>("setup");
  const [trip, setTrip] = useState<TripOptions | null>(null);

  const initialMode: TripMode =
    requestedMode === "walking" ||
    requestedMode === "biking" ||
    requestedMode === "driving"
      ? requestedMode
      : "walking";
  {
    /*
      what is mode? temporary? maybe this isn't necessary
      activeTripDispatch({ type: "SET_TRIP_MODE", payload: initialMode }); */
  }

  const setupTripConfig: ActiveTripConfig = {
    mode: initialMode,
    audience: initialAudience ?? "visitor",
  };

  useEffect(() => {
    if (activeTrip.trip) return;
      activeTripDispatch({ type: "SET_DRAWER_VIEW", payload: "setup" });
  }, []);

  const handleStartTrip = (options: TripOptions) => {
    setTrip(options);
    activeTripDispatch({ type: "SET_TRIP_MODE", payload: options.mode });
    activeTripDispatch({
      type: "SET_TRIP_AUDIENCE",
      payload: options.audience,
    });
    setView("active");
    activeTripDispatch({
      type: "SET_DRAWER_VIEW",
      payload: "on the way" as TripDrawerView,
    });
  };

  const handleEndTrip = () => {
    setTrip(null);
    setView("setup");
  };

  if (view === "active" && trip) {
    const activeTripConfig: ActiveTripConfig = {
      mode: trip.mode,
      audience: trip.audience,
    };

    return (
        <ActiveTrip trip={trip} onEndTrip={handleEndTrip} />
    );
  }

  return (
      <StartTripPanel
        initialAudience={initialAudience}
        onBack={() => window.history.back()}
        onStartTrip={handleStartTrip}
      />
  );
}
