"use client";

type HeroProps = {
  children: React.ReactNode;
};

export default function Hero({ children }: HeroProps) {
  return (
    <section className="HERO relative flex min-h-dvh w-full flex-col overflow-hidden bg-sc-bg text-sc-text">
      <div
        className="absolute inset-0 bg-position-[570px_-21px] lg:bg-left"
        style={{
          backgroundImage: "url('/map.jpg')",
        }}
      />

      {/* Overall dark ocean tint */}
      <div className="absolute inset-0 bg-sc-bg/30" />

      {/* Bottom fade into the app background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-sc-bg/80 to-sc-bg" />

      {/* Desktop-side fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, transparent 47%, color-mix(in oklch, var(--sc-panel) 65%, transparent) 73%, var(--sc-bg) 97%)",
        }}
      />

      {/* Ocean glow */}
      <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-sc-ocean/15 blur-3xl" />

      {/* Featured-content glow */}
      <div className="absolute -left-24 bottom-24 h-64 w-64 rounded-full bg-sc-feature/20 blur-3xl" />

      {/* Warm Santa Cruz glow */}
      <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sc-sun/10 blur-3xl" />

      {/* Final contrast layer */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-sc-bg/10 via-sc-bg/35 to-sc-bg/85" />

      <div className="HEROCHILDREN relative z-10 flex min-h-dvh w-full flex-col border border-white justify-between px-2 py-24 sm:pt-40">
        {children}
      </div>
    </section>
  );
}