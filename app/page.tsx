"use client";

import { useRouter } from "next/navigation";
import Hero from "@/app/components/landing/Hero";
import HeroContent from "@/app/components/landing/HeroContent";
import ReadyButton from "@/app/components/landing/ReadyButton";
import Header from "@/app/components/landing/Header";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="PAGE h-dvh overflow-x-hidden overflow-y-auto scroll-smooth bg-background text-sc-elevated">
      <Header />

      <main>
        <Hero>
          <HeroContent />
          <ReadyButton onClick={() => router.push("/explore")} />
        </Hero>
      </main>
    </div>
  );
}
