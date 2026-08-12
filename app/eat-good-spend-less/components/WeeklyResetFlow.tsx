"use client";

import React, { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import type { StockState } from "../lib/types";
import { Sheet } from "./ui/Sheet";

const CHOICES: { value: StockState; label: string }[] = [
  { value: "plenty", label: "Yes" },
  { value: "low", label: "Low" },
  { value: "out", label: "No" },
];

export default function WeeklyResetFlow({ onClose }: { onClose: () => void }) {
  const { state, runWeeklyReset } = useStore();

  const questionItems = useMemo(
    () =>
      state.inventory
        .filter((i) => i.state !== "out" && !i.isLeftover)
        .filter((i) => i.isStaple || i.category === "dairy" || i.category === "frozen" || i.category === "bread")
        .slice(0, 8),
    [state.inventory],
  );

  const [answers, setAnswers] = useState<Record<string, StockState>>(() => {
    const initial: Record<string, StockState> = {};
    for (const item of questionItems) initial[item.id] = item.state;
    return initial;
  });
  const [hasLeftovers, setHasLeftovers] = useState<boolean | null>(null);
  const [extraNote, setExtraNote] = useState("");
  const [done, setDone] = useState(false);

  const build = () => {
    const updates = Object.entries(answers).map(([id, s]) => ({ id, state: s }));
    const extras = extraNote
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (hasLeftovers) extras.push("Cooked leftovers");
    runWeeklyReset(updates, extras);
    setDone(true);
  };

  if (done) {
    return (
      <Sheet title="Next week is ready" onClose={onClose}>
        <div className="egsl-center-text" style={{ padding: "20px 0" }}>
          <p style={{ fontSize: 40, margin: 0 }}>🎉</p>
          <p style={{ fontSize: 15, margin: "10px 0 20px" }}>
            Seven dinners are planned, priced, and built around what you already have.
          </p>
          <button className="egsl-btn egsl-btn-primary egsl-btn-block" onClick={onClose}>
            See this week
          </button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet title="What's left?" onClose={onClose} wide>
      <p className="egsl-muted egsl-mt-0" style={{ fontSize: 13 }}>
        Answer what you can in a few taps. Everything else carries forward automatically.
      </p>

      <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {questionItems.map((item) => (
          <div key={item.id} className="egsl-row egsl-between" style={{ padding: "8px 2px" }}>
            <span style={{ fontSize: 14, fontWeight: 650 }}>Still have {item.name.toLowerCase()}?</span>
            <div className="egsl-segmented egsl-segmented-compact" style={{ maxWidth: 220 }}>
              {CHOICES.map((c) => (
                <button
                  key={c.value}
                  className={answers[item.id] === c.value ? "active" : ""}
                  onClick={() => setAnswers((a) => ({ ...a, [item.id]: c.value }))}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="egsl-row egsl-between" style={{ padding: "8px 2px", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 650 }}>Any cooked leftovers sitting around?</span>
        <div className="egsl-segmented egsl-segmented-compact" style={{ maxWidth: 150 }}>
          <button className={hasLeftovers === true ? "active" : ""} onClick={() => setHasLeftovers(true)}>
            Yes
          </button>
          <button className={hasLeftovers === false ? "active" : ""} onClick={() => setHasLeftovers(false)}>
            No
          </button>
        </div>
      </div>

      <div className="egsl-field">
        <label>Anything you know needs used? (comma separated)</label>
        <input
          className="egsl-input"
          placeholder="half an onion, leftover pasta sauce"
          value={extraNote}
          onChange={(e) => setExtraNote(e.target.value)}
        />
      </div>

      <button className="egsl-btn egsl-btn-primary egsl-btn-block" onClick={build}>
        Build next week
      </button>
    </Sheet>
  );
}
