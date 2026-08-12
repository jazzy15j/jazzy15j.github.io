"use client";

import React from "react";
import { useStore } from "../lib/store";
import { getSwapOptions, totalCost } from "../lib/engine";
import type { DayPlan, Recipe } from "../lib/types";
import { Sheet } from "./ui/Sheet";

const SLOT_META: { key: keyof ReturnType<typeof getSwapOptions>; label: string; blurb: string; icon: string }[] = [
  { key: "fastest", label: "Fastest", blurb: "Get dinner done quick", icon: "⚡" },
  { key: "useFirst", label: "Use This First", blurb: "Uses what needs eaten soon", icon: "🥬" },
  { key: "cheapest", label: "Cheapest", blurb: "Lightest on the grocery budget", icon: "💰" },
  { key: "comfort", label: "Comfort Food", blurb: "Something cozy instead", icon: "🍲" },
  { key: "noCook", label: "No Cook", blurb: "Barely touch the stove", icon: "🥪" },
  { key: "pantryOnly", label: "Pantry Only", blurb: "Nothing new to buy", icon: "🗄️" },
];

export default function QuickSwapSheet({
  day,
  currentRecipe,
  onClose,
}: {
  day: DayPlan;
  currentRecipe: Recipe;
  onClose: () => void;
}) {
  const { state, swapDayRecipe } = useStore();
  const options = getSwapOptions(currentRecipe, state.recipes, state.inventory);

  const doSwap = (recipe: Recipe) => {
    swapDayRecipe(day.id, recipe.id);
    onClose();
  };

  const seen = new Set<string>();

  return (
    <Sheet title="Swap tonight's meal" onClose={onClose} wide>
      <p className="egsl-muted egsl-mt-0" style={{ fontSize: 13 }}>
        Don&apos;t want {currentRecipe.name}? Pick a direction — no replanning required.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {SLOT_META.map((slot) => {
          const recipe = options[slot.key];
          if (!recipe || seen.has(recipe.id)) return null;
          seen.add(recipe.id);
          return (
            <button
              key={slot.key}
              onClick={() => doSwap(recipe)}
              className="egsl-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                textAlign: "left",
                border: "1px solid var(--egsl-line)",
                width: "100%",
              }}
            >
              <span style={{ fontSize: 26 }}>{recipe.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--egsl-rust-deep)",
                  }}
                >
                  {slot.icon} {slot.label} · {slot.blurb}
                </span>
                <span style={{ fontFamily: "var(--egsl-font-serif)", fontSize: 18, fontWeight: 600 }}>
                  {recipe.name}
                </span>
                <span className="egsl-faint" style={{ display: "block", fontSize: 12 }}>
                  ${totalCost(recipe).toFixed(2)} for two · {recipe.timeMinutes} min
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button className="egsl-btn egsl-btn-ghost egsl-btn-block" style={{ marginTop: 16 }} onClick={onClose}>
        Never mind, keep {currentRecipe.name}
      </button>
    </Sheet>
  );
}
