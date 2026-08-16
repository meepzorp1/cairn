"use client";

import { useState } from "react";
import ActiveTrip from "./ActiveTrip";
import StartTripPanel from "../setup/StartTripPanel";
import type { Options } from "../types";
import GoogleMapsProvider from "@/app/api/map/GoogleMapsAPIProvider";

export default function ExplorePageContent() {
  const [trip, setTrip] = useState<Options | null>(null);

  if (trip) {
    return (
      <GoogleMapsProvider>
        <ActiveTrip trip={trip} onEndTrip={() => setTrip(null)} />
      </GoogleMapsProvider>
    );
  }

  return (
    <GoogleMapsProvider>
    <StartTripPanel
      onBack={() => window.history.back()}
      onStartTrip={setTrip}
    />
    </GoogleMapsProvider>
  );
}
