import type { InventoryItem, Recipe, RecipeIngredient } from "./types";

// ---------------------------------------------------------------------------
// Recipe costing helper — real "package price -> recipe cost" math, so the
// numbers below aren't guesses typed at random. See spec section 12.
// ---------------------------------------------------------------------------
function costFromPackage(
  packagePrice: number,
  packageOunces: number,
  usedOunces: number,
): number {
  return Math.round((packagePrice / packageOunces) * usedOunces * 100) / 100;
}

// Chicken breast: 4.64 lb family pack for $10.35 (this is the worked example
// from the spec). Most dinners here use ~10 oz of chicken for two people.
const CHICKEN_PACKAGE = { price: 10.35, ounces: 4.64 * 16 };
const chickenCost = (oz: number) => costFromPackage(CHICKEN_PACKAGE.price, CHICKEN_PACKAGE.ounces, oz);

function ing(
  name: string,
  amount: string,
  category: RecipeIngredient["category"],
  estCost: number,
  opts: { confidence?: RecipeIngredient["confidence"]; usesUp?: boolean } = {},
): RecipeIngredient {
  return {
    name,
    amount,
    category,
    estCost,
    confidence: opts.confidence ?? "estimated",
    usesUp: opts.usesUp,
  };
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function recipe(r: Omit<Recipe, "id" | "costConfidence" | "ratings" | "notes"> & {
  notes?: string[];
}): Recipe {
  const anyEstimated = r.ingredients.some((i) => i.confidence === "estimated");
  return {
    ...r,
    id: slug(r.name),
    costConfidence: anyEstimated ? "estimated" : "exact",
    ratings: [],
    notes: r.notes ?? [],
  };
}

export function totalCost(recipe: Recipe): number {
  return Math.round(recipe.ingredients.reduce((sum, i) => sum + i.estCost, 0) * 100) / 100;
}

export function costPerServing(recipe: Recipe): number {
  return Math.round((totalCost(recipe) / recipe.servings) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

export const SEED_RECIPES: Recipe[] = [
  recipe({
    name: "Sticky Chicken Rice Bowls",
    archetype: "bowl",
    mainProtein: "Chicken",
    icon: "🍯",
    servings: 2,
    timeMinutes: 15,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: false,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["Rice", "Soy sauce", "Honey", "Garlic powder"],
    goodLeftoverRemixFor: ["chicken quesadillas", "cheesy chicken broccoli rice"],
    notes: ["Tristan loved this one.", "Double the sauce if you like it saucier."],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Rice", "1 cup dry", "pantry", 0.45),
      ing("Broccoli", "1 head", "produce", 1.79, { usesUp: true }),
      ing("Soy sauce", "3 tbsp", "pantry", 0.2),
      ing("Honey", "2 tbsp", "pantry", 0.35),
      ing("Garlic powder", "1 tsp", "pantry", 0.05),
    ],
    steps: [
      "Start rice (1 cup dry + 2 cups water, cover and simmer 15 min).",
      "Cut chicken into bite-sized pieces.",
      "Season chicken with garlic powder and a pinch of salt.",
      "Cook chicken in a hot pan 6–8 minutes, stirring occasionally.",
      "Stir in soy sauce and honey, cook 1–2 more minutes until sticky.",
      "Microwave broccoli 3–4 minutes until bright green and tender.",
      "Assemble bowls: rice, chicken, broccoli. Add avocado if ripe.",
    ],
  }),

  recipe({
    name: "Chicken Taco Bowls",
    archetype: "taco",
    mainProtein: "Chicken",
    icon: "🌮",
    servings: 2,
    timeMinutes: 20,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: true,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["Rice", "Black beans", "Salsa", "Chili powder", "Cumin"],
    goodLeftoverRemixFor: ["loaded taco potatoes", "chicken quesadillas"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Rice", "1 cup dry", "pantry", 0.45),
      ing("Black beans", "1 can", "pantry", 0.89),
      ing("Frozen corn", "1 cup", "frozen", 0.4),
      ing("Salsa", "1/2 cup", "pantry", 0.5, { usesUp: true }),
      ing("Cheddar", "1/2 cup shredded", "dairy", 0.75),
      ing("Chili powder", "1 tsp", "pantry", 0.05),
      ing("Cumin", "1/2 tsp", "pantry", 0.05),
    ],
    steps: [
      "Start rice.",
      "Cut chicken into small pieces and season with chili powder and cumin.",
      "Cook chicken 6–8 minutes until browned through.",
      "Warm black beans and corn together in a small pot.",
      "Assemble bowls: rice, chicken, beans and corn, salsa, cheddar.",
    ],
  }),

  recipe({
    name: "Sausage Peppers & Rice",
    archetype: "fun",
    mainProtein: "Sausage",
    icon: "🌶️",
    servings: 2,
    timeMinutes: 25,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: true,
    pantryStaplesUsed: ["Rice", "Olive oil", "Garlic powder", "Paprika"],
    notes: [],
    ingredients: [
      ing("Smoked sausage", "12 oz", "meat", 3.99, { usesUp: true }),
      ing("Bell peppers", "2", "produce", 1.98, { usesUp: true }),
      ing("Onion", "1", "produce", 0.6),
      ing("Rice", "1 cup dry", "pantry", 0.45),
      ing("Olive oil", "1 tbsp", "pantry", 0.1),
      ing("Paprika", "1 tsp", "pantry", 0.05),
    ],
    steps: [
      "Start rice.",
      "Slice sausage into coins, slice peppers and onion into strips.",
      "Sauté sausage in olive oil 4–5 minutes until browned.",
      "Add peppers and onion, cook 6–8 minutes until soft.",
      "Season with paprika, serve over rice.",
    ],
  }),

  recipe({
    name: "Chicken + Sweet Potato",
    archetype: "comfort",
    mainProtein: "Chicken",
    icon: "🍠",
    servings: 2,
    timeMinutes: 35,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: false,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["Olive oil", "Garlic powder", "Paprika"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Sweet potatoes", "2 medium", "produce", 1.5, { usesUp: true }),
      ing("Olive oil", "2 tbsp", "pantry", 0.2),
      ing("Garlic powder", "1 tsp", "pantry", 0.05),
      ing("Paprika", "1 tsp", "pantry", 0.05),
    ],
    steps: [
      "Preheat oven to 425°F.",
      "Cube sweet potatoes and toss with half the oil, salt and paprika.",
      "Roast sweet potatoes 20 minutes.",
      "Season chicken with garlic powder, sear in remaining oil 3 minutes per side.",
      "Finish chicken in the oven with the sweet potatoes, 8–10 minutes.",
    ],
  }),

  recipe({
    name: "Chicken Broccoli Parmesan Pasta",
    archetype: "pasta",
    mainProtein: "Chicken",
    icon: "🍝",
    servings: 2,
    timeMinutes: 25,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: false,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["Pasta", "Olive oil", "Garlic powder"],
    goodLeftoverRemixFor: ["cheesy chicken broccoli rice"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Pasta", "8 oz", "pantry", 1.0),
      ing("Broccoli", "1 head", "produce", 1.79, { usesUp: true }),
      ing("Parmesan", "1/3 cup grated", "dairy", 1.2),
      ing("Olive oil", "2 tbsp", "pantry", 0.2),
      ing("Garlic powder", "1 tsp", "pantry", 0.05),
    ],
    steps: [
      "Boil pasta according to package directions, adding broccoli in the last 3 minutes.",
      "Cut chicken into bite-sized pieces and season with garlic powder.",
      "Cook chicken in olive oil 6–8 minutes until done.",
      "Drain pasta and broccoli, reserving 1/4 cup pasta water.",
      "Toss pasta, broccoli, and chicken with parmesan and a splash of pasta water.",
    ],
  }),

  recipe({
    name: "Chicken Potato Cucumber Salad",
    archetype: "fun",
    mainProtein: "Chicken",
    icon: "🥗",
    servings: 2,
    timeMinutes: 20,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: false,
    pantryStaplesUsed: ["Olive oil"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Russet potatoes", "3 small", "produce", 1.2, { usesUp: true }),
      ing("Cucumber", "1", "produce", 0.79, { usesUp: true }),
      ing("Greek yogurt", "1/2 cup", "dairy", 0.75, { usesUp: true }),
      ing("Olive oil", "1 tbsp", "pantry", 0.1),
    ],
    steps: [
      "Boil cubed potatoes 12–15 minutes until fork-tender, then cool slightly.",
      "Season and pan-sear chicken 6–8 minutes, then dice.",
      "Dice cucumber.",
      "Toss potatoes, chicken, and cucumber with Greek yogurt and olive oil.",
      "Salt and pepper to taste, serve warm or chilled.",
    ],
  }),

  recipe({
    name: "Chicken Avocado Sandwich",
    archetype: "fun",
    mainProtein: "Chicken",
    icon: "🥪",
    servings: 2,
    timeMinutes: 10,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: false,
    pantryStaplesUsed: ["Bread"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "8 oz, cooked", "meat", chickenCost(8), { usesUp: true }),
      ing("Avocado", "1", "produce", 1.25, { usesUp: true }),
      ing("Bread", "4 slices", "bread", 0.7),
      ing("Lettuce", "2 leaves", "produce", 0.3),
    ],
    steps: [
      "Toast bread if desired.",
      "Slice or shred cooked chicken.",
      "Mash avocado directly onto bread with a fork, season with salt and pepper.",
      "Layer chicken and lettuce, close sandwiches, slice and serve.",
    ],
  }),

  recipe({
    name: "Caprese Chicken Toast",
    archetype: "fun",
    mainProtein: "Chicken",
    icon: "🍅",
    servings: 2,
    timeMinutes: 15,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: false,
    pantryStaplesUsed: ["Bread", "Olive oil"],
    notes: ["Too much feta the first time — go lighter."],
    ingredients: [
      ing("Chicken breast", "8 oz, cooked", "meat", chickenCost(8), { usesUp: true }),
      ing("Bread", "4 slices", "bread", 0.7),
      ing("Cherry tomatoes", "1 cup", "produce", 1.5, { usesUp: true }),
      ing("Mozzarella", "4 oz", "dairy", 1.6),
      ing("Basil", "small handful", "produce", 0.6),
      ing("Balsamic glaze", "1 tbsp", "pantry", 0.3),
    ],
    steps: [
      "Toast bread with a drizzle of olive oil.",
      "Slice cooked chicken, halve cherry tomatoes, tear mozzarella and basil.",
      "Layer chicken, tomatoes, mozzarella and basil on toast.",
      "Finish with a drizzle of balsamic glaze.",
    ],
  }),

  recipe({
    name: "Chicken & Gravy Bowls",
    archetype: "comfort",
    mainProtein: "Chicken",
    icon: "🥣",
    servings: 2,
    timeMinutes: 25,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: true,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["Rice", "Chicken gravy packet"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Rice", "1 cup dry", "pantry", 0.45),
      ing("Chicken gravy packet", "1 packet", "pantry", 0.89),
      ing("Frozen corn", "1 cup", "frozen", 0.4, { usesUp: true }),
    ],
    steps: [
      "Start rice.",
      "Cut chicken into bite-sized pieces and season lightly.",
      "Cook chicken 6–8 minutes until browned through.",
      "Make gravy according to packet directions, stir cooked chicken through it.",
      "Warm corn, serve everything over rice.",
    ],
  }),

  recipe({
    name: "Greek Chicken Bowls",
    archetype: "bowl",
    mainProtein: "Chicken",
    icon: "🫒",
    servings: 2,
    timeMinutes: 20,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: false,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["Rice", "Greek dressing"],
    notes: ["Tristan loved this."],
    ingredients: [
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("Rice", "1 cup dry", "pantry", 0.45),
      ing("Cucumber", "1/2", "produce", 0.4, { usesUp: true }),
      ing("Cherry tomatoes", "1/2 cup", "produce", 0.75, { usesUp: true }),
      ing("Feta", "1/3 cup", "dairy", 1.1, { usesUp: true }),
      ing("Greek dressing", "3 tbsp", "pantry", 0.4),
    ],
    steps: [
      "Start rice.",
      "Season chicken and pan-sear 6–8 minutes until cooked through.",
      "Dice cucumber and halve cherry tomatoes.",
      "Assemble bowls: rice, chicken, cucumber, tomatoes, feta.",
      "Drizzle with Greek dressing.",
    ],
  }),

  recipe({
    name: "Chicken Quesadillas",
    archetype: "leftover",
    mainProtein: "Chicken",
    icon: "🧀",
    servings: 2,
    timeMinutes: 8,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: false,
    pantryStaplesUsed: ["Flour tortillas", "Cheddar", "Salsa"],
    notes: [],
    ingredients: [
      ing("Chicken breast", "8 oz, cooked", "meat", chickenCost(8), { usesUp: true }),
      ing("Flour tortillas", "4", "bread", 1.0),
      ing("Cheddar", "1 cup shredded", "dairy", 1.5, { usesUp: true }),
      ing("Salsa", "for dipping", "pantry", 0.3),
    ],
    steps: [
      "Shred or chop cooked chicken.",
      "Layer chicken and cheddar between two tortillas.",
      "Cook in a dry skillet 2–3 minutes per side until golden and melty.",
      "Slice into wedges, serve with salsa.",
    ],
  }),

  recipe({
    name: "Loaded Taco Potatoes",
    archetype: "comfort",
    mainProtein: "Chicken",
    icon: "🥔",
    servings: 2,
    timeMinutes: 45,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: false,
    pantryStaplesUsed: ["Salsa", "Cheddar", "Black beans", "Chili powder"],
    notes: [],
    ingredients: [
      ing("Russet potatoes", "2 large", "produce", 1.2, { usesUp: true }),
      ing("Chicken breast", "8 oz, cooked & seasoned", "meat", chickenCost(8), { usesUp: true }),
      ing("Black beans", "1/2 can", "pantry", 0.45),
      ing("Cheddar", "1/2 cup shredded", "dairy", 0.75),
      ing("Salsa", "1/4 cup", "pantry", 0.25),
      ing("Chili powder", "1/2 tsp", "pantry", 0.05),
    ],
    steps: [
      "Pierce potatoes and microwave 10–12 minutes, or bake at 425°F for 45 minutes.",
      "Warm chicken and black beans with chili powder.",
      "Split potatoes open and fluff the inside.",
      "Top with chicken, beans, cheddar, and salsa.",
    ],
  }),

  recipe({
    name: "BBQ Chicken Potatoes",
    archetype: "comfort",
    mainProtein: "Chicken",
    icon: "🍖",
    servings: 2,
    timeMinutes: 45,
    difficulty: "easy",
    leftoverQuality: "great",
    freezerFriendly: false,
    prepAhead: "Take 2 chicken breasts out of the freezer by 2 PM.",
    pantryStaplesUsed: ["BBQ sauce", "Cheddar"],
    notes: ["Make double next time — great leftovers."],
    ingredients: [
      ing("Russet potatoes", "2 large", "produce", 1.2, { usesUp: true }),
      ing("Chicken breast", "10 oz", "meat", chickenCost(10), { usesUp: true }),
      ing("BBQ sauce", "1/3 cup", "pantry", 0.6),
      ing("Cheddar", "1/2 cup shredded", "dairy", 0.75),
    ],
    steps: [
      "Pierce potatoes and microwave 10–12 minutes, or bake at 425°F for 45 minutes.",
      "Season chicken, pan-sear 6–8 minutes until cooked through, dice.",
      "Toss diced chicken with BBQ sauce.",
      "Split potatoes, top with BBQ chicken and cheddar.",
    ],
  }),

  recipe({
    name: "Breakfast Hash Brown Plates",
    archetype: "breakfast",
    mainProtein: "Eggs",
    icon: "🍳",
    servings: 2,
    timeMinutes: 15,
    difficulty: "easy",
    leftoverQuality: "none",
    freezerFriendly: false,
    pantryStaplesUsed: ["Hash browns", "Butter"],
    notes: [],
    ingredients: [
      ing("Frozen hash browns", "2 cups", "frozen", 0.9, { usesUp: true }),
      ing("Eggs", "4", "dairy", 0.9),
      ing("Butter", "1 tbsp", "dairy", 0.15),
      ing("Cheddar", "1/4 cup shredded", "dairy", 0.4),
    ],
    steps: [
      "Crisp hash browns in butter over medium-high heat, 8–10 minutes.",
      "Push hash browns to one side, scramble eggs in the same pan.",
      "Top hash browns with cheddar until melted.",
      "Plate eggs and hash browns together.",
    ],
  }),

  recipe({
    name: "Egg Avocado Toast",
    archetype: "breakfast",
    mainProtein: "Eggs",
    icon: "🥑",
    servings: 2,
    timeMinutes: 10,
    difficulty: "easy",
    leftoverQuality: "none",
    freezerFriendly: false,
    pantryStaplesUsed: ["Bread"],
    notes: [],
    ingredients: [
      ing("Bread", "4 slices", "bread", 0.7),
      ing("Avocado", "1", "produce", 1.25, { usesUp: true }),
      ing("Eggs", "2", "dairy", 0.45),
    ],
    steps: [
      "Toast bread.",
      "Mash avocado onto toast, season with salt and pepper.",
      "Fry or scramble eggs, place on top.",
    ],
  }),

  recipe({
    name: "Breakfast Sandwiches",
    archetype: "breakfast",
    mainProtein: "Eggs",
    icon: "🍞",
    servings: 2,
    timeMinutes: 12,
    difficulty: "easy",
    leftoverQuality: "none",
    freezerFriendly: false,
    pantryStaplesUsed: ["Bread", "Cheddar"],
    notes: [],
    ingredients: [
      ing("Eggs", "2", "dairy", 0.45),
      ing("Bread", "4 slices", "bread", 0.7),
      ing("Cheddar", "2 slices", "dairy", 0.6),
    ],
    steps: [
      "Fry eggs to fit the bread.",
      "Toast bread.",
      "Layer egg and cheddar between toast, press gently until cheese melts.",
    ],
  }),

  recipe({
    name: "Homemade Chicken Flatbread Pizza",
    archetype: "wildcard",
    mainProtein: "Chicken",
    icon: "🍕",
    servings: 2,
    timeMinutes: 20,
    difficulty: "medium",
    leftoverQuality: "ok",
    freezerFriendly: false,
    pantryStaplesUsed: ["Olive oil"],
    notes: [],
    ingredients: [
      ing("Flatbread", "2", "bread", 2.5, { usesUp: true }),
      ing("Chicken breast", "8 oz, cooked", "meat", chickenCost(8), { usesUp: true }),
      ing("Mozzarella", "1 cup shredded", "dairy", 2.0, { usesUp: true }),
      ing("BBQ sauce", "1/3 cup", "pantry", 0.6),
      ing("Red onion", "1/4", "produce", 0.2),
    ],
    steps: [
      "Preheat oven to 425°F.",
      "Spread BBQ sauce over flatbreads.",
      "Top with shredded chicken, mozzarella, and thin red onion slices.",
      "Bake 10–12 minutes until cheese is bubbly and edges are crisp.",
    ],
  }),

  recipe({
    name: "Cheesy Chicken Broccoli Rice",
    archetype: "leftover",
    mainProtein: "Chicken",
    icon: "🧈",
    servings: 2,
    timeMinutes: 15,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: true,
    pantryStaplesUsed: ["Rice", "Cheddar"],
    notes: [],
    ingredients: [
      ing("Rice", "1.5 cups, cooked leftover", "pantry", 0.3, { usesUp: true }),
      ing("Chicken breast", "8 oz, cooked", "meat", chickenCost(8), { usesUp: true }),
      ing("Broccoli", "1 cup, cooked leftover", "produce", 0.4, { usesUp: true }),
      ing("Cheddar", "3/4 cup shredded", "dairy", 1.1),
    ],
    steps: [
      "Warm rice, chicken, and broccoli together in a pan over medium heat.",
      "Stir in cheddar until melted and creamy.",
      "Season with salt and pepper to taste.",
    ],
  }),

  recipe({
    name: "Burger Lettuce Wraps",
    archetype: "fun",
    mainProtein: "Beef",
    icon: "🍔",
    servings: 2,
    timeMinutes: 20,
    difficulty: "easy",
    leftoverQuality: "ok",
    freezerFriendly: true,
    pantryStaplesUsed: [],
    notes: [],
    ingredients: [
      ing("Ground beef", "10 oz", "meat", 4.5, { usesUp: true }),
      ing("Lettuce", "1 head, leaves separated", "produce", 1.5, { usesUp: true }),
      ing("Cheddar", "2 slices", "dairy", 0.6),
      ing("Tomato", "1", "produce", 0.6),
    ],
    steps: [
      "Form ground beef into 4 small patties, season with salt and pepper.",
      "Cook patties 3–4 minutes per side, topping with cheddar at the end.",
      "Wash and separate large lettuce leaves.",
      "Wrap each patty in lettuce with sliced tomato.",
    ],
  }),
];

export const HOUSE_FAVORITE_THRESHOLD = 8; // avg rating needed to auto-tag a favorite

// ---------------------------------------------------------------------------
// Seed a couple of ratings so House Favorites and the rating flow have
// something real to show on first launch.
// ---------------------------------------------------------------------------
function withSeedRatings(recipes: Recipe[]): Recipe[] {
  const bump = (id: string, jazzy: number, tristan: number, note?: string) => {
    const r = recipes.find((x) => x.id === id);
    if (!r) return;
    r.ratings.push({
      id: `${id}-seed`,
      date: "2026-07-28",
      jazzy,
      tristan,
      verdict: "keep",
      note,
    });
  };
  bump("sticky-chicken-rice-bowls", 9, 9, "Weeknight staple, always works.");
  bump("chicken-taco-bowls", 9, 8);
  bump("greek-chicken-bowls", 8, 9, "Tristan loved this.");
  bump("bbq-chicken-potatoes", 8, 8);
  bump("chicken-quesadillas", 9, 8, "So easy with leftover chicken.");
  bump("caprese-chicken-toast", 6, 5, "Too much feta — go lighter next time.");
  return recipes;
}

export function buildSeedRecipes(): Recipe[] {
  // Deep clone so repeated resets don't mutate the module-level constants.
  const clones: Recipe[] = SEED_RECIPES.map((r) => ({
    ...r,
    ingredients: r.ingredients.map((i) => ({ ...i })),
    steps: [...r.steps],
    pantryStaplesUsed: [...r.pantryStaplesUsed],
    notes: [...r.notes],
    ratings: [],
    goodLeftoverRemixFor: r.goodLeftoverRemixFor ? [...r.goodLeftoverRemixFor] : undefined,
  }));
  return withSeedRatings(clones);
}

// ---------------------------------------------------------------------------
// Starting pantry / fridge / freezer inventory
// ---------------------------------------------------------------------------

let invId = 0;
function item(partial: Omit<InventoryItem, "id">): InventoryItem {
  invId += 1;
  return { id: `inv-${invId}`, ...partial };
}

export function buildSeedInventory(): InventoryItem[] {
  invId = 0;
  return [
    // Produce — some fresh items intentionally near use-first territory
    item({ name: "Broccoli", category: "produce", state: "low", useByDate: "2026-08-13" }),
    item({ name: "Cucumber", category: "produce", state: "some", approxAmount: "1, half used", useByDate: "2026-08-14" }),
    item({ name: "Avocado", category: "produce", state: "some", useByDate: "2026-08-12" }),
    item({ name: "Sweet potatoes", category: "produce", state: "some" }),
    item({ name: "Russet potatoes", category: "produce", state: "plenty" }),
    item({ name: "Bell peppers", category: "produce", state: "low" }),
    item({ name: "Lettuce", category: "produce", state: "some", useByDate: "2026-08-15" }),
    item({ name: "Cherry tomatoes", category: "produce", state: "out" }),
    item({ name: "Red onion", category: "produce", state: "some" }),
    item({ name: "Basil", category: "produce", state: "out" }),

    // Meat / freezer
    item({ name: "Chicken breast", category: "meat", state: "some", frozen: true, frozenSinceDate: "2026-07-20" }),
    item({ name: "Smoked sausage", category: "meat", state: "out" }),
    item({ name: "Ground beef", category: "meat", state: "out" }),
    item({ name: "Frozen corn", category: "frozen", state: "plenty" }),
    item({ name: "Frozen hash browns", category: "frozen", state: "plenty" }),

    // Dairy
    item({ name: "Cheddar", category: "dairy", state: "plenty" }),
    item({ name: "Greek yogurt", category: "dairy", state: "some", openedDate: "2026-08-06" }),
    item({ name: "Parmesan", category: "dairy", state: "some" }),
    item({ name: "Feta", category: "dairy", state: "low" }),
    item({ name: "Mozzarella", category: "dairy", state: "low" }),
    item({ name: "Eggs", category: "dairy", state: "plenty" }),
    item({ name: "Butter", category: "dairy", state: "plenty" }),

    // Pantry staples — the reason the shop screen doesn't nag about these
    item({ name: "Rice", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Pasta", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Soy sauce", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Honey", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Olive oil", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Garlic powder", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Chili powder", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Cumin", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Paprika", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Black beans", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "Salsa", category: "pantry", state: "plenty", isStaple: true }),
    item({ name: "BBQ sauce", category: "pantry", state: "some", isStaple: true }),
    item({ name: "Greek dressing", category: "pantry", state: "some", isStaple: true }),
    item({ name: "Chicken gravy packet", category: "pantry", state: "some" }),
    item({ name: "Balsamic glaze", category: "pantry", state: "some" }),

    // Bread
    item({ name: "Bread", category: "bread", state: "some" }),
    item({ name: "Flour tortillas", category: "bread", state: "some" }),
    item({ name: "Flatbread", category: "bread", state: "out" }),

    // Leftovers currently sitting in the fridge
    item({
      name: "Cooked rice",
      category: "pantry",
      state: "some",
      isLeftover: true,
      approxAmount: "1.5 cups",
      openedDate: "2026-08-09",
    }),
  ];
}
