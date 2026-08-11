"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildSeedInventory, buildSeedRecipes } from "./seedData";
import { buildWeekRotation, computeMealTags, getUseFirstList } from "./engine";
import { mondayOf, todayISO } from "./dates";
import {
  DEFAULT_WEEKLY_BUDGET,
  type AppState,
  type DayPlan,
  type InventoryItem,
  type LeftoverAmount,
  type Recipe,
  type StockState,
} from "./types";

const STORAGE_KEY = "egsl:v1";
const MAX_WEEK_HISTORY = 10;

function buildFreshState(): AppState {
  const today = todayISO();
  const weekStart = mondayOf(today);
  const recipes = buildSeedRecipes();
  const inventory = buildSeedInventory();
  const currentWeek = buildWeekRotation(recipes, inventory, [], weekStart, DEFAULT_WEEKLY_BUDGET);
  return {
    version: 1,
    settings: { budgetTarget: DEFAULT_WEEKLY_BUDGET, people: ["Jazzy", "Tristan"] },
    inventory,
    recipes,
    currentWeek,
    weekHistory: [],
  };
}

/** Carries a stored state forward if the real calendar has moved past it. */
function rollForward(state: AppState): AppState {
  const today = todayISO();
  const days = state.currentWeek.days;
  const lastDay = days[days.length - 1];
  if (!lastDay || today <= lastDay.date) return state;

  const newWeekStart = mondayOf(today);
  const history = [...state.weekHistory, state.currentWeek].slice(-MAX_WEEK_HISTORY);
  const newWeek = buildWeekRotation(
    state.recipes,
    state.inventory,
    history,
    newWeekStart,
    state.settings.budgetTarget,
  );
  return { ...state, currentWeek: newWeek, weekHistory: history };
}

