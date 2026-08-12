"use client";

import React, { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { ARCHETYPE_LABEL, isHouseFavorite, totalCost } from "../lib/engine";
import { usePhotoObjectUrl } from "../lib/photoStore";
import type { DayArchetype, Recipe } from "../lib/types";
import { DifficultyPill } from "./ui/Pills";
import RecipeDetailSheet from "./RecipeDetailSheet";
import AddRecipeSheet from "./AddRecipeSheet";

type Filter = "all" | "favorites" | DayArchetype;

function RecipeThumb({ recipe }: { recipe: Recipe }) {
  const url = usePhotoObjectUrl(recipe.photoId);
  if (url) {
    return (
      <span className="egsl-recipe-card-photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs from IndexedDB */}
        <img src={url} alt="" />
      </span>
    );
  }
  return <span style={{ fontSize: 34 }}>{recipe.icon}</span>;
}

export default function RecipesScreen() {
  const { state } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [showRetired, setShowRetired] = useState(false);
  const [query, setQuery] = useState("");
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [addRecipeOpen, setAddRecipeOpen] = useState(false);

  const archetypesPresent = useMemo(() => {
    const set = new Set(state.recipes.map((r) => r.archetype));
    return [...set];
  }, [state.recipes]);

  const filtered = state.recipes.filter((r) => {
    if (!showRetired && r.retired) return false;
    if (filter === "favorites" && !isHouseFavorite(r)) return false;
    if (filter !== "all" && filter !== "favorites" && r.archetype !== filter) return false;
    if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ paddingTop: 22 }}>
      <div className="egsl-row egsl-between egsl-wrap egsl-gap-10">
        <div>
          <p className="egsl-eyebrow">Recipes</p>
          <h1 className="egsl-page-title">The recipe bank</h1>
        </div>
        <button className="egsl-btn egsl-btn-primary" onClick={() => setAddRecipeOpen(true)}>
          + Add recipe
        </button>
      </div>
      <p className="egsl-page-sub">
        Rate a dinner and the good ones rise, the duds quietly fade — the rotation learns your taste.
      </p>

      <input
        className="egsl-input"
        placeholder="Search recipes…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 14, maxWidth: 320 }}
      />

      <div className="egsl-row egsl-wrap egsl-gap-8" style={{ marginBottom: 20 }}>
        <button className={`egsl-filter-chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All
        </button>
        <button
          className={`egsl-filter-chip ${filter === "favorites" ? "active" : ""}`}
          onClick={() => setFilter("favorites")}
        >
          ⭐ House Favorites
        </button>
        {archetypesPresent.map((a) => (
          <button key={a} className={`egsl-filter-chip ${filter === a ? "active" : ""}`} onClick={() => setFilter(a)}>
            {ARCHETYPE_LABEL[a]}
          </button>
        ))}
        <label className="egsl-check-row" style={{ marginLeft: "auto" }}>
          <input type="checkbox" checked={showRetired} onChange={(e) => setShowRetired(e.target.checked)} />
          Show retired
        </label>
      </div>

      <div className="egsl-recipe-grid">
        {filtered.map((recipe) => {
          const favorite = isHouseFavorite(recipe);
          return (
            <button key={recipe.id} className="egsl-recipe-card" onClick={() => setOpenRecipe(recipe)}>
              {favorite && <span className="egsl-recipe-favorite-flag">★ Favorite</span>}
              <RecipeThumb recipe={recipe} />
              <span className="egsl-recipe-card-name">{recipe.name}</span>
              <span className="egsl-faint" style={{ fontSize: 11.5 }}>
                {recipe.mainProtein} · {ARCHETYPE_LABEL[recipe.archetype]}
              </span>
              <span className="egsl-row egsl-wrap egsl-gap-6" style={{ marginTop: 8 }}>
                <span className="egsl-pill egsl-pill-neutral">${totalCost(recipe).toFixed(2)}</span>
                <span className="egsl-pill egsl-pill-neutral">{recipe.timeMinutes} min</span>
                <DifficultyPill difficulty={recipe.difficulty} />
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="egsl-empty">No recipes match that filter.</div>}

      {openRecipe && <RecipeDetailSheet recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
      {addRecipeOpen && <AddRecipeSheet onClose={() => setAddRecipeOpen(false)} />}
    </div>
  );
}
