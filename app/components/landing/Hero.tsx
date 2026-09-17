"use client";

type HeroProps = {
  children: React.ReactNode;
};

export default function Hero({ children }: HeroProps) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-cairn-bg text-cairn-text">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/hero/mosaic-bg.jpg')" }}
      />

      {/* Keep the mosaic present, but make the center readable and let it disappear into Cairn's dark UI. */}
      <div aria-hidden="true" className="absolute inset-0 bg-cairn-bg/30" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_31%,transparent_0%,rgba(10,15,12,0.10)_35%,rgba(10,15,12,0.78)_82%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-cairn-bg/10 via-cairn-bg/30 to-cairn-bg"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[44%] bg-linear-to-b from-transparent to-cairn-bg"
      />

      <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-end px-6 pb-12 pt-24 sm:pt-24">
        {children}
      </div>
    </section>
  );
}
