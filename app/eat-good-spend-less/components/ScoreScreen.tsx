"use client";

import React, { useMemo } from "react";
import { useStore } from "../lib/store";
import {
  addSpendTierPoints,
  buildGroceryList,
  computeMonthlyStats,
  computeWeeklyScore,
} from "../lib/engine";
import { todayISO } from "../lib/dates";

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="egsl-stat-tile">
      <span className="egsl-budget-label">{label}</span>
      <span className="egsl-budget-value">{value}</span>
      {sub && (
        <span className="egsl-faint" style={{ fontSize: 11 }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export default function ScoreScreen() {
  const { state } = useStore();
  const today = todayISO();

  const groceryList = useMemo(
    () => buildGroceryList(state.currentWeek, state.recipes, state.inventory),
    [state.currentWeek, state.recipes, state.inventory],
  );

  const weeklyScore = useMemo(() => {
    const base = computeWeeklyScore(state.currentWeek, state.recipes, state.inventory, today);
    return addSpendTierPoints(base, groceryList.estimatedCart, state.currentWeek.budgetTarget);
  }, [state.currentWeek, state.recipes, state.inventory, today, groceryList.estimatedCart]);

  const overdueWaste = state.inventory.some(
    (i) => i.category === "produce" && i.state !== "out" && i.useByDate && i.useByDate < today,
  );

  const monthly = useMemo(
    () =>
      computeMonthlyStats(
        [...state.weekHistory, state.currentWeek],
        state.recipes,
        state.settings.budgetTarget,
      ),
    [state.weekHistory, state.currentWeek, state.recipes, state.settings.budgetTarget],
  );

  return (
    <div style={{ paddingTop: 22 }}>
      <p className="egsl-eyebrow">Score</p>
      <h1 className="egsl-page-title">How this week&apos;s going</h1>
      <p className="egsl-page-sub">
        Points reward using what you have and sticking near budget — never skipping meals or eating
        too little.
      </p>

      <section className="egsl-card" style={{ padding: "22px 22px 18px", marginBottom: 20 }}>
        <div className="egsl-row egsl-between" style={{ marginBottom: 16 }}>
          <div>
            <span className="egsl-budget-label">This week&apos;s points</span>
            <p style={{ fontFamily: "var(--egsl-font-serif)", fontSize: 42, fontWeight: 600, margin: "2px 0 0" }}>
              {weeklyScore.points}
            </p>
          </div>
          <span style={{ fontSize: 44 }}>🏆</span>
        </div>

        {weeklyScore.breakdown.length === 0 ? (
          <p className="egsl-faint" style={{ fontSize: 13 }}>
            Points show up as the week unfolds — cook a planned dinner, use up leftovers, or stay under
            budget.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {weeklyScore.breakdown.map((b, i) => (
              <div key={i} className="egsl-row egsl-between" style={{ fontSize: 13.5 }}>
                <span>{b.label}</span>
                <span style={{ fontWeight: 800, color: "var(--egsl-sage-deep)" }}>+{b.points}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="egsl-stat-grid" style={{ marginBottom: 22 }}>
        <StatTile label="Estimated spend" value={`$${groceryList.estimatedCart.toFixed(2)}`} />
        <StatTile
          label={weeklyScore.budgetRemaining >= 0 ? "Budget remaining" : "Over budget"}
          value={`$${Math.abs(weeklyScore.budgetRemaining).toFixed(2)}`}
        />
        <StatTile label="Meals cooked" value={`${weeklyScore.mealsCooked}`} sub="so far this week" />
        <StatTile label="Leftover nights" value={`${weeklyScore.leftoversUsed}`} />
        <StatTile label="Takeout avoided" value={`${weeklyScore.takeoutAvoided}`} sub="days, so far" />
        <StatTile label="Food waste flagged" value={overdueWaste ? "Yes" : "None"} />
      </div>

      <section className="egsl-card" style={{ padding: "22px" }}>
        <p className="egsl-eyebrow" style={{ marginBottom: 14 }}>
          Monthly picture · {monthly.weeksTracked} week{monthly.weeksTracked === 1 ? "" : "s"} tracked
        </p>
        <div className="egsl-stat-grid">
          <StatTile label="Estimated dinner cost total" value={`$${monthly.totalDinnerCost.toFixed(2)}`} sub="planned recipe cost, all weeks" />
          <StatTile label="Average weekly cost" value={`$${monthly.averageWeeklyCost.toFixed(2)}`} />
          <StatTile label="Average dinner cost" value={`$${monthly.averageDinnerCost.toFixed(2)}`} />
          <StatTile
            label={monthly.estimatedSavings >= 0 ? "Estimated savings" : "Over target"}
            value={`$${Math.abs(monthly.estimatedSavings).toFixed(2)}`}
            sub={`vs. $${state.settings.budgetTarget}/week target`}
          />
          <StatTile label="Favorite meal" value={monthly.favoriteMeal?.name ?? "Not enough ratings yet"} sub={monthly.favoriteMeal ? `avg ${monthly.favoriteMeal.avg}/10` : undefined} />
          <StatTile label="Most-used ingredient" value={monthly.mostUsedIngredient?.name ?? "—"} sub={monthly.mostUsedIngredient ? `${monthly.mostUsedIngredient.count} recipes` : undefined} />
        </div>
        <p className="egsl-faint" style={{ fontSize: 11.5, marginTop: 14, marginBottom: 0 }}>
          Estimates, not receipts — costs are built from recipe ingredient pricing, not scanned
          groceries.
        </p>
      </section>
    </div>
  );
}
