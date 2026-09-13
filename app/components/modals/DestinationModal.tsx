"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import Modal from "./ModalWrapper";
import PlaceAutocompleteInput, {
  type PlaceSelection,
} from "./PlaceAutocompleteInput";
import type { Destination } from "@/app/trip/types";

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
  const [destination, setDestination] =
    useState<Destination | null>(null);

  const handleSelect = (place: PlaceSelection) => {
    setDestination({
      placeId: place.placeId,
      name: place.name,
      address: place.address,
      location: place.location,
    });
  };

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
            className="mb-2 block text-sm font-medium text-cairn-text"
          >
            Destination
          </label>

          <PlaceAutocompleteInput
            id="destination-search"
            placeholder="Search for a place or address"
            onSelect={handleSelect}
          />
        </div>

        {destination && (
          <div className="rounded-xl border border-cairn-gold/30 bg-cairn-gold-soft p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cairn-gold text-cairn-bg">
                <MapPin className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-cairn-text">
                  {destination.name}
                </p>

                <p className="mt-1 text-sm leading-5 text-cairn-muted">
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
          className="w-full rounded-xl bg-cairn-gold px-4 py-3 font-semibold text-cairn-bg transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}