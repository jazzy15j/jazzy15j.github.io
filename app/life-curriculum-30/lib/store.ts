"use client";

import { useCallback, useSyncExternalStore } from "react";

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
