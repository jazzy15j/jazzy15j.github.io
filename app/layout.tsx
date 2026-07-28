import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jasmine Builds — Useful systems, built from real life",
  description:
    "Explore Jasmine Stock's public projects: practical AI systems, small-business tools, concert alerts, travel experiences, and JDesigns strategy work.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Jasmine Builds",
    description: "Useful systems, built from real life.",
    type: "website",
    images: ["/social-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
