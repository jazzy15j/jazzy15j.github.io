"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Recipe } from "../lib/types";

function parseTimerSeconds(step: string): number | null {
  const match = step.match(/(\d+)(?:\s*[–-]\s*(\d+))?\s*min/i);
  if (!match) return null;
  const high = match[2] ? Number(match[2]) : Number(match[1]);
  return high * 60;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function CookMode({
  recipe,
  onClose,
  onDone,
}: {
  recipe: Recipe;
  onClose: () => void;
  onDone: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showIngredients, setShowIngredients] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);

  const step = recipe.steps[stepIndex];
  const suggestedSeconds = useMemo(() => parseTimerSeconds(step), [step]);
  const isLast = stepIndex === recipe.steps.length - 1;

  // Reset the per-step timer during render when the step changes, rather than
  // in an effect — this is the "adjust state on prop change" pattern React
  // recommends, and it avoids an extra cascading render.
  const [renderedStep, setRenderedStep] = useState(stepIndex);
  if (renderedStep !== stepIndex) {
    setRenderedStep(stepIndex);
    setSecondsLeft(null);
    setTimerRunning(false);
  }

  useEffect(() => {
    if (!timerRunning || secondsLeft === null || secondsLeft <= 0) return;
    const id = setTimeout(() => {
      const next = secondsLeft - 1;
      setSecondsLeft(next);
      if (next <= 0) setTimerRunning(false);
    }, 1000);
    return () => clearTimeout(id);
  }, [timerRunning, secondsLeft]);

  useEffect(() => {
    let cancelled = false;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<{ release: () => Promise<void> }> };
    };
    nav.wakeLock
      ?.request("screen")
      .then((lock) => {
        if (cancelled) {
          lock.release().catch(() => {});
        } else {
          wakeLockRef.current = lock;
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      wakeLockRef.current?.release().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setStepIndex((i) => Math.min(recipe.steps.length - 1, i + 1));
      if (e.key === "ArrowLeft") setStepIndex((i) => Math.max(0, i - 1));
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [recipe.steps.length, onClose]);

  return (
    <div className="egsl-cookmode">
      <div className="egsl-cookmode-top">
        <button className="egsl-icon-btn" onClick={onClose} aria-label="Exit cook mode">
          ✕
        </button>
        <span className="egsl-cookmode-title">{recipe.name}</span>
        <button
          className="egsl-icon-btn"
          aria-label="Show ingredient list"
          onClick={() => setShowIngredients((v) => !v)}
        >
          📋
        </button>
      </div>

      {showIngredients ? (
        <div className="egsl-cookmode-ingredients">
          <h3>Ingredients for two</h3>
          <ul>
            {recipe.ingredients.map((ing) => (
              <li key={ing.name}>
                <strong>{ing.amount}</strong> {ing.name}
              </li>
            ))}
          </ul>
          <button className="egsl-btn egsl-btn-secondary" onClick={() => setShowIngredients(false)}>
            Back to steps
          </button>
        </div>
      ) : (
        <>
          <div className="egsl-cookmode-progress">
            STEP {stepIndex + 1} OF {recipe.steps.length}
          </div>

          <div className="egsl-cookmode-step">{step}</div>

          {suggestedSeconds && (
            <div className="egsl-cookmode-timer">
              <div className="egsl-cookmode-timer-display">
                {formatTime(secondsLeft ?? suggestedSeconds)}
              </div>
              <div className="egsl-row egsl-gap-10">
                {!timerRunning ? (
                  <button
                    className="egsl-btn egsl-btn-sage"
                    onClick={() => {
                      setSecondsLeft(secondsLeft ?? suggestedSeconds);
                      setTimerRunning(true);
                    }}
                  >
                    {secondsLeft ? "Resume timer" : "Start timer"}
                  </button>
                ) : (
                  <button className="egsl-btn egsl-btn-secondary" onClick={() => setTimerRunning(false)}>
                    Pause
                  </button>
                )}
                {secondsLeft !== null && (
                  <button
                    className="egsl-btn egsl-btn-ghost"
                    onClick={() => {
                      setSecondsLeft(null);
                      setTimerRunning(false);
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
              {secondsLeft === 0 && <p className="egsl-cookmode-timer-done">⏰ Time&apos;s up!</p>}
            </div>
          )}

          <div className="egsl-cookmode-nav">
            <button
              className="egsl-btn egsl-btn-secondary egsl-btn-block"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              ← Previous
            </button>
            {!isLast ? (
              <button
                className="egsl-btn egsl-btn-primary egsl-btn-block"
                onClick={() => setStepIndex((i) => Math.min(recipe.steps.length - 1, i + 1))}
              >
                Next →
              </button>
            ) : (
              <button
                className="egsl-btn egsl-btn-primary egsl-btn-block"
                onClick={() => {
                  onDone();
                  onClose();
                }}
              >
                Done cooking 🎉
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
