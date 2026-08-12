"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import {
  costPerServing,
  findInventoryByName,
  findRecipe,
  getUseFirstList,
  totalCost,
} from "../lib/engine";
import { addDays, fullWeekdayName, monthDay, todayISO } from "../lib/dates";
import type { DayPlan } from "../lib/types";
import { DifficultyPill, TagPills } from "./ui/Pills";
import CookMode from "./CookMode";
import QuickSwapSheet from "./QuickSwapSheet";
import RateSheet from "./RateSheet";
import LeftoverSheet from "./LeftoverSheet";
import type { Screen } from "./AppShell";

function findDay(days: DayPlan[], iso: string): DayPlan | undefined {
  return days.find((d) => d.date === iso);
}

export default function TodayScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const { state, setDayAteSomethingElse, markCooked } = useStore();
  const today = todayISO();
  const tomorrowISO = addDays(today, 1);

  const [cookModeOpen, setCookModeOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);
  const [leftoverOpen, setLeftoverOpen] = useState(false);

  const day = findDay(state.currentWeek.days, today) ?? state.currentWeek.days[0];
  const recipe = findRecipe(state.recipes, day.recipeId);
  const tomorrowDay = findDay(state.currentWeek.days, tomorrowISO);
  const tomorrowRecipe = tomorrowDay ? findRecipe(state.recipes, tomorrowDay.recipeId) : undefined;

  if (!recipe) {
    return <div className="egsl-empty">Couldn&apos;t find tonight&apos;s recipe. Try Reset demo data in Settings.</div>;
  }

  const useFirst = getUseFirstList(state.inventory).slice(0, 4);

  const recipeIngredientNames = new Set(recipe.ingredients.map((i) => i.name.toLowerCase()));
  const missing = recipe.ingredients.filter((ing) => {
    const stock = findInventoryByName(state.inventory, ing.name);
    return stock?.state === "out";
  });
  const haveList = recipe.ingredients.filter((ing) => {
    const stock = findInventoryByName(state.inventory, ing.name);
    return !stock || stock.state !== "out";
  });

  const optionalAdd = useFirst.find(
    (e) => e.item.category === "produce" && !recipeIngredientNames.has(e.item.name.toLowerCase()),
  );

  const breakfastPick = state.recipes.find((r) => r.archetype === "breakfast" && !r.retired);

  return (
    <div>
      <div style={{ paddingTop: 22 }}>
        <p className="egsl-eyebrow">Today · {fullWeekdayName(today)}</p>
        <h1 className="egsl-page-title">{monthDay(today)}</h1>
      </div>

      {breakfastPick && (
        <p className="egsl-muted" style={{ fontSize: 13, marginBottom: 20 }}>
          Breakfast idea: <strong>{breakfastPick.name}</strong> · {breakfastPick.timeMinutes} min
        </p>
      )}

      <section className="egsl-card" style={{ padding: "24px 22px", marginBottom: 18 }}>
        <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
          Dinner
        </p>

        <div className="egsl-row egsl-gap-12" style={{ alignItems: "flex-start", marginBottom: 12 }}>
          <span style={{ fontSize: 44, lineHeight: 1 }}>{recipe.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "var(--egsl-font-serif)", fontSize: "clamp(24px,4vw,32px)", margin: "0 0 8px", lineHeight: 1.1 }}>
              {recipe.name}
            </h2>
            <div className="egsl-row egsl-wrap egsl-gap-8">
              <span className="egsl-pill egsl-pill-neutral">${totalCost(recipe).toFixed(2)} for two</span>
              <span className="egsl-pill egsl-pill-neutral">${costPerServing(recipe).toFixed(2)} / person</span>
              <span className="egsl-pill egsl-pill-neutral">{recipe.timeMinutes} min</span>
              <DifficultyPill difficulty={recipe.difficulty} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <TagPills tags={day.tags} />
        </div>

        {day.ateSomethingElse && (
          <div
            className="egsl-row egsl-between"
            style={{
              background: "var(--egsl-cream-deep)",
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 14,
              fontSize: 13,
            }}
          >
            <span>You marked tonight as &ldquo;ate something else.&rdquo;</span>
            <button className="egsl-btn egsl-btn-ghost egsl-btn-sm" onClick={() => setDayAteSomethingElse(day.id, false)}>
              Undo
            </button>
          </div>
        )}

        {recipe.prepAhead && (
          <div className="egsl-today-banner egsl-today-banner-prep">
            <span className="egsl-today-banner-label">Do this earlier</span>
            <span>{recipe.prepAhead}</span>
          </div>
        )}

        {missing.length > 0 && (
          <div className="egsl-today-banner egsl-today-banner-warn">
            <span className="egsl-today-banner-label">Missing</span>
            <span>
              {missing.map((m) => m.name).join(", ")} — grab it today or{" "}
              <button className="egsl-inline-link" onClick={() => setSwapOpen(true)}>
                swap tonight&apos;s meal
              </button>
              .
            </span>
          </div>
        )}

        {useFirst.length > 0 && (
          <div className="egsl-today-banner egsl-today-banner-use-first">
            <span className="egsl-today-banner-label">Use first</span>
            <span>
              {useFirst.map((e) => e.item.name).join(" · ")}
            </span>
          </div>
        )}

        <div style={{ margin: "18px 0" }}>
          <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
            Tonight
          </p>
          <ol className="egsl-steps">
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div style={{ marginBottom: 6 }}>
          <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
            You already have
          </p>
          <div className="egsl-row egsl-wrap egsl-gap-8">
            {haveList.map((ing) => (
              <span key={ing.name} className="egsl-chip">
                {ing.name}
              </span>
            ))}
          </div>
        </div>

        {optionalAdd && (
          <p className="egsl-muted" style={{ fontSize: 13, marginTop: 14, marginBottom: 0 }}>
            <strong>Optional:</strong> add {optionalAdd.item.name.toLowerCase()} if ripe.
          </p>
        )}
      </section>

      <div className="egsl-today-actions">
        <button className="egsl-btn egsl-btn-primary egsl-btn-block" onClick={() => setCookModeOpen(true)}>
          👩‍🍳 Cooking now
        </button>
        <div className="egsl-row egsl-wrap egsl-gap-8" style={{ marginTop: 10 }}>
          <button className="egsl-btn egsl-btn-secondary" onClick={() => setSwapOpen(true)}>
            🔄 Swap meal
          </button>
          <button
            className="egsl-btn egsl-btn-secondary"
            onClick={() => setDayAteSomethingElse(day.id, !day.ateSomethingElse)}
          >
            🥡 We ate something else
          </button>
          <button className="egsl-btn egsl-btn-secondary" onClick={() => setRateOpen(true)}>
            ⭐ Rate dinner
          </button>
          <button className="egsl-btn egsl-btn-secondary" onClick={() => setLeftoverOpen(true)}>
            🍱 Mark leftovers
          </button>
        </div>
      </div>

      <section className="egsl-card egsl-tomorrow-card" onClick={() => onNavigate("week")}>
        <p className="egsl-eyebrow" style={{ marginBottom: 8 }}>
          Tomorrow
        </p>
        {tomorrowRecipe ? (
          <div className="egsl-row egsl-gap-12">
            <span style={{ fontSize: 26 }}>{tomorrowRecipe.icon}</span>
            <div>
              <p style={{ margin: 0, fontFamily: "var(--egsl-font-serif)", fontSize: 19, fontWeight: 600 }}>
                {tomorrowRecipe.name}
              </p>
              <p className="egsl-faint" style={{ margin: "2px 0 0", fontSize: 12.5 }}>
                {tomorrowRecipe.prepAhead ?? "No prep needed."}
              </p>
            </div>
          </div>
        ) : (
          <p className="egsl-muted" style={{ margin: 0, fontSize: 13 }}>
            Next week isn&apos;t planned yet — a 60-second reset will sort it out.
          </p>
        )}
      </section>

      {cookModeOpen && (
        <CookMode
          recipe={recipe}
          onClose={() => setCookModeOpen(false)}
          onDone={() => markCooked(day.id)}
        />
      )}
      {swapOpen && <QuickSwapSheet day={day} currentRecipe={recipe} onClose={() => setSwapOpen(false)} />}
      {rateOpen && <RateSheet recipe={recipe} onClose={() => setRateOpen(false)} />}
      {leftoverOpen && <LeftoverSheet day={day} recipe={recipe} onClose={() => setLeftoverOpen(false)} />}
    </div>
  );
}