function loadInitialState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return rollForward(buildFreshState());
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || typeof parsed !== "object" || !parsed.currentWeek) {
      return rollForward(buildFreshState());
    }
    return rollForward(parsed);
  } catch {
    return rollForward(buildFreshState());
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface StoreValue {
  state: AppState;
  setInventoryState: (id: string, next: StockState) => void;
  updateInventoryItem: (id: string, partial: Partial<InventoryItem>) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
  removeInventoryItem: (id: string) => void;
  setDayAteSomethingElse: (dayId: string, value: boolean) => void;
  swapDayRecipe: (dayId: string, newRecipeId: string) => void;
  markLeftovers: (dayId: string, amount: LeftoverAmount, plan?: string) => void;
  markCooked: (dayId: string) => void;
  reorderWeek: (fromIndex: number, toIndex: number) => void;
  rateRecipe: (
    recipeId: string,
    jazzy: number | null,
    tristan: number | null,
    verdict: "keep" | "modify" | "retire" | null,
    note?: string,
  ) => void;
  addRecipeNote: (recipeId: string, note: string) => void;
  toggleFavorite: (recipeId: string) => void;
  setRetired: (recipeId: string, retired: boolean) => void;
  setGroceryFlag: (key: string, kind: "have" | "skip" | "checked", value: boolean) => void;
  runWeeklyReset: (
    inventoryUpdates: { id: string; state: StockState }[],
    extraUseFirst: string[],
  ) => void;
  exportBackup: () => string;
  importBackup: (json: string) => { ok: boolean; error?: string };
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function EGSLProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    // localStorage only exists client-side, so hydrating real state has to
    // happen post-mount — this one-time read from an external system is
    // exactly what an effect is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadInitialState());
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable — fail silently, app keeps working in-memory.
    }
  }, [state]);

  const recomputeDayTags = useCallback(
    (day: DayPlan, recipes: Recipe[], inventory: InventoryItem[]): DayPlan => {
      const recipe = recipes.find((r) => r.id === day.recipeId);
      if (!recipe) return day;
      const useFirstNames = new Set(getUseFirstList(inventory).map((e) => e.item.name.toLowerCase()));
      return { ...day, tags: computeMealTags(recipe, day.archetype, inventory, useFirstNames) };
    },
    [],
  );

  const setInventoryState = useCallback((id: string, next: StockState) => {
    setState((s) => {
      if (!s) return s;
      const inventory = s.inventory.map((i) => (i.id === id ? { ...i, state: next } : i));
      const days = s.currentWeek.days.map((d) => recomputeDayTags(d, s.recipes, inventory));
      return { ...s, inventory, currentWeek: { ...s.currentWeek, days } };
    });
  }, [recomputeDayTags]);

  const updateInventoryItem = useCallback((id: string, partial: Partial<InventoryItem>) => {
    setState((s) => {
      if (!s) return s;
      const inventory = s.inventory.map((i) => (i.id === id ? { ...i, ...partial } : i));
      return { ...s, inventory };
    });
  }, []);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, "id">) => {
    setState((s) => {
      if (!s) return s;
      const id = `inv-${Date.now()}-${Math.round(Math.random() * 9999)}`;
      return { ...s, inventory: [...s.inventory, { id, ...item }] };
    });
  }, []);

  const removeInventoryItem = useCallback((id: string) => {
    setState((s) => (s ? { ...s, inventory: s.inventory.filter((i) => i.id !== id) } : s));
  }, []);

  const setDayAteSomethingElse = useCallback((dayId: string, value: boolean) => {
    setState((s) => {
      if (!s) return s;
      const days = s.currentWeek.days.map((d) =>
        d.id === dayId ? { ...d, ateSomethingElse: value } : d,
      );
      return { ...s, currentWeek: { ...s.currentWeek, days } };
    });
  }, []);

  const swapDayRecipe = useCallback(
    (dayId: string, newRecipeId: string) => {
      setState((s) => {
        if (!s) return s;
        const days = s.currentWeek.days.map((d) => {
          if (d.id !== dayId) return d;
          const swapped: DayPlan = {
            ...d,
            swappedFromRecipeId: d.recipeId,
            recipeId: newRecipeId,
            ateSomethingElse: false,
          };
          return recomputeDayTags(swapped, s.recipes, s.inventory);
        });
        return { ...s, currentWeek: { ...s.currentWeek, days } };
      });
    },
    [recomputeDayTags],
  );

  const markLeftovers = useCallback((dayId: string, amount: LeftoverAmount, plan?: string) => {
    setState((s) => {
      if (!s) return s;
      const days = s.currentWeek.days.map((d) =>
        d.id === dayId ? { ...d, leftovers: amount, leftoverPlan: plan } : d,
      );
      return { ...s, currentWeek: { ...s.currentWeek, days } };
    });
  }, []);

  const markCooked = useCallback((dayId: string) => {
    setState((s) => {
      if (!s) return s;
      const days = s.currentWeek.days.map((d) => (d.id === dayId ? { ...d, cooked: true } : d));
      return { ...s, currentWeek: { ...s.currentWeek, days } };
    });
  }, []);

  const reorderWeek = useCallback(
    (fromIndex: number, toIndex: number) => {
      setState((s) => {
        if (!s) return s;
        if (fromIndex === toIndex) return s;
        const days = [...s.currentWeek.days];
        const [a, b] = [days[fromIndex], days[toIndex]];
        if (!a || !b) return s;
        // Swap recipe assignments (and their derived fields), keeping the
        // calendar date/label fixed on each slot.
        const newA: DayPlan = recomputeDayTags(
          { ...a, recipeId: b.recipeId, tags: [], leftovers: undefined, leftoverPlan: undefined, cooked: false, ateSomethingElse: false, swappedFromRecipeId: undefined },
          s.recipes,
          s.inventory,
        );
        const newB: DayPlan = recomputeDayTags(
          { ...b, recipeId: a.recipeId, tags: [], leftovers: undefined, leftoverPlan: undefined, cooked: false, ateSomethingElse: false, swappedFromRecipeId: undefined },
          s.recipes,
          s.inventory,
        );
        days[fromIndex] = newA;
        days[toIndex] = newB;
        return { ...s, currentWeek: { ...s.currentWeek, days } };
      });
    },
    [recomputeDayTags],
  );

  const rateRecipe = useCallback(
    (
      recipeId: string,
      jazzy: number | null,
      tristan: number | null,
      verdict: "keep" | "modify" | "retire" | null,
      note?: string,
    ) => {
      setState((s) => {
        if (!s) return s;
        const recipes = s.recipes.map((r) => {
          if (r.id !== recipeId) return r;
          const entry = {
            id: `${recipeId}-${Date.now()}`,
            date: todayISO(),
            jazzy,
            tristan,
            verdict,
            note,
          };
          return {
            ...r,
            ratings: [...r.ratings, entry],
            retired: verdict === "retire" ? true : r.retired,
          };
        });
        return { ...s, recipes };
      });
    },
    [],
  );

  const addRecipeNote = useCallback((recipeId: string, note: string) => {
    setState((s) => {
      if (!s) return s;
      const recipes = s.recipes.map((r) =>
        r.id === recipeId ? { ...r, notes: [...r.notes, note] } : r,
      );
      return { ...s, recipes };
    });
  }, []);

  const toggleFavorite = useCallback((recipeId: string) => {
    setState((s) => {
      if (!s) return s;
      const recipes = s.recipes.map((r) =>
        r.id === recipeId ? { ...r, manuallyFavorited: !r.manuallyFavorited } : r,
      );
      return { ...s, recipes };
    });
  }, []);

  const setRetired = useCallback((recipeId: string, retired: boolean) => {
    setState((s) => {
      if (!s) return s;
      const recipes = s.recipes.map((r) => (r.id === recipeId ? { ...r, retired } : r));
      return { ...s, recipes };
    });
  }, []);

  const setGroceryFlag = useCallback(
    (key: string, kind: "have" | "skip" | "checked", value: boolean) => {
      setState((s) => {
        if (!s) return s;
        const field = kind === "have" ? "groceryHave" : kind === "skip" ? "grocerySkip" : "groceryChecked";
        const next = { ...s.currentWeek[field], [key]: value };
        return { ...s, currentWeek: { ...s.currentWeek, [field]: next } };
      });
    },
    [],
  );

  const runWeeklyReset = useCallback(
    (inventoryUpdates: { id: string; state: StockState }[], extraUseFirst: string[]) => {
      setState((s) => {
        if (!s) return s;
        let inventory = s.inventory.map((i) => {
          const update = inventoryUpdates.find((u) => u.id === i.id);
          return update ? { ...i, state: update.state } : i;
        });
        for (const name of extraUseFirst) {
          if (!name.trim()) continue;
          inventory = [
            ...inventory,
            {
              id: `inv-${Date.now()}-${Math.round(Math.random() * 9999)}`,
              name: name.trim(),
              category: "other" as const,
              state: "some" as const,
              notes: "Flagged during weekly reset",
            },
          ];
        }
        const newWeekStart = mondayOf(todayISO());
        const history = [...s.weekHistory, s.currentWeek].slice(-MAX_WEEK_HISTORY);
        const currentWeek = buildWeekRotation(
          s.recipes,
          inventory,
          history,
          newWeekStart,
          s.settings.budgetTarget,
        );
        return { ...s, inventory, currentWeek, weekHistory: history };
      });
    },
    [],
  );

  const exportBackup = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importBackup = useCallback((json: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(json) as AppState;
      if (!parsed || !parsed.currentWeek || !parsed.recipes || !parsed.inventory) {
        return { ok: false, error: "That file doesn't look like an Eat Good, Spend Less backup." };
      }
      setState(rollForward(parsed));
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't read that file." };
    }
  }, []);

  const resetDemoData = useCallback(() => {
    setState(rollForward(buildFreshState()));
  }, []);

  const value = useMemo<StoreValue | null>(() => {
    if (!state) return null;
    return {
      state,
      setInventoryState,
      updateInventoryItem,
      addInventoryItem,
      removeInventoryItem,
      setDayAteSomethingElse,
      swapDayRecipe,
      markLeftovers,
      markCooked,
      reorderWeek,
      rateRecipe,
      addRecipeNote,
      toggleFavorite,
      setRetired,
      setGroceryFlag,
      runWeeklyReset,
      exportBackup,
      importBackup,
      resetDemoData,
    };
  }, [
    state,
    setInventoryState,
    updateInventoryItem,
    addInventoryItem,
    removeInventoryItem,
    setDayAteSomethingElse,
    swapDayRecipe,
    markLeftovers,
    markCooked,
    reorderWeek,
    rateRecipe,
    addRecipeNote,
    toggleFavorite,
    setRetired,
    setGroceryFlag,
    runWeeklyReset,
    exportBackup,
    importBackup,
    resetDemoData,
  ]);

  if (!value) {
    return (
      <div className="egsl-boot">
        <div className="egsl-boot-mark">🍯</div>
        <p>Setting the table…</p>
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside EGSLProvider");
  return ctx;
}
