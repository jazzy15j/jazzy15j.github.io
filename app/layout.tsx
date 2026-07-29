import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jazzy15j.github.io"),
  title: "JDesigns Strategist — Useful systems, built from real life",
  description:
    "Explore Jasmine Stock's public projects and private case studies: practical AI systems, small-business tools, research labs, concert alerts, travel experiences, and JDesigns strategy work.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "JDesigns Strategist — Public Project Portfolio",
    description: "Useful systems, built from real life.",
    type: "website",
    images: ["/og.png"],
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
