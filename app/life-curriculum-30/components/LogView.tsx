"use client";

import { logDefs, logOrder } from "../lib/logs";
import { useJson } from "../lib/store";
import { lessonById, prettyDate } from "../lib/course";
import LogSection from "./LogSection";
import type { LogKind } from "../lib/course";

type DayNote = { note?: string; energy?: string; grat?: string };
const EMPTY: Record<string, DayNote> = {};

export default function LogView({ kind, today }: { kind: string; today: string }) {
  const [notes] = useJson<Record<string, DayNote>>("journal", EMPTY);
  const active = (logOrder as string[]).includes(kind) ? (kind as LogKind) : null;
  const date = today || "";
  const journal = Object.entries(notes)
    .filter(([, n]) => n.note || n.grat)
    .map(([id, n]) => ({ id, n, l: lessonById.get(id) }))
    .filter((x) => x.l)
    .sort((a, b) => (a.l!.date < b.l!.date ? 1 : -1));

  return (
    <div>
      <h1>Logs</h1>
      <nav className="lc-tabs" aria-label="Log type">
        <a href="#/log" className={!active ? "on" : ""}>Journal</a>
        {logOrder.map((k) => <a key={k} href={`#/log/${k}`} className={active === k ? "on" : ""}>{logDefs[k].title}</a>)}
      </nav>
      {active ? (
        <LogSection kind={active} date={date} />
      ) : (
        <section>
          <p className="lc-why">Everything you wrote in your daily logs, newest first.</p>
          {journal.length === 0 ? <p className="lc-note">Nothing yet. Write in the log at the bottom of any day.</p> : (
            <ul className="lc-entries">
              {journal.map(({ id, n, l }) => (
                <li key={id}>
                  <div>
                    <a href={`#/day/${id}`}><b>{prettyDate(l!.date)}: {l!.title}</b></a>
                    {n.energy && <> · energy {n.energy}</>}
                    {n.grat && <div>Grateful for: {n.grat}</div>}
                    {n.note && <div>{n.note}</div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
