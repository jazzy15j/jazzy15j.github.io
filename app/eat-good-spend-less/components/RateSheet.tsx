"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import type { Recipe } from "../lib/types";
import { Sheet } from "./ui/Sheet";

function RatingRow({
  person,
  value,
  onChange,
}: {
  person: string;
  value: number | null;
  onChange: (n: number) => void;
}) {
  return (
    <div className="egsl-field">
      <label>{person}</label>
      <div className="egsl-row egsl-wrap egsl-gap-6">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="egsl-btn egsl-btn-sm"
            style={{
              minWidth: 34,
              padding: "8px 0",
              background: value === n ? "var(--egsl-rust)" : "var(--egsl-paper)",
              color: value === n ? "#fff6fa" : "var(--egsl-ink-soft)",
              border: "1.5px solid " + (value === n ? "var(--egsl-rust)" : "var(--egsl-line)"),
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RateSheet({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const { state, rateRecipe } = useStore();
  const [jazzy, setJazzy] = useState<number | null>(null);
  const [tristan, setTristan] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<"keep" | "modify" | "retire" | null>("keep");
  const [note, setNote] = useState("");

  const [jazzyName, tristanName] = state.settings.people;

  return (
    <Sheet title={`Rate ${recipe.name}`} onClose={onClose}>
      <RatingRow person={jazzyName} value={jazzy} onChange={setJazzy} />
      <RatingRow person={tristanName} value={tristan} onChange={setTristan} />

      <div className="egsl-field">
        <label>Verdict</label>
        <div className="egsl-segmented">
          {(["keep", "modify", "retire"] as const).map((v) => (
            <button
              key={v}
              className={verdict === v ? "active" : ""}
              onClick={() => setVerdict(v)}
            >
              {v === "keep" ? "Keep" : v === "modify" ? "Modify" : "Retire"}
            </button>
          ))}
        </div>
      </div>

      <div className="egsl-field">
        <label>Notes (optional)</label>
        <textarea
          className="egsl-textarea"
          placeholder='"Use more sauce next time." "Tristan loved this."'
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button
        className="egsl-btn egsl-btn-primary egsl-btn-block"
        onClick={() => {
          rateRecipe(recipe.id, jazzy, tristan, verdict, note.trim() || undefined);
          onClose();
        }}
      >
        Save rating
      </button>
    </Sheet>
  );
}
