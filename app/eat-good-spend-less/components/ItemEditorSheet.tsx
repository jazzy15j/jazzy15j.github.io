"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORY_LABEL, GROCERY_CATEGORY_ORDER } from "../lib/engine";
import type { InventoryItem, IngredientCategory, StockState } from "../lib/types";
import { Sheet } from "./ui/Sheet";

const STATE_OPTIONS: { value: StockState; label: string }[] = [
  { value: "plenty", label: "Plenty" },
  { value: "some", label: "Some" },
  { value: "low", label: "Low" },
  { value: "out", label: "Out" },
];

export default function ItemEditorSheet({
  item,
  onClose,
}: {
  item: InventoryItem | null;
  onClose: () => void;
}) {
  const { addInventoryItem, updateInventoryItem, removeInventoryItem } = useStore();
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<IngredientCategory>(item?.category ?? "other");
  const [state, setState] = useState<StockState>(item?.state ?? "some");
  const [approxAmount, setApproxAmount] = useState(item?.approxAmount ?? "");
  const [frozen, setFrozen] = useState(!!item?.frozen);
  const [isLeftover, setIsLeftover] = useState(!!item?.isLeftover);
  const [useByDate, setUseByDate] = useState(item?.useByDate ?? "");

  const save = () => {
    if (!name.trim()) return;
    const payload = {
      name: name.trim(),
      category,
      state,
      approxAmount: approxAmount.trim() || undefined,
      frozen: frozen || undefined,
      isLeftover: isLeftover || undefined,
      useByDate: useByDate || undefined,
    };
    if (item) updateInventoryItem(item.id, payload);
    else addInventoryItem(payload);
    onClose();
  };

  return (
    <Sheet title={item ? `Edit ${item.name}` : "Add to kitchen"} onClose={onClose}>
      <div className="egsl-field">
        <label>Name</label>
        <input className="egsl-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Cucumber" />
      </div>

      <div className="egsl-field">
        <label>Category</label>
        <div className="egsl-segmented">
          {GROCERY_CATEGORY_ORDER.map((c) => (
            <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="egsl-field">
        <label>How much is left</label>
        <div className="egsl-segmented">
          {STATE_OPTIONS.map((s) => (
            <button key={s.value} className={state === s.value ? "active" : ""} onClick={() => setState(s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="egsl-field">
        <label>Approximate amount (optional)</label>
        <input
          className="egsl-input"
          value={approxAmount}
          onChange={(e) => setApproxAmount(e.target.value)}
          placeholder="1/2 head, 10 oz…"
        />
      </div>

      <div className="egsl-field">
        <label>Use by / peak ripeness (optional, approximate)</label>
        <input className="egsl-input" type="date" value={useByDate} onChange={(e) => setUseByDate(e.target.value)} />
      </div>

      <div className="egsl-row egsl-gap-12" style={{ marginBottom: 18 }}>
        <label className="egsl-check-row">
          <input type="checkbox" checked={frozen} onChange={(e) => setFrozen(e.target.checked)} />
          Frozen
        </label>
        <label className="egsl-check-row">
          <input type="checkbox" checked={isLeftover} onChange={(e) => setIsLeftover(e.target.checked)} />
          Cooked leftover
        </label>
      </div>

      <button className="egsl-btn egsl-btn-primary egsl-btn-block" onClick={save}>
        {item ? "Save changes" : "Add item"}
      </button>

      {item && (
        <button
          className="egsl-btn egsl-btn-ghost egsl-btn-block"
          style={{ marginTop: 8, color: "var(--egsl-berry)" }}
          onClick={() => {
            removeInventoryItem(item.id);
            onClose();
          }}
        >
          Remove from kitchen
        </button>
      )}
    </Sheet>
  );
}
