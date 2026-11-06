import { CATEGORIES, STOPS } from "./data";
import type { AppState, CategoryId, Method } from "./types";

export const fmt = (n: number, cents = false): string => {
  const neg = n < 0;
  const abs = Math.abs(n);
  const s = cents || Math.abs(abs - Math.round(abs)) > 0.004
    ? abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return `${neg ? "−" : ""}$${s}`;
};

/** Round to cents to avoid float drift in running totals. */
export const r2 = (n: number): number => Math.round(n * 100) / 100;

export interface CatSummary {
  id: CategoryId;
  alloc: number;
  est: number;
  spent: number;
  projected: number;
  left: number;
  over: number;
}

export interface Totals {
  limit: number;
  spent: number;
  cashSpent: number;
  cardSpent: number;
  estimateTotal: number;
  projected: number;
  leftUnderLimit: number;
  projectedUnused: number;
  startCash: number;
  cashRemaining: number;
  cashStillPlanned: number;
  cashAfterPlan: number;
  cardPlanned: number;
  cushionLeft: number;
  overages: number;
  byCat: Record<CategoryId, CatSummary>;
  methodSplit: Record<Method, number>;
  /** Per-stop spent (actual + attached extras). */
  stopSpent: Record<string, number>;
  unlinkedSpent: number;
  entries: number;
}

export function computeTotals(state: AppState): Totals {
  const { settings } = state;
  const byCat = Object.fromEntries(
    CATEGORIES.map((c) => [
      c.id,
      { id: c.id, alloc: settings.alloc[c.id] ?? 0, est: 0, spent: 0, projected: 0, left: 0, over: 0 } as CatSummary,
    ]),
  ) as Record<CategoryId, CatSummary>;

  let cashSpent = 0;
  let cardSpent = 0;
  let cashStillPlanned = 0;
  let cardPlanned = 0;
  let estimateTotal = 0;
  let entries = 0;
  const stopSpent: Record<string, number> = {};

  for (const stop of STOPS) {
    const st = state.stops[stop.id];
    stopSpent[stop.id] = 0;
    if (!stop.category) {
      // Free stops can still hold a real actual if the user typed one in.
      if (st?.actual != null && st.actual > 0) {
        const cat = byCat.cushion;
        cat.spent += st.actual;
        cat.projected += st.actual;
        stopSpent[stop.id] += st.actual;
        if (st.method === "cash") cashSpent += st.actual;
        else cardSpent += st.actual;
        entries += 1;
      }
      continue;
    }
    const cat = byCat[stop.category];
    cat.est += stop.est;
    estimateTotal += stop.est;
    const method = st?.method ?? stop.method;
    if (st && st.actual != null) {
      cat.spent += st.actual;
      cat.projected += st.actual;
      stopSpent[stop.id] += st.actual;
      entries += 1;
      if (method === "cash") cashSpent += st.actual;
      else cardSpent += st.actual;
    } else {
      cat.projected += stop.est;
      if (method === "cash") cashStillPlanned += stop.est;
      else cardPlanned += stop.est;
    }
  }

  let unlinkedSpent = 0;
  for (const ex of state.extras) {
    const cat = byCat[ex.category] ?? byCat.cushion;
    cat.spent += ex.amount;
    cat.projected += ex.amount;
    entries += 1;
    if (ex.method === "cash") cashSpent += ex.amount;
    else cardSpent += ex.amount;
    if (ex.stopId && ex.stopId in stopSpent) stopSpent[ex.stopId] += ex.amount;
    else unlinkedSpent += ex.amount;
  }

  let spent = 0;
  let projected = 0;
  let overages = 0;
  for (const cat of Object.values(byCat)) {
    cat.spent = r2(cat.spent);
    cat.projected = r2(cat.projected);
    cat.left = r2(cat.alloc - cat.spent);
    cat.over = cat.id === "cushion" ? 0 : Math.max(0, r2(cat.spent - cat.alloc));
    spent += cat.spent;
    projected += cat.projected;
    overages += cat.over;
  }
  spent = r2(spent);
  projected = r2(projected);

  const startCash = settings.cashInHand + settings.atmPlanned;
  const cushion = byCat.cushion;
  const cushionLeft = r2(cushion.alloc - cushion.spent - overages);

  return {
    limit: settings.limit,
    spent,
    cashSpent: r2(cashSpent),
    cardSpent: r2(cardSpent),
    estimateTotal: r2(estimateTotal),
    projected,
    leftUnderLimit: r2(settings.limit - spent),
    projectedUnused: r2(settings.limit - projected),
    startCash,
    cashRemaining: r2(startCash - cashSpent),
    cashStillPlanned: r2(cashStillPlanned),
    cashAfterPlan: r2(startCash - cashSpent - cashStillPlanned),
    cardPlanned: r2(cardPlanned),
    cushionLeft,
    overages: r2(overages),
    byCat,
    methodSplit: { cash: r2(cashSpent), card: r2(cardSpent) },
    stopSpent,
    unlinkedSpent: r2(unlinkedSpent),
    entries,
  };
}
