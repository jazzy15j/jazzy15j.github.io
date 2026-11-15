"use client";

import { useSyncExternalStore } from "react";
import { useChecks } from "../lib/store";
import { books, dayThemes, evening, morning, resources, supplies, SEMESTER_START, weeks } from "../lib/semester";

const noop = () => () => {};
function useToday(): string {
  // "" on the server and first paint; the local date afterwards.
  return useSyncExternalStore(noop, () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, () => "");
}

function weekFor(today: string): number | null {
  if (!today) return null;
  const days = Math.floor((Date.parse(today) - Date.parse(SEMESTER_START)) / 86400000);
  if (days < 0) return 0; // before semester: orientation
  const w = Math.floor(days / 7) + 1;
  return w > 14 ? 15 : w;
}

function Today({ today }: { today: string }) {
  const [done, toggle] = useChecks(`day:${today || "x"}`);
  const dow = today ? new Date(`${today}T12:00:00`).getDay() : -1;
  const theme = dayThemes.find((_, i) => i === dow);
  const items = [
    ...morning.map((t, i) => ({ id: `m${i}`, t, g: "Morning" })),
    ...(theme ? theme.do.map((t, i) => ({ id: `d${i}`, t, g: theme.focus })) : []),
    { id: "w", t: "Laptop work: 2 hours max, then close it", g: "Work" },
    ...evening.map((t, i) => ({ id: `e${i}`, t, g: "Evening" })),
  ];
  const groups = [...new Set(items.map((i) => i.g))];
  const count = items.filter((i) => done.has(i.id)).length;
  return (
    <div className="lc-card">
      <p className="lc-note">{today ? `${count} of ${items.length} done today. A fresh list every day.` : "Loading today…"}</p>
      {groups.map((g) => (
        <div key={g}>
          <h3>{g}</h3>
          <ul className="lc-checks">
            {items.filter((i) => i.g === g).map((i) => (
              <li key={i.id}>
                <label>
                  <input type="checkbox" checked={done.has(i.id)} onChange={() => toggle(i.id)} />
                  <span>{i.t}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Semester() {
  const today = useToday();
  const current = weekFor(today);
  return (
    <>
      <p className="lc-note">
        {current === 0 && "Orientation week: get your card, set up Libby, call the library."}
        {current !== null && current >= 1 && current <= 14 && `You are in week ${current} of 14.`}
        {current === 15 && "The semester is over. Time for the review."}
      </p>

      <h3>Today</h3>
      <Today today={today} />

      <h3 style={{ marginTop: "2rem" }}>Week by week</h3>
      <div className="lc-grid2">
        {weeks.map((w) => (
          <article key={w.n} className={`lc-card${w.n === current ? " lc-now" : ""}`}>
            <p className="lc-kicker">Week {w.n} · {w.label}{w.soft ? ` · ${w.soft}` : ""}</p>
            <ul>
              <li><b>Sewing:</b> {w.sewing}</li>
              <li><b>Reading:</b> {w.reading}</li>
              <li><b>Kitchen:</b> {w.kitchen}</li>
              <li><b>Out:</b> {w.outing}</li>
            </ul>
          </article>
        ))}
      </div>

      <h3 style={{ marginTop: "2rem" }}>Reading list (check Libby for availability)</h3>
      <div className="lc-grid3">
        {books.map((b) => (
          <article key={b.title} className="lc-card">
            <p className="lc-kicker">{b.kind}</p>
            <h3>{b.title}</h3>
            <p>{b.author}</p>
            <p className="lc-note">{b.why}</p>
          </article>
        ))}
      </div>

      <h3 style={{ marginTop: "2rem" }}>Thrifting and supplies list</h3>
      <div className="lc-grid2">
        {supplies.map((g) => (
          <article key={g.group} className="lc-card">
            <h3>{g.group}</h3>
            <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
        ))}
      </div>

      <h3 style={{ marginTop: "2rem" }}>Free resources in Kearney</h3>
      <div className="lc-grid2">
        {resources.map((r) => (
          <article key={r.name} className="lc-card">
            <h3>{r.name}</h3>
            <p>{r.what}</p>
            <p className="lc-note">{r.confidence}{r.contact ? ` · ${r.contact}` : ""}</p>
          </article>
        ))}
      </div>
    </>
  );
}
