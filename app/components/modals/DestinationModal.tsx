"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { MapPin } from "lucide-react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

import Modal from "./ModalWrapper";
import type { Destination } from "@/app/types/trip";

type DestinationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (destination: Destination) => void;
};

export default function DestinationModal({
  isOpen,
  onClose,
  onConfirm,
}: DestinationModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const placesLibrary = useMapsLibrary("places");

  const [destination, setDestination] =
    useState<Destination | null>(null);

  useEffect(() => {
    if (
      !isOpen ||
      !placesLibrary ||
      !inputRef.current
    ) {
      return;
    }

    const autocomplete =
      new placesLibrary.Autocomplete(
        inputRef.current,
        {
          fields: [
            "place_id",
            "name",
            "formatted_address",
            "geometry",
          ],
        },
      );

    const listener = autocomplete.addListener(
      "place_changed",
      () => {
        const place = autocomplete.getPlace();
        const location = place.geometry?.location;

        if (
          !place.place_id ||
          !place.name ||
          !location
        ) {
          setDestination(null);
          return;
        }

        setDestination({
          placeId: place.place_id,
          name: place.name,
          address:
            place.formatted_address ?? place.name,
          location: {
            latitude: location.lat(),
            longitude: location.lng(),
          },
        });
      },
    );

    return () => {
      listener.remove();
    };
  }, [
    isOpen,
    placesLibrary,
  ]);

  const handleConfirm = () => {
    if (!destination) {
      return;
    }

    onConfirm(destination);
    onClose();
  };

  const handleClose = () => {
    setDestination(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Where are you headed?"
      description="Search for a place or address."
      panelClassName="max-w-md"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="destination-search"
            className="mb-2 block text-sm font-medium text-sc-text"
          >
            Destination
          </label>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-sc-muted" />

            <input
              ref={inputRef}
              id="destination-search"
              type="text"
              placeholder="Search for a place or address"
              autoComplete="off"
              className="w-full rounded-xl border border-white/10 bg-sc-raised py-3 pl-11 pr-4 text-sm text-sc-text outline-none transition placeholder:text-sc-muted focus:border-sc-ocean/60 focus:ring-2 focus:ring-sc-ocean/20"
            />
          </div>
        </div>

        {destination && (
          <div className="rounded-xl border border-sc-ocean/30 bg-sc-ocean-soft p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sc-ocean text-sc-bg">
                <MapPin className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-sc-text">
                  {destination.name}
                </p>

                <p className="mt-1 text-sm leading-5 text-sc-muted">
                  {destination.address}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!destination}
          className="w-full rounded-xl bg-sc-sun px-4 py-3 font-semibold text-sc-bg transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}