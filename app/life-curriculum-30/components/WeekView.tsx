"use client";

import { useChecks, useJson } from "../lib/store";
import { course, dayName, prettyDate } from "../lib/course";
import { Bar } from "./ui";

const EMPTY: Record<string, string> = {};

export default function WeekView({ n }: { n: number }) {
  const week = course.find((w) => w.n === n);
  const [done] = useChecks("done");
  const [mats, toggleMat] = useChecks("materials");
  const [refl, setRefl] = useJson<Record<string, string>>("weekrefl", EMPTY);
  if (!week) return <p>Week not found. <a href="#/course">Back to the course map</a></p>;
  const complete = week.lessons.filter((l) => done.has(l.id)).length;
  const prev = course.find((w) => w.n === n - 1);
  const next = course.find((w) => w.n === n + 1);
  return (
    <article>
      <nav className="lc-crumbs"><a href="#/course">Course</a> › {n === 0 ? "Orientation" : `Week ${n}`}</nav>
      <header className="lc-lessonhead">
        <p className="lc-kicker">{n === 0 ? "Orientation" : `Week ${n} of 14`} · {prettyDate(week.start)} – {prettyDate(week.lessons[6].date)}</p>
        <h1>{week.title}</h1>
        <p className="lc-why">{week.goal}</p>
        <Bar value={complete} max={7} label="Days complete this week" />
        <p className="lc-note">{complete} of 7 days complete</p>
      </header>

      <div className="lc-grid2">
        <section className="lc-card">
          <h2>You will be able to</h2>
          <ul>{week.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
        </section>
        <section className="lc-card">
          <h2>Gather this week</h2>
          <ul className="lc-checks">
            {week.materials.map((m) => (
              <li key={m}><label><input type="checkbox" checked={mats.has(`${n}:${m}`)} onChange={() => toggleMat(`${n}:${m}`)} /><span>{m}</span></label></li>
            ))}
          </ul>
        </section>
      </div>

      <h2 className="lc-h2">The seven days</h2>
      <ol className="lc-daylist">
        {week.lessons.map((l) => (
          <li key={l.id}>
            <a href={`#/day/${l.id}`} className={done.has(l.id) ? "is-done" : ""}>
              <span className="lc-dn">{dayName(l.dayIdx)}<small>{prettyDate(l.date)}</small></span>
              <span className="lc-dt">{l.title}<small>{l.theme}</small></span>
              <span aria-hidden="true">{done.has(l.id) ? "✓" : "›"}</span>
            </a>
          </li>
        ))}
      </ol>

      <section className="lc-card">
        <h2>End-of-week reflection</h2>
        <label className="lc-field">What went well? What would I change next week?
          <textarea rows={5} value={refl[String(n)] ?? ""} onChange={(e) => setRefl({ ...refl, [String(n)]: e.target.value })} />
        </label>
      </section>

      <nav className="lc-pager">
        {prev ? <a href={`#/week/${prev.n}`}>← {prev.n === 0 ? "Orientation" : `Week ${prev.n}`}</a> : <span />}
        {next ? <a href={`#/week/${next.n}`}>Week {next.n} →</a> : <span />}
      </nav>
    </article>
  );
}
