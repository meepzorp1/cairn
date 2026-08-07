"use client";

import { useState } from "react";
import Link from "next/link";

import NewLogo from "@/app/components/common/NewLogo";
import EarlyAccessModal from "@/app/components/modals/EarlyAccessModal";
import ModalWrapper from "@/app/components/modals/ModalWrapper";

export default function Header() {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        {/* Glass background */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

        {/* Soft blend into the hero */}
        <div className="pointer-events-none absolute inset-x-0 top-full h-14 bg-linear-to-b from-black/25 via-black/10 to-transparent backdrop-blur-[1px]" />

        <div className="relative mx-auto mt-8 flex h-24 max-w-7xl items-end justify-between px-5 pb-4 sm:h-28 sm:px-8 sm:pb-5">
          <NewLogo />

<div className="hidden md:flex">
          <NavBar />

          <JoinButton
            onClick={() => setIsEarlyAccessOpen(true)}
          />
          </div>
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

function NavBar() {
  return (
    <nav className="hidden items-center gap-7 text-sm font-medium text-white/65 md:flex">
      <Link
        href="#discover"
        className="transition-colors hover:text-white"
      >
        Discover
      </Link>

      <Link
        href="#student"
        className="transition-colors hover:text-white"
      >
        Student Mode
      </Link>

      <Link
        href="#challenges"
        className="transition-colors hover:text-white"
      >
        Challenges
      </Link>
    </nav>
  );
}

type JoinButtonProps = {
  onClick: () => void;
};

function JoinButton({ onClick }: JoinButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-white/25 hover:bg-white/15 hover:text-white"
    >
      Early access
    </button>
  );
}