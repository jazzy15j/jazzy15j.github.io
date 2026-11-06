"use client";

import { useState } from "react";
import { CATEGORIES, CAT, DAYS, STOPS, STOP_BY_ID } from "../lib/data";
import { useStore } from "../lib/store";
import type { CategoryId, Method } from "../lib/types";
import { Icon, MoneyField, PayToggle, Sheet } from "./ui";
import type { AddOpts } from "./uiCtx";

export type SheetMode = { mode: "add"; opts: AddOpts } | { mode: "edit"; id: string } | null;

export default function ExpenseSheet({ sheet, onClose }: { sheet: SheetMode; onClose: () => void }) {
  if (!sheet) return null;
  return <ExpenseForm sheet={sheet} onClose={onClose} />;
}

function ExpenseForm({ sheet, onClose }: { sheet: NonNullable<SheetMode>; onClose: () => void }) {
  const { state, addExtra, updateExtra, deleteExtra, pushToast } = useStore();
  const editing = sheet.mode === "edit" ? state.extras.find((e) => e.id === sheet.id) : undefined;
  const addStop = sheet.mode === "add" && sheet.opts.stopId ? STOP_BY_ID[sheet.opts.stopId] : undefined;

  const [label, setLabel] = useState(editing?.label ?? (sheet.mode === "add" ? (sheet.opts.label ?? "") : ""));
  const [amount, setAmount] = useState<number | null>(editing?.amount ?? null);
  const [method, setMethod] = useState<Method>(
    editing?.method ?? (addStop ? (state.stops[addStop.id]?.method ?? addStop.method) : "cash"),
  );
  const [category, setCategory] = useState<CategoryId>(
    editing?.category ?? (sheet.mode === "add" ? (sheet.opts.category ?? addStop?.category ?? "backup") : "backup"),
  );
  const [stopId, setStopId] = useState<string>(editing?.stopId ?? (sheet.mode === "add" ? (sheet.opts.stopId ?? "") : ""));
  const [note, setNote] = useState(editing?.note ?? "");
  const [err, setErr] = useState("");

  const save = () => {
    if (amount == null || amount <= 0) {
      setErr("Enter an amount greater than $0.");
      return;
    }
    const clean = label.trim() || CAT[category].short;
    if (editing) {
      updateExtra(editing.id, { label: clean, amount, method, category, stopId: stopId || null, note });
      pushToast("Expense updated");
    } else {
      addExtra({ label: clean, amount, method, category, stopId: stopId || null, note });
      pushToast(`Added ${clean}`);
    }
    onClose();
  };

  return (
    <Sheet open title={editing ? "Edit expense" : "Quick-add expense"} onClose={onClose}>
      <div className="space-y-4">
        <label className="block">
          <span className="lbl">What was it?</span>
          <input className="field mt-1" value={label} placeholder="e.g. Extra cocktail, rideshare, souvenir" onChange={(e) => setLabel(e.target.value)} />
        </label>

        <div>
          <span className="lbl">Amount</span>
          <MoneyField big value={amount} onChange={setAmount} label="Amount spent" placeholder="0.00" className="mt-1" />
        </div>

        <div>
          <span className="lbl">Paid with</span>
          <div className="mt-1">
            <PayToggle value={method} onChange={setMethod} label="Paid with" />
          </div>
        </div>

        <div>
          <span className="lbl">Budget category</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className="chip min-h-[40px] !px-3 text-[13px]"
                style={{
                  background: category === c.id ? "var(--color-burgundy)" : "rgba(122,96,77,0.12)",
                  color: category === c.id ? "#fdf1d6" : "var(--color-ink)",
                  border: 0,
                }}
              >
                <span aria-hidden>{c.emoji}</span> {c.short}
              </button>
            ))}
          </div>
          {category === "cushion" ? (
            <p className="mt-1 text-[13px] text-ink-soft">This draws from the protected cushion.</p>
          ) : null}
        </div>

        <label className="block">
          <span className="lbl">Add to an itinerary stop (optional)</span>
          <select className="field mt-1" value={stopId} onChange={(e) => setStopId(e.target.value)}>
            <option value="">Not tied to a stop</option>
            {DAYS.map((d) => (
              <optgroup key={d.index} label={`${d.short} · ${d.title}`}>
                {STOPS.filter((s) => s.day === d.index)
                  .sort((a, b) => a.start - b.start)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.time} — {s.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <span className="mt-1 block text-[13px] text-ink-soft">
            Add-ons are separate from the stop’s own Actual Spent, so nothing is counted twice.
          </span>
        </label>

        <label className="block">
          <span className="lbl">Notes</span>
          <input className="field mt-1" value={note} placeholder="Optional" onChange={(e) => setNote(e.target.value)} />
        </label>

        {err ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
            {err}
          </p>
        ) : null}

        <div className="flex gap-3">
          {editing ? (
            <button
              className="btn btn-danger"
              onClick={() => {
                deleteExtra(editing.id);
                onClose();
              }}
            >
              <Icon name="trash" size={18} /> Delete
            </button>
          ) : null}
          <button className="btn btn-primary flex-1" onClick={save}>
            <Icon name="check" size={18} /> {editing ? "Save changes" : "Add expense"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
