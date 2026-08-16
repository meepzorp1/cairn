"use client";

import { useState } from "react";
import Link from "next/link";

//import NewLogo from "@/app/components/common/NewLogo";
import EarlyAccessModal from "@/app/components/modals/EarlyAccessModal";
import ModalWrapper from "@/app/components/modals/ModalWrapper";

export default function Header() {
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="relative mx-12 flex w-full max-w-7xl px-5 pt-8 sm:px-8">
          <div className="hidden items-center gap-8 md:flex">
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
    <nav className="flex items-center gap-7 text-sm font-medium text-white/65">
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
      className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-white/25 hover:bg-white/15 hover:text-white"
    >
      Early access
    </button>
  );
}