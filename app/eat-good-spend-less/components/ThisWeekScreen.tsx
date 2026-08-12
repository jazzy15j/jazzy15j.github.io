"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../lib/store";
import { ARCHETYPE_LABEL, findRecipe, totalCost } from "../lib/engine";
import { monthDay, todayISO } from "../lib/dates";
import type { DayPlan } from "../lib/types";
import { DifficultyPill, TagPills } from "./ui/Pills";
import QuickSwapSheet from "./QuickSwapSheet";
import WeeklyResetFlow from "./WeeklyResetFlow";

export default function ThisWeekScreen() {
  const { state, reorderWeek } = useStore();
  const today = todayISO();
  const [swapDay, setSwapDay] = useState<DayPlan | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (dragIndex === null) return;

    const handleMove = (e: PointerEvent) => {
      setDragY(e.clientY - startYRef.current);
      let closest: { index: number; dist: number } | null = null;
      cardRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(e.clientY - center);
        if (!closest || dist < closest.dist) closest = { index: idx, dist };
      });
      if (closest) setOverIndex((closest as { index: number }).index);
    };

    const handleUp = () => {
      if (dragIndex !== null && overIndex !== null && overIndex !== dragIndex) {
        reorderWeek(dragIndex, overIndex);
      }
      setDragIndex(null);
      setOverIndex(null);
      setDragY(0);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragIndex, overIndex, reorderWeek]);

  return (
    <div style={{ paddingTop: 22 }}>
      <div className="egsl-row egsl-between egsl-wrap egsl-gap-10" style={{ marginBottom: 4 }}>
        <div>
          <p className="egsl-eyebrow">This week</p>
          <h1 className="egsl-page-title">
            {monthDay(state.currentWeek.weekStartDate)} –{" "}
            {monthDay(state.currentWeek.days[6]?.date ?? state.currentWeek.weekStartDate)}
          </h1>
        </div>
        <button className="egsl-btn egsl-btn-secondary" onClick={() => setResetOpen(true)}>
          🔄 60-second weekly reset
        </button>
      </div>
      <p className="egsl-page-sub">
        Drag the handle to rearrange dinners. Use-first priority and the shopping list update
        automatically.
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        {state.currentWeek.days.map((day, idx) => {
          const recipe = findRecipe(state.recipes, day.recipeId);
          if (!recipe) return null;
          const isToday = day.date === today;
          const isPast = day.date < today;
          const usesUp = recipe.ingredients.filter((i) => i.usesUp);
          const isDragging = dragIndex === idx;
          const isOver = overIndex === idx && dragIndex !== null && dragIndex !== idx;

          return (
            <div
              key={day.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="egsl-card egsl-week-card"
              style={{
                borderColor: isToday ? "var(--egsl-rust)" : isOver ? "var(--egsl-sage)" : undefined,
                opacity: isPast && !isToday ? 0.72 : 1,
                transform: isDragging ? `translateY(${dragY}px) scale(1.02)` : undefined,
                zIndex: isDragging ? 5 : undefined,
                boxShadow: isDragging ? "0 20px 40px -16px var(--egsl-shadow)" : undefined,
              }}
            >
              <div className="egsl-week-card-top">
                <button
                  className="egsl-drag-handle"
                  aria-label={`Reorder ${day.dayLabel}`}
                  onPointerDown={(e) => {
                    startYRef.current = e.clientY;
                    setDragIndex(idx);
                    setOverIndex(idx);
                  }}
                >
                  ⠿
                </button>
                <div className="egsl-week-card-day">
                  <span className="egsl-week-day-label">
                    {day.dayLabel}
                    {isToday && <span className="egsl-today-flag">Today</span>}
                  </span>
                  <span className="egsl-faint" style={{ fontSize: 11.5 }}>
                    {monthDay(day.date)} · {ARCHETYPE_LABEL[day.archetype]}
                  </span>
                </div>
              </div>

              <button
                className="egsl-week-card-body"
                onClick={() => setSwapDay(day)}
                aria-label={`View or swap ${recipe.name}`}
              >
                <span style={{ fontSize: 30 }}>{recipe.icon}</span>
                <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--egsl-font-serif)",
                      fontSize: 20,
                      fontWeight: 600,
                    }}
                  >
                    {recipe.name}
                  </span>
                  <span className="egsl-row egsl-wrap egsl-gap-6" style={{ marginTop: 6 }}>
                    <span className="egsl-pill egsl-pill-neutral">${totalCost(recipe).toFixed(2)}</span>
                    <span className="egsl-pill egsl-pill-neutral">{recipe.timeMinutes} min</span>
                    <DifficultyPill difficulty={recipe.difficulty} />
                    <span className="egsl-pill egsl-pill-neutral">{recipe.mainProtein}</span>
                  </span>
                </span>
              </button>

              {usesUp.length > 0 && (
                <p className="egsl-week-meta">
                  <strong>Uses up:</strong> {usesUp.map((u) => u.name).join(", ")}
                </p>
              )}
              <p className="egsl-week-meta">
                <strong>Leftovers:</strong>{" "}
                {day.leftoverPlan ??
                  (recipe.leftoverQuality === "great"
                    ? "Great leftovers expected"
                    : recipe.leftoverQuality === "ok"
                      ? "Some leftovers likely"
                      : "Rarely leaves leftovers")}
              </p>

              <TagPills tags={day.tags} />
            </div>
          );
        })}
      </div>

      {swapDay && (() => {
        const swapRecipe = findRecipe(state.recipes, swapDay.recipeId);
        return swapRecipe ? (
          <QuickSwapSheet day={swapDay} currentRecipe={swapRecipe} onClose={() => setSwapDay(null)} />
        ) : null;
      })()}
      {resetOpen && <WeeklyResetFlow onClose={() => setResetOpen(false)} />}
    </div>
  );
}
