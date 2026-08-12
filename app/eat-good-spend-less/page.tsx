"use client";

import { useEffect } from "react";
import { EGSLProvider } from "./lib/store";
import AppShell from "./components/AppShell";

export default function EatGoodSpendLessPage() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/eat-good-spend-less/sw.js", { scope: "/eat-good-spend-less/" })
        .catch(() => {
          // Offline install is a bonus, not a requirement — fail quietly.
        });
    }
  }, []);

  return (
    <EGSLProvider>
      <AppShell />
    </EGSLProvider>
  );
}
