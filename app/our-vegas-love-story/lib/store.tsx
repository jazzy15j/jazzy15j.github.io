"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_GROCERIES, DEFAULT_PACKING, DEFAULT_SETTINGS, STOPS } from "./data";
import { computeTotals, type Totals } from "./money";
import type { AppState, Extra, FoodLog, GroceryItem, Method, PackItem, Settings, StopState } from "./types";

const STORAGE_KEY = "ovls-state-v1";

export const uid = (p = "x"): string => `${p}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

function freshState(): AppState {
  const stops: Record<string, StopState> = {};
  for (const s of STOPS) stops[s.id] = { actual: null, method: s.method, notes: "", done: false };
  return {
    v: 1,
    stops,
    extras: [],
    settings: structuredClone(DEFAULT_SETTINGS),
    food: {},
    packing: structuredClone(DEFAULT_PACKING),
    groceries: DEFAULT_GROCERIES.map((g, i) => ({ id: `g-${i}`, name: g.name, qty: g.qty, price: null, inRoom: false })),
    confirmed: {},
    notes: "",
    dayNotes: {},
  };
}

/** Merge saved data over fresh defaults so new fields/stops never break old saves. */
function hydrate(raw: unknown): AppState {
  const base = freshState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<AppState>;
  const stops = { ...base.stops };
  for (const [id, st] of Object.entries(r.stops ?? {})) if (id in stops) stops[id] = { ...stops[id], ...st };
  return {
    ...base,
    ...r,
    v: 1,
    stops,
    extras: Array.isArray(r.extras) ? r.extras : [],
    settings: {
      ...base.settings,
      ...r.settings,
      alloc: { ...base.settings.alloc, ...(r.settings?.alloc ?? {}) },
      deposit: { ...base.settings.deposit, ...(r.settings?.deposit ?? {}) },
    },
    food: r.food ?? {},
    packing: Array.isArray(r.packing) ? r.packing : base.packing,
    groceries: Array.isArray(r.groceries) ? r.groceries : base.groceries,
    confirmed: r.confirmed ?? {},
    notes: r.notes ?? "",
    dayNotes: r.dayNotes ?? {},
  };
}

export interface Toast {
  id: number;
  text: string;
  undo?: () => void;
}

interface Ctx {
  state: AppState;
  totals: Totals;
  ready: boolean;
  saved: boolean;
  toast: Toast | null;
  dismissToast: () => void;
  pushToast: (text: string, undo?: () => void) => void;
  patchStop: (id: string, patch: Partial<StopState>) => void;
  toggleDone: (id: string) => boolean;
  addExtra: (e: Omit<Extra, "id" | "ts">) => void;
  updateExtra: (id: string, patch: Partial<Extra>) => void;
  deleteExtra: (id: string) => void;
  setSettings: (fn: (s: Settings) => Settings) => void;
  patchFood: (id: string, fn: (f: FoodLog) => FoodLog) => void;
  setPacking: (fn: (p: PackItem[]) => PackItem[]) => void;
  setGroceries: (fn: (g: GroceryItem[]) => GroceryItem[]) => void;
  setConfirmed: (id: string, patch: Partial<{ done: boolean; note: string }>) => void;
  setNotes: (v: string) => void;
  setDayNote: (day: number, v: string) => void;
  exportJson: () => string;
  importJson: (txt: string) => boolean;
  resetAll: () => void;
  flash: string | null;
  clearFlash: () => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function useStore(): Ctx {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(freshState);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toast, setToast] = useState<Toast | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load once on the client.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Hydration-safe: browser storage is only readable after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(hydrate(JSON.parse(raw)));
    } catch {
      /* private mode or corrupt data: start fresh */
    }
    setReady(true);
  }, []);

  // Auto-save (debounced) after every change.
  useEffect(() => {
    if (!ready) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage full/blocked */
      }
      setSaved(true);
    }, 250);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, ready]);

  // Flush on page hide so nothing is lost when the app is swiped away.
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
      } catch {
        /* ignore */
      }
    };
    const onVis = () => document.visibilityState === "hidden" && flush();
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const pushToast = useCallback((text: string, undo?: () => void) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text, undo });
    toastTimer.current = setTimeout(() => setToast(null), undo ? 6000 : 2600);
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const patchStop = useCallback((id: string, patch: Partial<StopState>) => {
    setState((s) => ({ ...s, stops: { ...s.stops, [id]: { ...s.stops[id], ...patch } } }));
  }, []);

  const toggleDone = useCallback((id: string): boolean => {
    const cur = stateRef.current.stops[id];
    const next = !cur.done;
    setState((s) => ({
      ...s,
      stops: { ...s.stops, [id]: { ...s.stops[id], done: next, doneAt: next ? new Date().toISOString() : undefined } },
    }));
    return next;
  }, []);

  const addExtra = useCallback((e: Omit<Extra, "id" | "ts">) => {
    setState((s) => ({ ...s, extras: [...s.extras, { ...e, id: uid("ex"), ts: new Date().toISOString() }] }));
  }, []);
  const updateExtra = useCallback((id: string, patch: Partial<Extra>) => {
    setState((s) => ({ ...s, extras: s.extras.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
  }, []);
  const deleteExtra = useCallback(
    (id: string) => {
      const gone = stateRef.current.extras.find((x) => x.id === id);
      setState((s) => ({ ...s, extras: s.extras.filter((x) => x.id !== id) }));
      if (gone) {
        pushToast(`Deleted “${gone.label}”`, () => setState((s) => ({ ...s, extras: [...s.extras, gone] })));
      }
    },
    [pushToast],
  );

  const setSettings = useCallback((fn: (s: Settings) => Settings) => setState((s) => ({ ...s, settings: fn(s.settings) })), []);
  const patchFood = useCallback(
    (id: string, fn: (f: FoodLog) => FoodLog) =>
      setState((s) => ({
        ...s,
        food: { ...s.food, [id]: fn(s.food[id] ?? { confirmedHours: "", notes: "", orders: [] }) },
      })),
    [],
  );
  const setPacking = useCallback((fn: (p: PackItem[]) => PackItem[]) => setState((s) => ({ ...s, packing: fn(s.packing) })), []);
  const setGroceries = useCallback((fn: (g: GroceryItem[]) => GroceryItem[]) => setState((s) => ({ ...s, groceries: fn(s.groceries) })), []);
  const setConfirmed = useCallback(
    (id: string, patch: Partial<{ done: boolean; note: string }>) =>
      setState((s) => ({ ...s, confirmed: { ...s.confirmed, [id]: { ...(s.confirmed[id] ?? { done: false, note: "" }), ...patch } } })),
    [],
  );
  const setNotes = useCallback((v: string) => setState((s) => ({ ...s, notes: v })), []);
  const setDayNote = useCallback((day: number, v: string) => setState((s) => ({ ...s, dayNotes: { ...s.dayNotes, [day]: v } })), []);

  const exportJson = useCallback(() => JSON.stringify(stateRef.current, null, 2), []);
  const importJson = useCallback((txt: string): boolean => {
    try {
      const parsed = JSON.parse(txt);
      if (!parsed || typeof parsed !== "object" || parsed.v !== 1) return false;
      setState(hydrate(parsed));
      return true;
    } catch {
      return false;
    }
  }, []);
  const resetAll = useCallback(() => {
    setState(freshState());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const totals = useMemo(() => computeTotals(state), [state]);

  const value: Ctx = {
    state,
    totals,
    ready,
    saved,
    toast,
    dismissToast,
    pushToast,
    patchStop,
    toggleDone,
    addExtra,
    updateExtra,
    deleteExtra,
    setSettings,
    patchFood,
    setPacking,
    setGroceries,
    setConfirmed,
    setNotes,
    setDayNote,
    exportJson,
    importJson,
    resetAll,
    flash,
    clearFlash: () => setFlash(null),
  };
  // Expose a flash setter via window event to keep the API small.
  useEffect(() => {
    const h = (e: Event) => setFlash((e as CustomEvent<string>).detail);
    window.addEventListener("ovls-flash", h);
    return () => window.removeEventListener("ovls-flash", h);
  }, []);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export type { Method };
