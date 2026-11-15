import type { Metadata, Viewport } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "My Life Curriculum — Age 30",
  description: "A private, seasonal curriculum for Dec 2026 – Dec 2027.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f3ecdf",
  width: "device-width",
  initialScale: 1,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=Nunito+Sans:wght@400;600;700&display=swap"
        precedence="default"
      />
      {children}
    </>
  );
}
