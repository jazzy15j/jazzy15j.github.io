// Deterministic household intelligence: no AI calls, just plain rules.
// Every function here is pure — given the same state, it returns the same
// answer, which is what makes "the app thinks ahead for me" trustworthy.

import { addDays, daysBetween, todayISO } from "./dates";
import { costPerServing, totalCost } from "./seedData";
import {
  ARCHETYPE_LABEL,
  DAY_LABELS,
  type DayArchetype,
  type DayPlan,
  type InventoryItem,
  type LeftoverAmount,
  type MealTag,
  type Recipe,
  type WeekPlan,
} from "./types";

export const HOUSE_FAVORITE_THRESHOLD = 8;

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function findInventoryByName(
  inventory: InventoryItem[],
  name: string,
): InventoryItem | undefined {
  const target = name.trim().toLowerCase();
  return inventory.find((i) => i.name.trim().toLowerCase() === target);
}

export function findRecipe(recipes: Recipe[], id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

export function isHouseFavorite(recipe: Recipe): boolean {
  if (recipe.manuallyFavorited) return true;
  if (recipe.ratings.length === 0) return false;
  const scores = recipe.ratings.flatMap((r) =>
    [r.jazzy, r.tristan].filter((n): n is number => typeof n === "number"),
  );
  if (scores.length === 0) return false;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return avg >= HOUSE_FAVORITE_THRESHOLD;
}

export function averageRating(recipe: Recipe): number | null {
  const scores = recipe.ratings.flatMap((r) =>
    [r.jazzy, r.tristan].filter((n): n is number => typeof n === "number"),
  );
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function shouldFadeFromRotation(recipe: Recipe): boolean {
  const avg = averageRating(recipe);
  return avg !== null && avg < 5;
}

// ---------------------------------------------------------------------------
// USE FIRST — scored ranking of inventory that needs used soon
// ---------------------------------------------------------------------------

export interface UseFirstEntry {
  item: InventoryItem;
  reason: string;
  score: number;
}

export function getUseFirstList(inventory: InventoryItem[], today = todayISO()): UseFirstEntry[] {
  const entries: UseFirstEntry[] = [];

  for (const item of inventory) {
    if (item.state === "out" && !item.isLeftover) continue;
    let score = 0;
    let reason = "";

    if (item.isLeftover) {
      score += 100;
      reason = "Cooked leftovers";
    }

    if (item.category === "dairy" && item.openedDate) {
      const daysOpen = daysBetween(item.openedDate, today);
      score += Math.max(0, 60 - daysOpen * 4);
      reason = reason || `Opened ${daysOpen} day${daysOpen === 1 ? "" : "s"} ago`;
    }

    if (item.category === "produce") {
      if (item.useByDate) {
        const daysLeft = daysBetween(today, item.useByDate);
        const urgency = Math.max(0, 90 - daysLeft * 12);
        score += urgency;
        if (daysLeft < 0) reason = reason || "Past peak ripeness";
        else if (daysLeft === 0) reason = reason || "Use today";
        else reason = reason || `Use within ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
      }
      if (item.state === "low") {
        score += 35;
        reason = reason || "Running low";
      }
    }

    if (item.frozen && item.frozenSinceDate) {
      const daysFrozen = daysBetween(item.frozenSinceDate, today);
      if (daysFrozen > 21) {
        score += 25;
        reason = reason || "In the freezer a while";
      }
    }

    if (!reason && item.useByDate) {
      const daysLeft = daysBetween(today, item.useByDate);
      if (daysLeft <= 2) {
        score += Math.max(0, 50 - daysLeft * 15);
        reason = "Approaching use-by date";
      }
    }

    if (score > 0) {
      entries.push({ item, reason, score });
    }
  }

  return entries.sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Grocery list
// ---------------------------------------------------------------------------

export interface GroceryLine {
  key: string;
  name: string;
  category: InventoryItem["category"];
  amounts: string[];
  recipeNames: string[];
  estCost: number;
  confidence: "exact" | "estimated";
  restockOnly: boolean;
}

export interface GroceryList {
  lines: GroceryLine[];
  doNotBuyAgain: string[];
  estimatedCart: number;
}

export function buildGroceryList(
  week: WeekPlan,
  recipes: Recipe[],
  inventory: InventoryItem[],
): GroceryList {
  const lineMap = new Map<string, GroceryLine>();
  const usedThisWeek = new Set<string>();

  const upcoming = week.days.filter((d) => !d.ateSomethingElse);

  for (const day of upcoming) {
    const recipe = findRecipe(recipes, day.recipeId);
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const key = ing.name.trim().toLowerCase();
      usedThisWeek.add(key);
      const stock = findInventoryByName(inventory, ing.name);

      if (stock && stock.state === "plenty") {
        // Already have plenty — nothing to buy, no line needed.
        continue;
      }

      const costFactor = stock && stock.state === "some" ? 0.5 : 1;
      const existing = lineMap.get(key);
      if (existing) {
        existing.amounts.push(ing.amount);
        existing.recipeNames.push(recipe.name);
        existing.estCost += ing.estCost * costFactor;
        if (ing.confidence === "estimated") existing.confidence = "estimated";
      } else {
        lineMap.set(key, {
          key,
          name: ing.name,
          category: ing.category,
          amounts: [ing.amount],
          recipeNames: [recipe.name],
          estCost: Math.round(ing.estCost * costFactor * 100) / 100,
          confidence: ing.confidence,
          restockOnly: false,
        });
      }
    }
  }

  // Low/out staples that aren't tied to a recipe this week still deserve a spot.
  for (const stock of inventory) {
    const key = stock.name.trim().toLowerCase();
    if (usedThisWeek.has(key)) continue;
    if (stock.state !== "low" && stock.state !== "out") continue;
    if (stock.isLeftover) continue;
    lineMap.set(key, {
      key,
      name: stock.name,
      category: stock.category,
      amounts: ["restock"],
      recipeNames: [],
      estCost: stock.category === "produce" || stock.category === "meat" ? 2.5 : 1.5,
      confidence: "estimated",
      restockOnly: true,
    });
  }

  const lines = [...lineMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  const doNotBuyAgain = [...usedThisWeek]
    .map((key) => findInventoryByName(inventory, key))
    .filter((i): i is InventoryItem => !!i && i.state === "plenty")
    .map((i) => i.name)
    .sort((a, b) => a.localeCompare(b));

  const estimatedCart =
    Math.round(
      lines
        .filter((l) => !week.groceryHave[l.key] && !week.grocerySkip[l.key])
        .reduce((sum, l) => sum + l.estCost, 0) * 100,
    ) / 100;

  return { lines, doNotBuyAgain, estimatedCart };
}

export const GROCERY_CATEGORY_ORDER: InventoryItem["category"][] = [
  "produce",
  "meat",
  "dairy",
  "frozen",
  "pantry",
  "bread",
  "other",
];

export const CATEGORY_LABEL: Record<InventoryItem["category"], string> = {
  produce: "Produce",
  meat: "Meat",
  dairy: "Dairy",
  frozen: "Frozen",
  pantry: "Pantry",
  bread: "Bread",
  other: "Other",
};

// ---------------------------------------------------------------------------
// Meal tags — computed fresh from a chosen recipe + current inventory
// ---------------------------------------------------------------------------

export function computeMealTags(
  recipe: Recipe,
  archetype: DayArchetype,
  inventory: InventoryItem[],
  useFirstNames: Set<string>,
): MealTag[] {
  const tags: MealTag[] = [];

  const usesUpNames = recipe.ingredients.filter((i) => i.usesUp).map((i) => i.name.toLowerCase());
  if (usesUpNames.some((n) => useFirstNames.has(n))) tags.push("use-first");

  const protein = findInventoryByName(inventory, recipe.mainProtein + " breast") ??
    inventory.find((i) => i.name.toLowerCase().includes(recipe.mainProtein.toLowerCase()) && i.frozen);
  if (recipe.freezerFriendly && protein?.frozen) tags.push("freezer");

  const pantryCount = recipe.ingredients.filter(
    (i) => i.category === "pantry" || i.category === "bread",
  ).length;
  if (pantryCount / recipe.ingredients.length >= 0.5) tags.push("pantry-heavy");

  if (archetype === "leftover") tags.push("leftover-night");
  if (recipe.ratings.length === 0) tags.push("new-recipe");
  if (isHouseFavorite(recipe)) tags.push("house-favorite");

  return tags;
}

export const TAG_LABEL: Record<MealTag, string> = {
  "use-first": "Use First",
  freezer: "Freezer",
  "pantry-heavy": "Pantry Heavy",
  "leftover-night": "Leftover Night",
  "new-recipe": "New Recipe",
  "house-favorite": "House Favorite",
  "no-cook": "No Cook",
};

// ---------------------------------------------------------------------------
// Smart rotation — builds a 7-day plan
// ---------------------------------------------------------------------------

const WEEKDAY_ARCHETYPES: DayArchetype[] = [
  "bowl",
  "taco",
  "comfort",
  "pasta",
  "fun",
  "wildcard",
  "leftover",
];

function scoreRecipeForDay(
  recipe: Recipe,
  archetype: DayArchetype,
  inventory: InventoryItem[],
  useFirstNames: Set<string>,
  alreadyUsedIds: Set<string>,
  recentIds: Set<string>,
): number {
  if (alreadyUsedIds.has(recipe.id)) return -1000;
  if (recipe.retired) return -1000;

  let score = 0;
  if (recipe.archetype === archetype) score += 40;

  const usesUp = recipe.ingredients.filter((i) => i.usesUp);
  for (const ing of usesUp) {
    if (useFirstNames.has(ing.name.toLowerCase())) score += 18;
  }

  if (isHouseFavorite(recipe)) score += 15;
  if (shouldFadeFromRotation(recipe)) score -= 60;

  const cost = totalCost(recipe);
  score += Math.max(0, 10 - cost); // cheaper meals nudge upward

  if (archetype === "wildcard" && recipe.ratings.length === 0) score += 20;
  if (archetype === "leftover" && recipe.archetype === "leftover") score += 25;

  if (recentIds.has(recipe.id)) score -= 25; // seen last week, add variety

  return score;
}

export function buildWeekRotation(
  recipes: Recipe[],
  inventory: InventoryItem[],
  weekHistory: WeekPlan[],
  weekStartDate: string,
  budgetTarget: number,
): WeekPlan {
  const useFirst = new Set(getUseFirstList(inventory).map((e) => e.item.name.toLowerCase()));
  const recentIds = new Set(
    (weekHistory[weekHistory.length - 1]?.days ?? []).map((d) => d.recipeId),
  );
  const usedThisWeek = new Set<string>();
  const active = recipes.filter((r) => !r.retired);

  const days: DayPlan[] = WEEKDAY_ARCHETYPES.map((archetype, idx) => {
    const candidates = active
      .map((r) => ({
        recipe: r,
        score: scoreRecipeForDay(r, archetype, inventory, useFirst, usedThisWeek, recentIds),
      }))
      .sort((a, b) => b.score - a.score);

    const chosen = candidates[0]?.recipe ?? active[idx % active.length];
    usedThisWeek.add(chosen.id);

    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + idx);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;

    return {
      id: `day-${iso}`,
      date: iso,
      dayLabel: DAY_LABELS[idx],
      archetype,
      recipeId: chosen.id,
      tags: computeMealTags(chosen, archetype, inventory, useFirst),
      cooked: false,
    };
  });

  return {
    id: `week-${weekStartDate}`,
    weekStartDate,
    budgetTarget,
    days,
    groceryChecked: {},
    groceryHave: {},
    grocerySkip: {},
    pointsLog: [],
  };
}

// ---------------------------------------------------------------------------
// Leftover engine
// ---------------------------------------------------------------------------

export function suggestLeftoverUse(
  recipe: Recipe,
  amount: LeftoverAmount,
  recipes: Recipe[],
): string | undefined {
  if (amount === "none" || recipe.leftoverQuality === "none") return undefined;

  if (amount === "a-lot" || amount === "two") {
    return `Tomorrow lunch: ${recipe.name}.`;
  }

  if (recipe.goodLeftoverRemixFor?.length) {
    const remix = recipes.find((r) => r.id === recipe.goodLeftoverRemixFor?.[0]);
    if (remix) {
      return `Turn leftover ${recipe.mainProtein.toLowerCase()} into ${remix.name}.`;
    }
  }

  return `Small portion saved — enough for a quick snack or lunch add-on.`;
}

// ---------------------------------------------------------------------------
// Quick swap
// ---------------------------------------------------------------------------

export interface SwapOptions {
  fastest?: Recipe;
  cheapest?: Recipe;
  useFirst?: Recipe;
  comfort?: Recipe;
  noCook?: Recipe;
  pantryOnly?: Recipe;
}

function shoppingBurden(recipe: Recipe, inventory: InventoryItem[]): number {
  return recipe.ingredients.filter((ing) => {
    const stock = findInventoryByName(inventory, ing.name);
    return !stock || stock.state === "low" || stock.state === "out";
  }).length;
}

export function getSwapOptions(
  current: Recipe,
  recipes: Recipe[],
  inventory: InventoryItem[],
): SwapOptions {
  const pool = recipes.filter((r) => r.id !== current.id && !r.retired);
  const useFirstNames = new Set(getUseFirstList(inventory).map((e) => e.item.name.toLowerCase()));

  const byUseFirstCount = (r: Recipe) =>
    r.ingredients.filter((i) => i.usesUp && useFirstNames.has(i.name.toLowerCase())).length;

  const sortedFastest = [...pool].sort((a, b) => a.timeMinutes - b.timeMinutes);
  const sortedCheapest = [...pool].sort((a, b) => totalCost(a) - totalCost(b));
  const sortedUseFirst = [...pool].sort((a, b) => byUseFirstCount(b) - byUseFirstCount(a));
  const sortedComfort = [...pool]
    .filter((r) => r.archetype === "comfort")
    .sort((a, b) => totalCost(a) - totalCost(b));
  const sortedNoCook = [...pool]
    .filter((r) => r.timeMinutes <= 12)
    .sort((a, b) => a.timeMinutes - b.timeMinutes);
  const sortedPantryOnly = [...pool].sort(
    (a, b) => shoppingBurden(a, inventory) - shoppingBurden(b, inventory),
  );

  return {
    fastest: sortedFastest[0],
    cheapest: sortedCheapest[0],
    useFirst: byUseFirstCount(sortedUseFirst[0]) > 0 ? sortedUseFirst[0] : undefined,
    comfort: sortedComfort[0],
    noCook: sortedNoCook[0],
    pantryOnly: sortedPantryOnly[0],
  };
}

// ---------------------------------------------------------------------------
// Scoring / gamification
// ---------------------------------------------------------------------------

export interface PointsBreakdownEntry {
  label: string;
  points: number;
}

export interface WeeklyScore {
  points: number;
  breakdown: PointsBreakdownEntry[];
  mealsCooked: number;
  leftoversUsed: number;
  takeoutAvoided: number;
  estimatedSpend: number;
  budgetRemaining: number;
}

export function computeWeeklyScore(
  week: WeekPlan,
  recipes: Recipe[],
  inventory: InventoryItem[],
  today = todayISO(),
): WeeklyScore {
  const breakdown: PointsBreakdownEntry[] = [];
  const passedDays = week.days.filter((d) => d.date <= today);

  const mealsCooked = passedDays.filter((d) => !d.ateSomethingElse).length;
  const leftoverNights = week.days.filter((d) => d.tags.includes("leftover-night")).length;
  const pantryFreezerNights = week.days.filter(
    (d) => d.tags.includes("pantry-heavy") || d.tags.includes("freezer"),
  ).length;
  const takeoutDays = passedDays.filter((d) => d.ateSomethingElse).length;

  if (leftoverNights > 0) breakdown.push({ label: "Ate planned leftovers", points: 5 * leftoverNights });
  if (pantryFreezerNights > 0)
    breakdown.push({ label: "Pantry / freezer dinner", points: 5 * pantryFreezerNights });

  const newRecipeBothLiked = recipes.filter((r) =>
    r.ratings.some(
      (rt) => rt.date >= week.weekStartDate && (rt.jazzy ?? 0) >= 7 && (rt.tristan ?? 0) >= 7,
    ) && (r.archetype === "wildcard" || r.ratings.length === 1),
  ).length;
  if (newRecipeBothLiked > 0)
    breakdown.push({ label: "Tried a new recipe you both liked", points: 5 * newRecipeBothLiked });

  const overdueWaste = inventory.some(
    (i) =>
      i.category === "produce" &&
      i.state !== "out" &&
      i.useByDate &&
      daysBetween(i.useByDate, today) > 2,
  );
  if (!overdueWaste && passedDays.length > 0) {
    breakdown.push({ label: "Zero preventable food waste", points: 10 });
  }

  if (passedDays.length > 0 && takeoutDays === 0) {
    breakdown.push({ label: "No unplanned takeout", points: 10 });
  }

  const usedFreshProduce = inventory.every((i) => !(i.category === "produce" && i.state === "out"));
  if (usedFreshProduce) breakdown.push({ label: "Used fresh vegetables before they spoiled", points: 5 });

  const estimatedSpend = 0; // filled in by caller when a grocery list is available
  const budgetRemaining = week.budgetTarget - estimatedSpend;

  const points = breakdown.reduce((sum, b) => sum + b.points, 0);

  return {
    points,
    breakdown,
    mealsCooked,
    leftoversUsed: leftoverNights,
    takeoutAvoided: passedDays.length - takeoutDays,
    estimatedSpend,
    budgetRemaining,
  };
}

export function addSpendTierPoints(score: WeeklyScore, estimatedCart: number, budgetTarget: number): WeeklyScore {
  const breakdown = [...score.breakdown];
  let tierPoints = 0;
  let tierLabel = "";
  if (estimatedCart < 50) {
    tierPoints = 15;
    tierLabel = "Grocery trip under $50";
  } else if (estimatedCart < 55) {
    tierPoints = 10;
    tierLabel = "Grocery trip under $55";
  } else if (estimatedCart < 60) {
    tierPoints = 5;
    tierLabel = "Grocery trip under $60";
  }
  if (tierPoints > 0) breakdown.push({ label: tierLabel, points: tierPoints });

  return {
    ...score,
    breakdown,
    points: score.points + tierPoints,
    estimatedSpend: estimatedCart,
    budgetRemaining: Math.round((budgetTarget - estimatedCart) * 100) / 100,
  };
}

// ---------------------------------------------------------------------------
// Monthly rollup — only counts things we can honestly derive from history.
// ---------------------------------------------------------------------------

export interface MonthlyStats {
  weeksTracked: number;
  totalDinnerCost: number;
  averageWeeklyCost: number;
  averageDinnerCost: number;
  estimatedSavings: number;
  favoriteMeal: { name: string; avg: number } | null;
  mostUsedIngredient: { name: string; count: number } | null;
  mostRepeatedDinner: { name: string; count: number } | null;
}

export function computeMonthlyStats(
  weeks: WeekPlan[],
  recipes: Recipe[],
  budgetTarget: number,
): MonthlyStats {
  const allDays = weeks.flatMap((w) => w.days);
  const recipeById = new Map(recipes.map((r) => [r.id, r]));

  let totalDinnerCost = 0;
  const ingredientCounts = new Map<string, number>();
  const recipeCounts = new Map<string, number>();

  for (const day of allDays) {
    const recipe = recipeById.get(day.recipeId);
    if (!recipe) continue;
    totalDinnerCost += totalCost(recipe);
    recipeCounts.set(recipe.id, (recipeCounts.get(recipe.id) ?? 0) + 1);
    for (const ing of recipe.ingredients) {
      const key = ing.name;
      ingredientCounts.set(key, (ingredientCounts.get(key) ?? 0) + 1);
    }
  }

  const favoriteEntries = recipes
    .filter((r) => r.ratings.length > 0)
    .map((r) => ({ name: r.name, avg: averageRating(r) ?? 0 }))
    .sort((a, b) => b.avg - a.avg);

  const mostUsedIngredient = [...ingredientCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const mostRepeatedEntry = [...recipeCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  const weeksTracked = Math.max(1, weeks.length);

  return {
    weeksTracked: weeks.length,
    totalDinnerCost: Math.round(totalDinnerCost * 100) / 100,
    averageWeeklyCost: Math.round((totalDinnerCost / weeksTracked) * 100) / 100,
    averageDinnerCost: Math.round((totalDinnerCost / Math.max(1, allDays.length)) * 100) / 100,
    estimatedSavings: Math.round((budgetTarget * weeksTracked - totalDinnerCost) * 100) / 100,
    favoriteMeal: favoriteEntries[0] ?? null,
    mostUsedIngredient: mostUsedIngredient ? { name: mostUsedIngredient[0], count: mostUsedIngredient[1] } : null,
    mostRepeatedDinner: mostRepeatedEntry
      ? { name: recipeById.get(mostRepeatedEntry[0])?.name ?? "—", count: mostRepeatedEntry[1] }
      : null,
  };
}

/** Consecutive days, walking back from today, that didn't get takeout. */
export function computeCookingStreak(weeks: WeekPlan[], today = todayISO()): number {
  const byDate = new Map(
    weeks.flatMap((w) => w.days).map((d) => [d.date, d] as const),
  );
  let streak = 0;
  let cursor = today;
  while (true) {
    const day = byDate.get(cursor);
    if (!day || day.date > today || day.ateSomethingElse) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export { costPerServing, totalCost, ARCHETYPE_LABEL };
