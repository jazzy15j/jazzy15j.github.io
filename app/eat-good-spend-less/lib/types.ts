// Core data model for Eat Good, Spend Less.
// Everything here is designed to persist cleanly to localStorage/IndexedDB
// today and to a cloud sync backend later without reshaping.

export type IngredientCategory =
  | "produce"
  | "meat"
  | "dairy"
  | "frozen"
  | "pantry"
  | "bread"
  | "other";

export type StockState = "plenty" | "some" | "low" | "out";

export type CostConfidence = "exact" | "estimated";

/** A single item living in the household's fridge/freezer/pantry. */
export interface InventoryItem {
  id: string;
  name: string;
  category: IngredientCategory;
  state: StockState;
  approxAmount?: string;
  /** ISO date this item was opened (for "use first" dairy logic). */
  openedDate?: string;
  /** Approximate use-by / peak-ripeness date. Never treated as exact. */
  useByDate?: string;
  frozen?: boolean;
  /** ISO date something went into the freezer, for "been in there a while". */
  frozenSinceDate?: string;
  isLeftover?: boolean;
  /** Which recipe these leftovers came from, if any. */
  leftoverOfRecipeId?: string;
  notes?: string;
  /** Package price info, used to estimate recipe costs. */
  packagePrice?: number;
  packageAmount?: string;
  /** True for pantry staples we basically always have (soy sauce, rice...). */
  isStaple?: boolean;
}

export type Difficulty = "easy" | "medium";

export type DayArchetype =
  | "bowl"
  | "taco"
  | "comfort"
  | "pasta"
  | "fun"
  | "wildcard"
  | "leftover"
  | "breakfast";

export type MealTag =
  | "use-first"
  | "freezer"
  | "pantry-heavy"
  | "leftover-night"
  | "new-recipe"
  | "house-favorite"
  | "no-cook";

export interface RecipeIngredient {
  name: string;
  amount: string;
  category: IngredientCategory;
  estCost: number;
  confidence: CostConfidence;
  /** True if this ingredient is a "use it up" target for this recipe. */
  usesUp?: boolean;
}

export interface RatingEntry {
  id: string;
  date: string;
  jazzy: number | null;
  tristan: number | null;
  verdict: "keep" | "modify" | "retire" | null;
  note?: string;
}

export interface Recipe {
  id: string;
  name: string;
  archetype: DayArchetype;
  mainProtein: string;
  icon: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  servings: number;
  timeMinutes: number;
  difficulty: Difficulty;
  costConfidence: CostConfidence;
  leftoverQuality: "none" | "ok" | "great";
  freezerFriendly: boolean;
  pantryStaplesUsed: string[];
  notes: string[];
  ratings: RatingEntry[];
  manuallyFavorited?: boolean;
  retired?: boolean;
  prepAhead?: string;
  /** Simple remix suggestions: "if you have leftover X, make this". */
  goodLeftoverRemixFor?: string[];
}

export type LeftoverAmount = "none" | "one" | "two" | "a-lot";

export interface DayPlan {
  id: string;
  date: string; // ISO yyyy-mm-dd
  dayLabel: string; // Mon..Sun
  archetype: DayArchetype;
  recipeId: string;
  tags: MealTag[];
  leftovers?: LeftoverAmount;
  leftoverPlan?: string; // human text: "Tomorrow lunch: taco bowls"
  ateSomethingElse?: boolean;
  swappedFromRecipeId?: string;
  cooked?: boolean;
  skippedTakeoutAvoided?: boolean;
}

export interface WeekPlan {
  id: string;
  weekStartDate: string; // ISO Monday
  budgetTarget: number;
  days: DayPlan[];
  groceryChecked: Record<string, boolean>;
  groceryHave: Record<string, boolean>;
  grocerySkip: Record<string, boolean>;
  actualSpend?: number;
  pointsLog: PointEvent[];
}

export interface PointEvent {
  id: string;
  date: string;
  reason: string;
  points: number;
}

export interface AppSettings {
  budgetTarget: number;
  people: [string, string];
}

export interface AppState {
  version: number;
  settings: AppSettings;
  inventory: InventoryItem[];
  recipes: Recipe[];
  currentWeek: WeekPlan;
  weekHistory: WeekPlan[]; // completed / prior weeks, most recent last
}

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const ARCHETYPE_LABEL: Record<DayArchetype, string> = {
  bowl: "Bowl",
  taco: "Taco / Mexican",
  comfort: "Comfort / Potato",
  pasta: "Pasta",
  fun: "Fun / Easy",
  wildcard: "New Recipe / Wild Card",
  leftover: "Leftover / Freezer Cleanout",
  breakfast: "Breakfast-for-Dinner",
};

export const DEFAULT_WEEKLY_BUDGET = 65;
