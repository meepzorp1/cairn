import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Caire — This Is Worth Exploring",
    template: "%s | Cairn",
  },
  description: "A location-aware exploration platform designed to help people discover what's worth experiencing around them and along the way.",
  openGraph: {
    title: "Cairn — This Is Worth Exploring",
    description:
      "Discover what's worth experiencing around you and along the way.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased snap-y snap-proximity`}
    >
      <body className="bg-sc-bg">
  <main
    className="
      mx-auto
      min-h-dvh
      w-full
      max-w-107.5
      overflow-x-hidden
      bg-sc-panel
      lg:border-x
      lg:border-sc-line
      lg:shadow-2xl
    "
  >
    {children}
  </main>
</body>
    </html>
  );
}
