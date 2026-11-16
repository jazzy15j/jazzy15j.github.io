"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Tiny localStorage-backed store. Everything stays in this browser only.
const PREFIX = "lc30:v1:";
const listeners = new Set<() => void>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage can be blocked (private window); the page still works unsaved.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Persisted string value. Server render and first paint use `fallback`. */
export function useStored(key: string, fallback: string): [string, (v: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key) ?? fallback,
    () => fallback,
  );
  const set = useCallback((v: string) => write(key, v), [key]);
  return [value, set];
}

/** Persisted set of checked ids. */
export function useChecks(key: string): [Set<string>, (id: string) => void] {
  const [raw, setRaw] = useStored(key, "");
  const set = new Set(raw ? raw.split(",") : []);
  const toggle = (id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRaw([...next].join(","));
  };
  return [set, toggle];
}

/** Persisted JSON value. `fallback` must be a stable constant. */
export function useJson<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [raw, setRaw] = useStored(key, "");
  const value = useMemo(() => {
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
    // fallback is a stable constant by contract
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
  const set = useCallback((v: T) => setRaw(JSON.stringify(v)), [setRaw]);
  return [value, set];
}

export function exportAll(): string {
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = window.localStorage.getItem(k) ?? "";
    }
  } catch {
    // ignore
  }
  return JSON.stringify({ app: "life-curriculum-30", version: 1, exportedAt: new Date().toISOString(), data: out }, null, 2);
}

export function importAll(text: string): number {
  const parsed = JSON.parse(text);
  if (parsed?.app !== "life-curriculum-30" || typeof parsed.data !== "object") throw new Error("Not a curriculum backup");
  let n = 0;
  for (const [k, v] of Object.entries(parsed.data as Record<string, string>)) {
    try {
      window.localStorage.setItem(PREFIX + k, String(v));
      n++;
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
  return n;
}

export function resetAll() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

const noop = () => () => {};
/** Today's local date as YYYY-MM-DD; "" on the server and first paint. */
export function useToday(): string {
  return useSyncExternalStore(
    noop,
    () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    },
    () => "",
  );
}

/** Current location hash without the leading "#". */
export function useHash(): string {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("hashchange", cb);
      return () => window.removeEventListener("hashchange", cb);
    },
    () => window.location.hash.replace(/^#/, ""),
    () => "",
  );
}
