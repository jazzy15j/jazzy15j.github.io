import type { Metadata, Viewport } from "next";
import "./styles.css";

const BASE = "/vegas-birthday-30";

export const metadata: Metadata = {
  title: "Thirty & Sparkling — Jasmine’s 30th in Las Vegas",
  description:
    "Jasmine’s 30th-birthday trip to Las Vegas, Dec 14–18, 2026: itinerary, live budget, maps, holiday lights and a passport of stamps.",
  manifest: `${BASE}/manifest.webmanifest`,
  icons: {
    icon: `${BASE}/icon.svg`,
    apple: `${BASE}/apple-touch-icon.png`,
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Thirty & Sparkling" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Thirty & Sparkling",
    description: "Jasmine’s 30th-birthday trip to Las Vegas, Dec 14–18, 2026.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#123d31",
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
