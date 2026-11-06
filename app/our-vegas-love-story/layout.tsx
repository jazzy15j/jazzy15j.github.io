import type { Metadata, Viewport } from "next";
import "./styles.css";

const BASE = "/our-vegas-love-story";

export const metadata: Metadata = {
  title: "Our Vegas Love Story — Jasmine & Tristan",
  description:
    "A romantic Las Vegas anniversary adventure for Jasmine & Tristan, Nov 9–13, 2026: itinerary, live budget, maps, happy hours and a passport of stamps.",
  manifest: `${BASE}/manifest.webmanifest`,
  icons: {
    icon: `${BASE}/icon.svg`,
    apple: `${BASE}/apple-touch-icon.png`,
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Vegas Love" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Our Vegas Love Story",
    description: "Jasmine & Tristan's third-anniversary adventure in Las Vegas.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#5e1626",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Special+Elite&family=Yellowtail&display=swap"
        precedence="default"
      />
      {children}
    </>
  );
}
