"use client";

import { useState } from "react";
import { useJson } from "../lib/store";
import { logDefs, type Entry } from "../lib/logs";
import type { LogKind } from "../lib/course";

const EMPTY: Entry[] = [];

export default function LogSection({ kind, date, compact }: { kind: LogKind; date: string; compact?: boolean }) {
  const def = logDefs[kind];
  const [entries, setEntries] = useJson<Entry[]>(`log:${kind}`, EMPTY);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const shown = (compact ? entries.filter((e) => e.date === date) : [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)));
  const total = def.sumKey ? entries.reduce((n, e) => n + (Number(e[def.sumKey!]) || 0), 0) : 0;
  const filled = def.fields.some((f) => (draft[f.key] ?? "").trim());

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!filled) return;
    const entry: Entry = { id: `${Date.now()}`, date: draft.date || date, ...draft } as Entry;
    entry.date = draft.date || date;
    setEntries([...entries, entry]);
    setDraft({});
  }

  return (
    <section className="lc-card lc-log" id={`log-${kind}`}>
      <h3>{def.title}</h3>
      {!compact && <p className="lc-note">{def.blurb}</p>}
      {!compact && def.sumKey && <p className="lc-note"><b>{Math.round(total * 10) / 10}</b> {def.sumLabel} in total</p>}
      <form onSubmit={add} className="lc-form">
        {!compact && (
          <label>Date<input type="date" value={draft.date ?? date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label>
        )}
        {def.fields.map((f) => (
          <label key={f.key}>{f.label}
            {f.type === "textarea" ? (
              <textarea rows={2} value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
            ) : f.type === "select" ? (
              <select value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}>
                <option value="">Choose…</option>
                {f.options!.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type} inputMode={f.type === "number" ? "decimal" : undefined} step={f.type === "number" ? "any" : undefined}
                placeholder={f.placeholder} value={draft[f.key] ?? ""} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
            )}
          </label>
        ))}
        <button type="submit" className="lc-btn" disabled={!filled}>Add to log</button>
      </form>
      {shown.length === 0 ? (
        <p className="lc-note">{compact ? "Nothing logged for this day yet." : "No entries yet."}</p>
      ) : (
        <ul className="lc-entries">
          {shown.map((e) => (
            <li key={e.id}>
              <div>
                <b>{e.date}</b>{" "}
                {def.fields.map((f) => (e[f.key] ? <span key={f.key}>{f.label.split(" (")[0]}: {e[f.key]}. </span> : null))}
              </div>
              <button type="button" className="lc-link" onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} aria-label="Delete this entry">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
