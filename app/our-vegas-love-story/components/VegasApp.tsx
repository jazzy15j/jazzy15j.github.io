"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DAYS, STAMP_BY_ID, STOP_BY_ID } from "../lib/data";
import { fmt } from "../lib/money";
import { StoreProvider, useStore } from "../lib/store";
import Budget from "./Budget";
import ExpenseSheet, { type SheetMode } from "./ExpenseSheet";
import Food from "./Food";
import { currentTripDay, useNow } from "./Info";
import MapView from "./MapView";
import Passport from "./Passport";
import Plan from "./Plan";
import Tools from "./Tools";
import credits from "../lib/credits.json";
import { Icon, InkFilter, Sparkle, StampArt, photoSrc } from "./ui";
import { UiContext, type AddOpts, type TabId } from "./uiCtx";
import { STAMPS } from "../lib/data";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "plan", label: "Plan", icon: "plan" },
  { id: "budget", label: "Budget", icon: "budget" },
  { id: "map", label: "Map", icon: "map" },
  { id: "eat", label: "Eat", icon: "eat" },
  { id: "stamps", label: "Stamps", icon: "stamp" },
  { id: "tools", label: "Tools", icon: "tools" },
];

function Celebration({ stampId, onClose }: { stampId: string; onClose: () => void }) {
  const def = STAMP_BY_ID[stampId];
  const idx = STAMPS.findIndex((s) => s.id === stampId);
  useEffect(() => {
    try {
      navigator.vibrate?.(25);
    } catch {
      /* not supported */
    }
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!def) return null;
  const bits = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = 110 + (i % 3) * 25;
    return { dx: Math.cos(a) * r, dy: Math.sin(a) * r, s: 10 + (i % 4) * 4 };
  });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center" role="alertdialog" aria-label={`${def.name} stamp collected`} onClick={onClose}>
      <div className="fade absolute inset-0 bg-night/70" />
      <div className="relative flex flex-col items-center text-center">
        <div className="relative">
          {bits.map((b, i) => (
            <Sparkle key={i} className="burst" size={b.s} style={{ ["--dx" as string]: `${b.dx}px`, ["--dy" as string]: `${b.dy}px`, animationDelay: `${i * 18}ms` }} />
          ))}
          <div className="rounded-full bg-paper p-3 shadow-2xl">
            <StampArt icon={def.icon} top={def.top} index={idx} size={190} animate date={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()} />
          </div>
        </div>
        <p className="font-script mt-5 text-5xl neon">Stamp collected!</p>
        <p className="font-display mt-1 text-lg font-extrabold text-[#fbeed2]">{def.name}</p>
      </div>
    </div>
  );
}

