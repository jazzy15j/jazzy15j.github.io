"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import { suggestLeftoverUse } from "../lib/engine";
import type { DayPlan, LeftoverAmount, Recipe } from "../lib/types";
import { Sheet } from "./ui/Sheet";

const OPTIONS: { id: LeftoverAmount; label: string }[] = [
  { id: "none", label: "None" },
  { id: "one", label: "About 1 serving" },
  { id: "two", label: "About 2 servings" },
  { id: "a-lot", label: "A lot" },
];

export default function LeftoverSheet({
  day,
  recipe,
  onClose,
}: {
  day: DayPlan;
  recipe: Recipe;
  onClose: () => void;
}) {
  const { state, markLeftovers } = useStore();
  const [amount, setAmount] = useState<LeftoverAmount>(day.leftovers ?? "none");
  const suggestion = suggestLeftoverUse(recipe, amount, state.recipes);

  return (
    <Sheet title="Leftovers?" onClose={onClose}>
      <p className="egsl-muted egsl-mt-0" style={{ fontSize: 13 }}>
        From tonight&apos;s {recipe.name}.
      </p>

      <div className="egsl-segmented" style={{ marginBottom: 16 }}>
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            className={amount === o.id ? "active" : ""}
            onClick={() => setAmount(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {suggestion && amount !== "none" && (
        <div
          className="egsl-card"
          style={{ padding: 14, marginBottom: 16, background: "var(--egsl-cream-deep)" }}
        >
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: "var(--egsl-sage-deep)" }}>
            AUTOMATIC PLAN
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 14 }}>{suggestion}</p>
        </div>
      )}

      <button
        className="egsl-btn egsl-btn-primary egsl-btn-block"
        onClick={() => {
          markLeftovers(day.id, amount, amount !== "none" ? suggestion : undefined);
          onClose();
        }}
      >
        Save
      </button>
    </Sheet>
  );
}
