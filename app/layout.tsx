import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cairn — This Is Worth Exploring",
    template: "%s | Cairn",
  },
  description:
    "A location-aware exploration platform designed to help people discover what's worth experiencing around them and along the way.",
  openGraph: {
    title: "Cairn — This Is Worth Exploring",
    description: "Discover what's worth experiencing around you and along the way.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} ${geistMono.variable} h-full antialiased snap-y snap-proximity`}
    >
      <body className="relative min-h-dvh overflow-x-hidden bg-cairn-outer before:pointer-events-none before:fixed before:inset-0 before:bg-[url('/topography.svg')] before:bg-repeat before:opacity-[0.18] after:pointer-events-none after:fixed after:inset-0 after:bg-[radial-gradient(ellipse_at_top,rgba(210,162,76,0.08),transparent_52%)]">
        <main className="relative z-10 mx-auto min-h-dvh w-full max-w-107.5 overflow-x-hidden bg-cairn-bg lg:border-x lg:border-cairn-border lg:shadow-2xl">
          {children}
        </main>
      </body>
    </html>
  );
}
