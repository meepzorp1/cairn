"use client";

import type { ReactNode } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

type GoogleMapsProviderProps = {
  children: ReactNode;
};

export default function GoogleMapsProvider({
  children,
}: GoogleMapsProviderProps) {
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex min-h-80 items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div>
          <p className="font-semibold">
            Google Maps is unavailable
          </p>

          <p className="mt-2 text-sm text-white/60">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      {children}
    </APIProvider>
  );
}