function Shell() {
  const { totals, saved, ready, toast, dismissToast } = useStore();
  const [tab, setTabState] = useState<TabId>("plan");
  const [day, setDay] = useState(0);
  const [sheet, setSheet] = useState<SheetMode>(null);
  const [stampId, setStampId] = useState<string | null>(null);
  const [focusStop, setFocusStop] = useState<string | null>(null);
  const now = useNow(60000);
  const initDay = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  // Open on today's itinerary during the trip, else Day 1. Restore last tab.
  useEffect(() => {
    if (initDay.current || now == null) return;
    initDay.current = true;
    const d = currentTripDay(now);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (d != null) setDay(d);
    try {
      const t = localStorage.getItem("ovls-tab") as TabId | null;
      if (t && TABS.some((x) => x.id === t)) setTabState(t);
    } catch {
      /* ignore */
    }
  }, [now]);

  // Register the service worker for offline/installable use, then quietly
  // warm the photo cache so pictures are there with weak signal.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost") return;
    navigator.serviceWorker
      .register("/our-vegas-love-story-sw.js", { scope: "/our-vegas-love-story" })
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        const warm = () => Object.keys(credits).forEach((id) => fetch(photoSrc(id)).catch(() => {}));
        if ("requestIdleCallback" in window) window.requestIdleCallback(warm);
        else setTimeout(warm, 4000);
      })
      .catch(() => {
        /* offline install is a bonus, never a requirement */
      });
  }, []);

  const setTab = useCallback((t: TabId) => {
    setTabState(t);
    try {
      localStorage.setItem("ovls-tab", t);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0 });
  }, []);

  const goToStop = useCallback(
    (id: string) => {
      const s = STOP_BY_ID[id];
      if (!s) return;
      setDay(s.day);
      setTab("plan");
      setFocusStop(null);
      setTimeout(() => setFocusStop(id), 60);
      setTimeout(() => setFocusStop(null), 2500);
    },
    [setTab],
  );

  const ctx = useMemo(
    () => ({
      tab,
      setTab,
      day,
      setDay,
      openAdd: (o: AddOpts = {}) => setSheet({ mode: "add", opts: o }),
      openEdit: (id: string) => setSheet({ mode: "edit", id }),
      goToStop,
      celebrate: (id: string) => setStampId(id),
      focusStop,
    }),
    [tab, setTab, day, goToStop, focusStop],
  );

  const closeSheet = useCallback(() => setSheet(null), []);
  const closeStamp = useCallback(() => setStampId(null), []);
  const left = totals.leftUnderLimit;

  return (
    <UiContext.Provider value={ctx}>
      <div className="ovls" style={{ ["--hdr" as string]: "calc(58px + env(safe-area-inset-top))" }}>
        <InkFilter />
        <header
          className="night sticky top-0 z-40 flex items-center justify-between gap-3 px-4 shadow-lg"
          style={{ paddingTop: "env(safe-area-inset-top)", minHeight: "var(--hdr)" }}
        >
          <button
            className="flex min-w-0 items-center gap-2 text-left"
            style={{ background: "transparent", border: 0, color: "inherit" }}
            onClick={() => setTab("plan")}
            aria-label="Our Vegas Love Story — go to plan"
          >
            <Sparkle size={16} className="shrink-0 text-gold-lt" />
            <span className="font-script truncate text-[24px] leading-none neon">Our Vegas Love Story</span>
          </button>
          <button
            className="flex shrink-0 flex-col items-end rounded-xl px-2 py-1"
            style={{ background: "rgba(255,255,255,0.1)", border: 0, color: "#ffe9b0", minHeight: 44 }}
            onClick={() => setTab("budget")}
            aria-label={`${fmt(left)} left of the trip budget. Open budget.`}
          >
            <span className="font-display num text-[17px] font-extrabold leading-none">{fmt(left)}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">left{ready ? (saved ? " ✓" : " …") : ""}</span>
          </button>
        </header>

        <main ref={mainRef} className="mx-auto w-full max-w-xl px-4 pb-6 pt-4">
          {tab === "plan" && <Plan />}
          {tab === "budget" && <Budget />}
          {tab === "map" && <MapView />}
          {tab === "eat" && <Food />}
          {tab === "stamps" && <Passport />}
          {tab === "tools" && <Tools />}
        </main>

        {/* Quick-add */}
        <button
          onClick={() => setSheet({ mode: "add", opts: {} })}
          aria-label="Quick-add an expense"
          className="fixed right-4 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full text-[#fdf1d6] shadow-2xl"
          style={{
            bottom: "calc(84px + env(safe-area-inset-bottom))",
            background: "linear-gradient(160deg,#9b2c45,#5e1626)",
            border: "2.5px solid #e8c97c",
            boxShadow: "0 10px 24px -8px rgba(94,22,38,.9), 0 0 0 4px rgba(232,201,124,.25)",
          }}
        >
          <Icon name="plus" size={30} stroke={2.4} />
        </button>

        {/* Toast */}
        {toast ? (
          <div
            key={toast.id}
            role="status"
            className="pop fixed left-1/2 z-[80] flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-2xl bg-espresso px-4 py-3 text-[14.5px] font-bold text-[#fdf1d6] shadow-2xl"
            style={{ bottom: "calc(158px + env(safe-area-inset-bottom))" }}
          >
            <span className="min-w-0 truncate">{toast.text}</span>
            <span className="flex shrink-0 items-center gap-2">
              {toast.undo ? (
                <button
                  className="rounded-full bg-gold-lt px-3 py-1.5 font-extrabold text-espresso"
                  style={{ border: 0, minHeight: 36 }}
                  onClick={() => {
                    toast.undo?.();
                    dismissToast();
                  }}
                >
                  Undo
                </button>
              ) : null}
              <button aria-label="Dismiss" onClick={dismissToast} style={{ background: "transparent", border: 0, color: "inherit", minHeight: 36, minWidth: 28 }}>
                <Icon name="x" size={16} />
              </button>
            </span>
          </div>
        ) : null}

        {/* Bottom nav */}
        <nav
          aria-label="Main"
          className="night fixed inset-x-0 bottom-0 z-40 border-t border-gold-lt/30"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ul className="mx-auto flex max-w-xl">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <li key={t.id} className="flex-1">
                  <button
                    onClick={() => setTab(t.id)}
                    aria-current={active ? "page" : undefined}
                    className="relative flex w-full flex-col items-center justify-center gap-0.5 py-2"
                    style={{ background: "transparent", border: 0, minHeight: 62, color: active ? "#ffe9b0" : "#d9c39a" }}
                  >
                    {active ? <span className="absolute inset-x-3 top-0 h-[3px] rounded-b-full bg-gold-lt" style={{ boxShadow: "0 0 8px #e8c97c" }} /> : null}
                    <Icon name={t.icon} size={23} stroke={active ? 2.1 : 1.7} />
                    <span className={`text-[11px] ${active ? "font-extrabold" : "font-bold"}`}>{t.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <ExpenseSheet sheet={sheet} onClose={closeSheet} />
        {stampId ? <Celebration stampId={stampId} onClose={closeStamp} /> : null}
      </div>
    </UiContext.Provider>
  );
}

export default function VegasApp() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

export { DAYS };
