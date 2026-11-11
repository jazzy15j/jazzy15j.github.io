import type { AppState, Extra, StopState } from "./types";

/**
 * The trip's real spending, kept in sync by Claude at Jasmine's request.
 * Bump LEDGER_VERSION whenever this list changes: the app applies it once per
 * version to anyone's saved data, replacing only these entries (ids start with "led-")
 * and the stop actuals listed here. Anything else you add yourself is left alone.
 */
export const LEDGER_VERSION = 3;

// 488 = $450 in hand + $38 that turned up in the cash count and could not be matched to a purchase.
export const LEDGER_SETTINGS = { cashInHand: 488, atmPlanned: 350, atmDone: true };

const st = (actual: number, method: "cash" | "card", notes = ""): Partial<StopState> => ({ actual, method, notes });

export const LEDGER_STOPS: Record<string, Partial<StopState>> = {
  "mon-planet13": st(110, "cash", "Products we took back. Took an Uber instead of the shuttle."),
  "mon-hakkasan": st(64, "cash", "Bar, with tip."),
  "mon-taxi": st(33.12, "card", "Uber from the airport to the hotel."),
  "mon-instacart": st(43, "card", "Final total. Queso, salsa and summer sausage weren't delivered."),
  "tue-breakfast": st(33, "cash", "$28 + $5 tip."),
  "tue-liquor": st(46, "cash", "Beer."),
  "tue-alexxas": st(43, "cash", "Two drinks plus tip."),
  "tue-beauty": st(40, "card", "Food, with tip."),
  "tue-brewdog": st(0, "cash", "Skipped — went to Alexxa's instead."),
  "tue-cvs": st(24, "card", "Corona and salsa."),
};

const ex = (
  id: string,
  label: string,
  amount: number,
  method: "cash" | "card",
  category: Extra["category"],
  ts: string,
  note = "",
  stopId: string | null = null,
): Extra => ({ id: `led-${id}`, stopId, label, amount, method, category, ts, note });

export const LEDGER_EXTRAS: Extra[] = [
  ex("p13drink", "Drink to go", 12, "cash", "beerCannabis", "2026-11-10T01:00:00.000Z", "", "mon-planet13"),
  ex("stripdrinks", "First drinks on the Strip (with tip)", 35, "cash", "restaurants", "2026-11-10T02:00:00.000Z", "$32 + $3 tip"),
  ex("blondies", "Blondie's pizza and 2 drinks (with tip)", 69, "cash", "restaurants", "2026-11-10T03:00:00.000Z", "Under $70 with tip"),
  ex("dietcoke", "Diet Coke", 4, "card", "restaurants", "2026-11-10T03:30:00.000Z"),
  ex("chinese", "Chinese food (split)", 22, "card", "restaurants", "2026-11-10T04:30:00.000Z"),
  ex("subway", "Subway before leaving for the airport", 17, "card", "restaurants", "2026-11-09T19:00:00.000Z"),
  ex("gamble", "Gambling", 40, "cash", "cushion", "2026-11-10T04:00:00.000Z"),
  ex("uber1", "Uber to Planet 13", 18.94, "card", "backup", "2026-11-10T00:30:00.000Z", "", "mon-planet13"),
  ex("uber2", "Uber back from Planet 13", 17.94, "card", "backup", "2026-11-10T01:30:00.000Z", "", "mon-planet13"),
  ex("donation", "Street donation scam", 40, "cash", "cushion", "2026-11-10T20:00:00.000Z", "Lesson learned"),
  ex("evefood", "Burger, fries, beer, vodka drink, 2 coffees, quesadilla (with tip)", 50, "card", "restaurants", "2026-11-11T02:30:00.000Z"),
];

/** Ids from the earlier restore codes, so they aren't counted twice. */
const LEGACY_IDS = new Set([
  "ex-p13drink",
  "ex-stripdrinks",
  "ex-blondies",
  "ex-dietcoke",
  "ex-chinese",
  "ex-subway",
  "ex-gamble",
  "ex-uber1",
  "ex-uber2",
  "ex-monk",
  "ex-evefood",
]);

export function applyLedger(s: AppState): AppState {
  const stops = { ...s.stops };
  for (const [id, patch] of Object.entries(LEDGER_STOPS)) {
    if (id in stops) stops[id] = { ...stops[id], ...patch };
  }
  return {
    ...s,
    stops,
    extras: [...s.extras.filter((e) => !e.id.startsWith("led-") && !LEGACY_IDS.has(e.id)), ...LEDGER_EXTRAS],
    settings: { ...s.settings, ...LEDGER_SETTINGS },
    ledgerV: LEDGER_VERSION,
  };
}
