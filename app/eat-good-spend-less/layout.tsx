import type { Metadata, Viewport } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Eat Good, Spend Less — Household Meal Planner",
  description:
    "A calm, install-able household command center for two: what's for dinner, what needs used first, and what to buy — decided automatically, every day.",
  manifest: "/eat-good-spend-less/manifest.webmanifest",
  icons: {
    icon: "/eat-good-spend-less/icon.svg",
    apple: "/eat-good-spend-less/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Eat Good",
  },
  openGraph: {
    title: "Eat Good, Spend Less",
    description: "Grocery shopping, dinner decisions, and leftovers — handled automatically.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#bd5a2c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function EatGoodSpendLessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
