"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Footprints,
  ListOrdered,
  RefreshCw,
  Route,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import useActiveTrip from "@/app/hooks/useActiveTrip";
import type { Options } from "@/app/types/trip";
import Discoveries from "./Discoveries";
import Header from "./Header";
import MapSection from "./MapSection";
import SelectedPlaceModal from "@/app/components/modals/SelectedPlaceModal";
import DrawerViewHeader from "./TripDrawer/DrawerViewHeader";
import DrawerPlaceholderView from "./TripDrawer/views/DrawerPlaceholderView";
import {
  drawerSnapHeight,
  preferredSnapByView,
  type TripDrawerSnap,
  type TripDrawerView,
} from "./TripDrawer/types";

export type ActiveTripOptions = Options;

type ActiveTripProps = {
  trip: ActiveTripOptions;
  onEndTrip: () => void;
};

export default function ActiveTrip({ trip, onEndTrip }: ActiveTripProps) {
  const [drawerView, setDrawerView] = useState<TripDrawerView>("current");
  const [drawerSnap, setDrawerSnap] = useState<TripDrawerSnap>("peek");

  const {
    location,
    status,
    locationError,
    startTracking,
    places,
    placesLoading,
    placesError,
    refresh,
    discoveries,
    selectedDiscovery,
    remainingDiscoveries,
    selectedDiscoveryId,
    setSelectedDiscoveryId,
    selectedPlace,
    setSelectedPlace,
  } = useActiveTrip(trip);

  const placesExpanded = drawerSnap !== "peek";

  const openDrawerView = (view: TripDrawerView) => {
    setDrawerView(view);
    setDrawerSnap(preferredSnapByView[view]);
  };

  const returnToCurrent = () => {
    setDrawerView("current");
    setDrawerSnap("full");
  };

  const collapseDrawer = () => {
    setDrawerSnap("peek");
  };

  if (!location) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="font-semibold">
            {status === "unavailable" || status === "denied"
              ? "Location unavailable"
              : "Finding your location"}
          </p>

          <p className="mt-2 text-sm text-white/60">
            {locationError ??
              "Allow location access so we can find real places near you."}
          </p>

          <button
            type="button"
            onClick={startTracking}
            className="mt-4 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <section className="relative h-dvh overflow-hidden bg-slate-950 text-white">
      <div className="relative z-10 flex h-full flex-col">
        <TripHeader onEndTrip={onEndTrip} />

        <TripMapSection
          location={location}
          status={status}
          locationError={locationError}
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
          onRetryLocation={startTracking}
        />

        <div
          className={`absolute inset-x-0 bottom-[168px] z-20 flex flex-col overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-slate-950/95 shadow-[0_-20px_60px_rgba(2,6,23,.8)] backdrop-blur-xl transition-[height] duration-300 ease-out ${drawerSnapHeight[drawerSnap]}`}
        >
          <DrawerViewHeader
            view={drawerView}
            onBack={returnToCurrent}
            onCollapse={collapseDrawer}
          />

          {drawerView === "current" && (
            <TripDiscoveries
              places={remainingDiscoveries}
              isLoading={placesLoading}
              error={placesError}
              onRefresh={refresh}
              onSelectPlace={(place) => {
                setSelectedDiscoveryId(place.id);
                collapseDrawer();
              }}
            />
          )}

          {drawerView === "on-the-way" && (
            <DrawerPlaceholderView
              icon={Route}
              eyebrow="Route-aware discoveries"
              title="Useful stops without wrecking the route"
              description="This view will compare nearby places against the active route and show the added detour time and distance for each result."
              secondaryAction={{
                label: "Plot trip",
                onClick: () => openDrawerView("plot-trip"),
              }}
              primaryAction={{
                label: "Preferences",
                onClick: () => openDrawerView("preferences"),
              }}
            />
          )}

          {drawerView === "whats-next" && (
            <DrawerPlaceholderView
              icon={Sparkles}
              eyebrow="Next recommendation"
              title="A wider search for the next part of the day"
              description="This view will search beyond the current route, consider what the traveler has already done, and suggest something that adds variety."
              secondaryAction={{
                label: "Plot trip",
                onClick: () => openDrawerView("plot-trip"),
              }}
              primaryAction={{
                label: "Preferences",
                onClick: () => openDrawerView("preferences"),
              }}
            />
          )}

          {drawerView === "plot-trip" && (
            <DrawerPlaceholderView
              icon={ListOrdered}
              eyebrow="Plan the shape of the day"
              title="Hike first, eat next, beach after"
              description="This view will let travelers order broad activities first, then choose or generate the actual places for each stop."
              primaryAction={{
                label: "Preferences",
                onClick: () => openDrawerView("preferences"),
              }}
              secondaryAction={{
                label: "Current stop",
                onClick: returnToCurrent,
              }}
            />
          )}

          {drawerView === "preferences" && (
            <DrawerPlaceholderView
              icon={SlidersHorizontal}
              eyebrow="Adjust the active trip"
              title="Change interests without starting over"
              description="This view will update travel mode, interests, search distance, pace, and other active-trip settings while preserving planned stops."
              primaryAction={{
                label: "Plot trip",
                onClick: () => openDrawerView("plot-trip"),
              }}
              secondaryAction={{
                label: "Current stop",
                onClick: returnToCurrent,
              }}
            />
          )}
        </div>

        <div className="relative z-30 shrink-0 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              if (placesExpanded) {
                collapseDrawer();
                return;
              }

              openDrawerView("current");
              setDrawerSnap("full");
            }}
            className="absolute left-1/2 top-0 flex h-7 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-900 text-white/70 shadow-lg transition hover:bg-slate-800 hover:text-white"
            aria-label={
              placesExpanded
                ? "Collapse nearby locations"
                : "Expand nearby locations"
            }
            aria-expanded={placesExpanded}
          >
            {placesExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>

          <div className="flex min-h-[104px] items-center gap-3 px-4 pb-3 pt-5">
            {placesLoading ? (
              <>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <RefreshCw className="h-5 w-5 animate-spin text-cyan-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/45">Nearby discoveries</p>
                  <p className="mt-1 font-semibold">Searching nearby…</p>
                </div>
              </>
            ) : selectedDiscovery ? (
              <>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                  <Footprints className="h-5 w-5" />
                </div>

                <button
                  type="button"
                  onClick={() => console.log("what to do here?", discoveries)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-xs font-medium text-cyan-300">
                    {selectedDiscovery.category}
                  </p>

                  <p className="mt-0.5 truncate font-semibold text-white">
                    {selectedDiscovery.name}
                  </p>

                  <p className="mt-0.5 text-xs text-white/50">
                    {selectedDiscovery.distance}
                    <span className="mx-1.5 text-white/20">•</span>
                    {selectedDiscovery.duration}
                  </p>
                </button>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-white/40">
                    {selectedDiscoveryId ? "Active" : "Nearest"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40">
                  <Footprints className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/45">Nearby discoveries</p>
                  <p className="mt-1 font-semibold">No locations found</p>
                </div>

                <button
                  type="button"
                  onClick={() => void refresh()}
                  className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white/70"
                >
                  Retry
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            <button
              type="button"
              onClick={() => openDrawerView("on-the-way")}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 text-sm font-semibold text-white/85 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
            >
              What&apos;s on the way?
            </button>

            <button
              type="button"
              onClick={() => openDrawerView("whats-next")}
              className="rounded-xl bg-cyan-300 px-3 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              What&apos;s next?
            </button>
          </div>
        </div>
      </div>

      {selectedPlace && (
        <SelectedPlaceModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </section>
  );
}
