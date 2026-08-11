"use client";

import React, { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { CATEGORY_LABEL, GROCERY_CATEGORY_ORDER, getUseFirstList } from "../lib/engine";
import type { InventoryItem, StockState } from "../lib/types";
import { StockPill } from "./ui/Pills";
import ItemEditorSheet from "./ItemEditorSheet";

const CATEGORY_ICON: Record<string, string> = {
  produce: "🥬",
  meat: "🍗",
  dairy: "🧀",
  frozen: "🧊",
  pantry: "🥫",
  bread: "🍞",
  other: "🧾",
};

const CYCLE: StockState[] = ["plenty", "some", "low", "out"];

function InventoryRow({ item, onEdit }: { item: InventoryItem; onEdit: () => void }) {
  const { setInventoryState } = useStore();
  const cycle = () => {
    const next = CYCLE[(CYCLE.indexOf(item.state) + 1) % CYCLE.length];
    setInventoryState(item.id, next);
  };

  return (
    <div className="egsl-kitchen-row">
      <button className="egsl-kitchen-name" onClick={onEdit}>
        <span>{item.name}</span>
        {item.frozen && <span className="egsl-faint" style={{ fontSize: 11 }}>❄️ frozen</span>}
        {item.isLeftover && <span className="egsl-faint" style={{ fontSize: 11 }}>🍱 leftover</span>}
        {item.approxAmount && <span className="egsl-faint" style={{ fontSize: 11 }}>{item.approxAmount}</span>}
      </button>
      <StockPill state={item.state} onClick={cycle} />
    </div>
  );
}

export default function KitchenScreen() {
  const { state } = useStore();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const useFirst = useMemo(() => getUseFirstList(state.inventory).slice(0, 6), [state.inventory]);

  const grouped = GROCERY_CATEGORY_ORDER.map((cat) => ({
    cat,
    items: state.inventory
      .filter((i) => i.category === cat)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);

  return (
    <div style={{ paddingTop: 22 }}>
      <div className="egsl-row egsl-between egsl-wrap egsl-gap-10">
        <div>
          <p className="egsl-eyebrow">Kitchen</p>
          <h1 className="egsl-page-title">What&apos;s on hand</h1>
        </div>
        <button className="egsl-btn egsl-btn-primary" onClick={() => setAddOpen(true)}>
          + Add item
        </button>
      </div>
      <p className="egsl-page-sub">Tap a status pill to update it. Tap the name for more detail.</p>

      {useFirst.length > 0 && (
        <section className="egsl-card egsl-usefirst-card">
          <p className="egsl-eyebrow" style={{ marginBottom: 10 }}>
            🔥 Use first
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {useFirst.map((entry) => (
              <div key={entry.item.id} className="egsl-usefirst-row">
                <div>
                  <span className="egsl-usefirst-name">{entry.item.name}</span>
                  <span className="egsl-faint" style={{ display: "block", fontSize: 11.5 }}>
                    {entry.reason}
                  </span>
                </div>
                <StockPill state={entry.item.state} onClick={() => setEditingItem(entry.item)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {grouped.map((g) => (
        <section key={g.cat} style={{ marginBottom: 22 }}>
          <h3 className="egsl-grocery-category">
            {CATEGORY_ICON[g.cat]} {CATEGORY_LABEL[g.cat]}{" "}
            <span className="egsl-faint" style={{ fontWeight: 600 }}>
              ({g.items.length})
            </span>
          </h3>
          <div className="egsl-card" style={{ padding: "4px 6px" }}>
            {g.items.map((item) => (
              <InventoryRow key={item.id} item={item} onEdit={() => setEditingItem(item)} />
            ))}
          </div>
        </section>
      ))}

      {editingItem && <ItemEditorSheet item={editingItem} onClose={() => setEditingItem(null)} />}
      {addOpen && <ItemEditorSheet item={null} onClose={() => setAddOpen(false)} />}
    </div>
  );
}
