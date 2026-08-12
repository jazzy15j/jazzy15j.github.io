"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "../lib/store";
import TodayScreen from "./TodayScreen";
import ThisWeekScreen from "./ThisWeekScreen";
import ShopScreen from "./ShopScreen";
import KitchenScreen from "./KitchenScreen";
import RecipesScreen from "./RecipesScreen";
import ScoreScreen from "./ScoreScreen";
import PhotosScreen from "./PhotosScreen";
import { Sheet } from "./ui/Sheet";

type Screen = "today" | "week" | "shop" | "kitchen" | "recipes" | "score" | "photos";

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "☀️" },
  { id: "week", label: "This Week", icon: "🗓️" },
  { id: "shop", label: "Shop", icon: "🛒" },
  { id: "recipes", label: "Recipes", icon: "📖" },
  { id: "kitchen", label: "Kitchen", icon: "🧺" },
  { id: "photos", label: "Photos", icon: "📸" },
  { id: "score", label: "Score", icon: "🏆" },
];

export default function AppShell() {
  const [screen, setScreen] = useState<Screen>("today");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="egsl-root">
      <header className="egsl-topbar">
        <div className="egsl-row egsl-gap-12">
          <div className="egsl-brand">
            <span className="egsl-brand-mark">🍯</span>
            <span>Eat Good, Spend Less</span>
          </div>
        </div>
        <nav className="egsl-toptabs" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={screen === t.id ? "active" : ""}
              onClick={() => setScreen(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="egsl-topbar-actions">
          <Link className="egsl-home-link" href="/">
            ← Portfolio
          </Link>
          <button
            className="egsl-icon-btn"
            aria-label="Settings and backup"
            onClick={() => setSettingsOpen(true)}
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="egsl-shell">
        {screen === "today" && <TodayScreen onNavigate={(s) => setScreen(s)} />}
        {screen === "week" && <ThisWeekScreen />}
        {screen === "shop" && <ShopScreen />}
        {screen === "kitchen" && <KitchenScreen />}
        {screen === "recipes" && <RecipesScreen />}
        {screen === "photos" && <PhotosScreen />}
        {screen === "score" && <ScoreScreen />}
      </main>

      <nav className="egsl-nav" aria-label="Main navigation">
        <div className="egsl-nav-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`egsl-nav-btn ${screen === t.id ? "active" : ""}`}
              onClick={() => setScreen(t.id)}
            >
              <span className="egsl-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { state, exportBackup, importBackup, resetDemoData } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleExport = () => {
    const json = exportBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eat-good-spend-less-backup-${state.currentWeek.weekStartDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup downloaded.");
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = importBackup(String(reader.result));
      setMessage(result.ok ? "Backup restored." : result.error ?? "Import failed.");
    };
    reader.readAsText(file);
  };

  return (
    <Sheet title="Settings & backup" onClose={onClose}>
      <p className="egsl-muted" style={{ fontSize: 13, marginTop: 0 }}>
        Everything lives on this device. Export a backup before clearing browser data or switching
        devices, then import it wherever you open the app next.
      </p>

      <div className="egsl-row egsl-gap-10" style={{ marginBottom: 12 }}>
        <button className="egsl-btn egsl-btn-primary" onClick={handleExport}>
          ⬇️ Export backup
        </button>
        <button className="egsl-btn egsl-btn-secondary" onClick={() => fileRef.current?.click()}>
          ⬆️ Import backup
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {message && (
        <p style={{ fontSize: 13, color: "var(--egsl-sage-deep)", fontWeight: 700 }}>{message}</p>
      )}

      <hr style={{ border: "none", borderTop: "1px solid var(--egsl-line)", margin: "18px 0" }} />

      <p className="egsl-muted" style={{ fontSize: 13 }}>
        Reset everything back to the starter recipes, pantry, and week. This can&apos;t be undone
        unless you&apos;ve exported a backup first.
      </p>
      {!confirmingReset ? (
        <button className="egsl-btn egsl-btn-ghost" onClick={() => setConfirmingReset(true)}>
          Reset demo data
        </button>
      ) : (
        <div className="egsl-row egsl-gap-10">
          <button
            className="egsl-btn egsl-btn-primary"
            onClick={() => {
              resetDemoData();
              setConfirmingReset(false);
              setMessage("Reset to starter data.");
            }}
          >
            Yes, reset everything
          </button>
          <button className="egsl-btn egsl-btn-ghost" onClick={() => setConfirmingReset(false)}>
            Cancel
          </button>
        </div>
      )}
    </Sheet>
  );
}

export type { Screen };
