"use client";

import { createContext, useContext } from "react";
import type { CategoryId } from "../lib/types";

export type TabId = "plan" | "budget" | "map" | "eat" | "stamps" | "tools";

export interface AddOpts {
  stopId?: string | null;
  category?: CategoryId;
  label?: string;
}

export interface UiCtx {
  tab: TabId;
  setTab: (t: TabId) => void;
  day: number;
  setDay: (d: number) => void;
  openAdd: (o?: AddOpts) => void;
  openEdit: (extraId: string) => void;
  /** Jump to a stop card in the itinerary. */
  goToStop: (stopId: string) => void;
  celebrate: (stampId: string) => void;
  focusStop: string | null;
}

export const UiContext = createContext<UiCtx | null>(null);

export function useUi(): UiCtx {
  const c = useContext(UiContext);
  if (!c) throw new Error("useUi outside provider");
  return c;
}
