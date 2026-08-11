"use client";

import React, { useMemo } from "react";
import { useStore } from "../lib/store";
import { buildGroceryList, CATEGORY_LABEL, GROCERY_CATEGORY_ORDER } from "../lib/engine";
import type { GroceryLine } from "../lib/engine";

const CATEGORY_ICON: Record<string, string> = {
  produce: "🥬",
  meat: "🍗",
  dairy: "🧀",
  frozen: "🧊",
  pantry: "🥫",
  bread: "🍞",
  other: "🧾",
};

function GroceryRow({ line }: { line: GroceryLine }) {
  const { state, setGroceryFlag } = useStore();
  const checked = !!state.currentWeek.groceryChecked[line.key];
  const have = !!state.currentWeek.groceryHave[line.key];
  const skip = !!state.currentWeek.grocerySkip[line.key];
  const resolved = have || skip;

  return (
    <div className={`egsl-grocery-row ${resolved ? "resolved" : ""}`}>
      <button
        className={`egsl-checkbox ${checked ? "checked" : ""}`}
        aria-label={checked ? "Uncheck" : "Check off"}
        onClick={() => setGroceryFlag(line.key, "checked", !checked)}
        disabled={resolved}
      >
        {checked && "✓"}
      </button>

      <div className="egsl-grocery-info">
        <span className="egsl-grocery-name">
          {line.name}
          {line.restockOnly && <span className="egsl-faint"> · restock</span>}
        </span>
        <span className="egsl-faint" style={{ fontSize: 11.5 }}>
          {line.amounts.filter((a) => a !== "restock").join(" + ") || "as needed"}
          {line.recipeNames.length > 0 && <> · for {line.recipeNames.join(", ")}</>}
        </span>
      </div>

      <div className="egsl-grocery-cost">
        <span>${line.estCost.toFixed(2)}</span>
        <span className="egsl-faint" style={{ fontSize: 10 }}>
          {line.confidence === "exact" ? "Exact" : "Est."}
        </span>
      </div>

      <div className="egsl-grocery-actions">
        {!resolved ? (
          <>
            <button className="egsl-btn egsl-btn-ghost egsl-btn-sm" onClick={() => setGroceryFlag(line.key, "have", true)}>
              Have it
            </button>
            <button className="egsl-btn egsl-btn-ghost egsl-btn-sm" onClick={() => setGroceryFlag(line.key, "skip", true)}>
              Skip
            </button>
          </>
        ) : (
          <button
            className="egsl-btn egsl-btn-ghost egsl-btn-sm"
            onClick={() => {
              setGroceryFlag(line.key, "have", false);
              setGroceryFlag(line.key, "skip", false);
            }}
          >
            Undo ({have ? "had it" : "skipped"})
          </button>
        )}
      </div>
    </div>
  );
}

export default function ShopScreen() {
  const { state } = useStore();
  const list = useMemo(
    () => buildGroceryList(state.currentWeek, state.recipes, state.inventory),
    [state.currentWeek, state.recipes, state.inventory],
  );

  const budgetTarget = state.currentWeek.budgetTarget;
  const remaining = Math.round((budgetTarget - list.estimatedCart) * 100) / 100;
  const under = remaining >= 0;

  const grouped = GROCERY_CATEGORY_ORDER.map((cat) => ({
    cat,
    lines: list.lines.filter((l) => l.category === cat),
  })).filter((g) => g.lines.length > 0);

  return (
    <div style={{ paddingTop: 22 }}>
      <p className="egsl-eyebrow">Shop</p>
      <h1 className="egsl-page-title">Grocery list</h1>
      <p className="egsl-page-sub">Built automatically from this week&apos;s dinners and what&apos;s already in the kitchen.</p>

      <div className="egsl-card egsl-budget-card">
        <div>
          <span className="egsl-budget-label">Weekly target</span>
          <span className="egsl-budget-value">${budgetTarget.toFixed(2)}</span>
        </div>
        <div>
          <span className="egsl-budget-label">Estimated cart</span>
          <span className="egsl-budget-value">${list.estimatedCart.toFixed(2)}</span>
        </div>
        <div>
          <span className="egsl-budget-label">{under ? "Under budget" : "Over budget"}</span>
          <span className="egsl-budget-value" style={{ color: under ? "var(--egsl-sage-deep)" : "var(--egsl-berry)" }}>
            ${Math.abs(remaining).toFixed(2)}
          </span>
        </div>
      </div>

      {list.doNotBuyAgain.length > 0 && (
        <div className="egsl-card" style={{ padding: "14px 18px", marginBottom: 20, background: "var(--egsl-cream-deep)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 11.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--egsl-sage-deep)" }}>
            Do not buy again — already stocked
          </p>
          <div className="egsl-row egsl-wrap egsl-gap-8">
            {list.doNotBuyAgain.map((name) => (
              <span key={name} className="egsl-chip">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {grouped.length === 0 ? (
        <div className="egsl-empty">Nothing to buy — the kitchen already has this week covered. 🎉</div>
      ) : (
        grouped.map((g) => (
          <section key={g.cat} style={{ marginBottom: 22 }}>
            <h3 className="egsl-grocery-category">
              {CATEGORY_ICON[g.cat]} {CATEGORY_LABEL[g.cat]}{" "}
              <span className="egsl-faint" style={{ fontWeight: 600 }}>
                ({g.lines.length})
              </span>
            </h3>
            <div className="egsl-card" style={{ padding: "4px 6px" }}>
              {g.lines.map((line) => (
                <GroceryRow key={line.key} line={line} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
