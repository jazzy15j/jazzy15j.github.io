import { TAG_LABEL } from "../../lib/engine";
import type { MealTag, StockState } from "../../lib/types";

export function TagPill({ tag }: { tag: MealTag }) {
  return <span className={`egsl-pill egsl-pill-${tag}`}>{TAG_LABEL[tag]}</span>;
}

export function TagPills({ tags }: { tags: MealTag[] }) {
  if (!tags.length) return null;
  return (
    <div className="egsl-row egsl-wrap egsl-gap-6">
      {tags.map((t) => (
        <TagPill key={t} tag={t} />
      ))}
    </div>
  );
}

const STOCK_LABEL: Record<StockState, string> = {
  plenty: "Plenty",
  some: "Some",
  low: "Low",
  out: "Out",
};

const STOCK_COLOR: Record<StockState, { bg: string; fg: string }> = {
  plenty: { bg: "#e3ecd9", fg: "#4f6b48" },
  some: { bg: "#fdeec1", fg: "#93701a" },
  low: { bg: "#fbe3d9", fg: "#bd5a2c" },
  out: { bg: "#f4dde1", fg: "#a54254" },
};

export function StockPill({ state, onClick }: { state: StockState; onClick?: () => void }) {
  const c = STOCK_COLOR[state];
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      className="egsl-pill"
      style={{ background: c.bg, color: c.fg, border: "none" }}
      onClick={onClick}
    >
      {STOCK_LABEL[state]}
    </Tag>
  );
}

export function DifficultyPill({ difficulty }: { difficulty: "easy" | "medium" }) {
  return <span className="egsl-pill egsl-pill-neutral">{difficulty === "easy" ? "Easy" : "Medium"}</span>;
}

export function ConfidenceNote({ confidence }: { confidence: "exact" | "estimated" }) {
  return (
    <span className="egsl-faint" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.03em" }}>
      {confidence === "exact" ? "Exact" : "Estimated"}
    </span>
  );
}
