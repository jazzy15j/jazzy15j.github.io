"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import { averageRating, costPerServing, isHouseFavorite, totalCost } from "../lib/engine";
import type { Recipe } from "../lib/types";
import { DifficultyPill } from "./ui/Pills";
import { Sheet } from "./ui/Sheet";
import RateSheet from "./RateSheet";

export default function RecipeDetailSheet({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const { state, addRecipeNote, toggleFavorite, setRetired } = useStore();
  const [note, setNote] = useState("");
  const [rateOpen, setRateOpen] = useState(false);

  const [jazzyName, tristanName] = state.settings.people;
  const favorite = isHouseFavorite(recipe);
  const avg = averageRating(recipe);

  return (
    <Sheet title={recipe.name} onClose={onClose} wide>
      <div className="egsl-row egsl-gap-8 egsl-wrap" style={{ marginBottom: 14 }}>
        <span className="egsl-pill egsl-pill-neutral">${totalCost(recipe).toFixed(2)} for two</span>
        <span className="egsl-pill egsl-pill-neutral">${costPerServing(recipe).toFixed(2)} / serving</span>
        <span className="egsl-pill egsl-pill-neutral">{recipe.timeMinutes} min</span>
        <DifficultyPill difficulty={recipe.difficulty} />
        {favorite && <span className="egsl-pill egsl-pill-house-favorite">House Favorite</span>}
        {recipe.freezerFriendly && <span className="egsl-pill egsl-pill-freezer">Freezer friendly</span>}
        {recipe.retired && <span className="egsl-pill egsl-pill-neutral">Retired</span>}
      </div>

      {recipe.prepAhead && (
        <div className="egsl-today-banner egsl-today-banner-prep">
          <span className="egsl-today-banner-label">Do this earlier</span>
          <span>{recipe.prepAhead}</span>
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
          Ingredients (serves {recipe.servings})
        </p>
        <div style={{ display: "grid", gap: 6 }}>
          {recipe.ingredients.map((ing) => (
            <div key={ing.name} className="egsl-row egsl-between" style={{ fontSize: 13.5 }}>
              <span>
                <strong>{ing.amount}</strong> {ing.name}
                {ing.usesUp && <span className="egsl-faint"> · uses it up</span>}
              </span>
              <span className="egsl-faint">
                ${ing.estCost.toFixed(2)} · {ing.confidence === "exact" ? "exact" : "est."}
              </span>
            </div>
          ))}
        </div>
        {recipe.pantryStaplesUsed.length > 0 && (
          <p className="egsl-faint" style={{ fontSize: 12, marginTop: 10 }}>
            Pantry staples used: {recipe.pantryStaplesUsed.join(", ")}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
          Steps
        </p>
        <ol className="egsl-steps">
          {recipe.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div className="egsl-row egsl-between" style={{ marginBottom: 10 }}>
          <p className="egsl-eyebrow" style={{ margin: 0 }}>
            Ratings {avg !== null && `· avg ${avg}/10`}
          </p>
          <button className="egsl-btn egsl-btn-secondary egsl-btn-sm" onClick={() => setRateOpen(true)}>
            ⭐ Rate this recipe
          </button>
        </div>
        {recipe.ratings.length === 0 ? (
          <p className="egsl-faint" style={{ fontSize: 13 }}>
            Not rated yet — cook it once and let us know how it went.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {[...recipe.ratings].reverse().map((r) => (
              <div key={r.id} className="egsl-card" style={{ padding: "10px 14px", fontSize: 13 }}>
                <div className="egsl-row egsl-between">
                  <span>
                    {jazzyName} {r.jazzy ?? "—"} · {tristanName} {r.tristan ?? "—"}
                  </span>
                  <span className="egsl-faint">{r.verdict}</span>
                </div>
                {r.note && <p style={{ margin: "6px 0 0" }}>{r.note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 18 }}>
        <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
          Notes
        </p>
        {recipe.notes.length > 0 && (
          <ul style={{ margin: "0 0 10px", paddingLeft: 20, fontSize: 13.5, display: "grid", gap: 4 }}>
            {recipe.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
        <div className="egsl-row egsl-gap-8">
          <input
            className="egsl-input"
            placeholder='"Use more sauce next time."'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            className="egsl-btn egsl-btn-secondary"
            onClick={() => {
              if (note.trim()) {
                addRecipeNote(recipe.id, note.trim());
                setNote("");
              }
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="egsl-row egsl-gap-10 egsl-wrap">
        <button className="egsl-btn egsl-btn-secondary" onClick={() => toggleFavorite(recipe.id)}>
          {recipe.manuallyFavorited ? "★ Remove favorite flag" : "☆ Mark House Favorite"}
        </button>
        <button className="egsl-btn egsl-btn-ghost" onClick={() => setRetired(recipe.id, !recipe.retired)}>
          {recipe.retired ? "Bring back into rotation" : "Retire from rotation"}
        </button>
      </div>

      {rateOpen && <RateSheet recipe={recipe} onClose={() => setRateOpen(false)} />}
    </Sheet>
  );
}
