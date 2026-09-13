"use client";

import { useState } from "react";
import EarlyAccessModal from "@/app/components/modals/EarlyAccessModal";
import ModalWrapper from "@/app/components/modals/ModalWrapper";

export default function Header() {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex w-full max-w-7xl justify-end px-5 pt-6 sm:px-8 sm:pt-8">
          <button
            type="button"
            onClick={() => setIsEarlyAccessOpen(true)}
            className="rounded-full border border-cairn-border bg-cairn-bg/35 px-4 py-2 text-sm font-semibold text-cairn-text/80 backdrop-blur-md transition hover:border-cairn-gold/50 hover:bg-cairn-bg/55 hover:text-cairn-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cairn-gold"
          >
            Early access
          </button>
        </div>
      </header>

      <ModalWrapper
        isOpen={isEarlyAccessOpen}
        onClose={() => setIsEarlyAccessOpen(false)}
      >
        <EarlyAccessModal
          isOpen={isEarlyAccessOpen}
          onClose={() => setIsEarlyAccessOpen(false)}
        />
      </ModalWrapper>
    </>
  );
}
