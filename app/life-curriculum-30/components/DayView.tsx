"use client";

import { useChecks, useJson, useStored } from "../lib/store";
import { lessonById, lessons, lessonIndex, course, prettyDate, DAY_LONG, type Part, type Step } from "../lib/course";
import { yt } from "../lib/links";
import { Bar, Links } from "./ui";
import LogSection from "./LogSection";

type DayNote = { note?: string; energy?: string; grat?: string };
const EMPTY_NOTES: Record<string, DayNote> = {};
const PARTS: { id: Part; label: string; time: string }[] = [
  { id: "morning", label: "Morning", time: "8:00–10:00" },
  { id: "core", label: "Today's lesson", time: "10:00–12:30" },
  { id: "afternoon", label: "Afternoon", time: "1:00–5:00" },
  { id: "evening", label: "Evening", time: "5:00 on" },
];

export default function DayView({ id }: { id: string }) {
  const lesson = lessonById.get(id);
  const [checks, toggle] = useChecks("steps");
  const [done, toggleDone] = useChecks("done");
  const [notes, setNotes] = useJson<Record<string, DayNote>>("journal", EMPTY_NOTES);
  const [stretch] = useStored("link:stretch", "");
  if (!lesson) return <p>That day isn&rsquo;t in the course. <a href="#/course">Back to the course map</a></p>;

  const idx = lessonIndex(id);
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const week = course.find((w) => w.n === lesson.weekN)!;
  const stepsDone = lesson.steps.filter((s) => checks.has(s.id)).length;
  const note = notes[id] ?? {};
  const setNote = (patch: DayNote) => setNotes({ ...notes, [id]: { ...note, ...patch } });

  function stepLinks(s: Step) {
    if (s.dyn === "stretch" && stretch) {
      return [{ label: "Open my stretching video", href: stretch }, ...(s.links ?? [])];
    }
    return s.links;
  }

  return (
    <article>
      <nav className="lc-crumbs" aria-label="Breadcrumb">
        <a href="#/course">Course</a> › <a href={`#/week/${week.n}`}>{week.n === 0 ? "Orientation" : `Week ${week.n}`}: {week.title}</a>
      </nav>
      <header className="lc-lessonhead">
        <p className="lc-kicker">{DAY_LONG[lesson.dayIdx]}, {prettyDate(lesson.date)} · {lesson.theme}</p>
        <h1>{lesson.title}</h1>
        <p className="lc-why">{lesson.why}</p>
        <Bar value={stepsDone} max={lesson.steps.length} label="Steps done today" />
        <p className="lc-note">{stepsDone} of {lesson.steps.length} steps done{done.has(id) ? " · day complete" : ""}</p>
      </header>

      {PARTS.map((p) => {
        const steps = lesson.steps.filter((s) => s.part === p.id);
        if (!steps.length) return null;
        return (
          <section key={p.id} className={`lc-part lc-part-${p.id}`}>
            <h2>{p.label} <span>{p.time}</span></h2>
            {steps.map((s) => (
              <div key={s.id} className={`lc-step${checks.has(s.id) ? " is-done" : ""}`}>
                <label>
                  <input type="checkbox" checked={checks.has(s.id)} onChange={() => toggle(s.id)} />
                  <span>{s.text}</span>
                </label>
                {s.how && (
                  <ul className="lc-how">{s.how.map((h) => <li key={h}>{h}</li>)}</ul>
                )}
                <Links links={stepLinks(s)} />
                {s.log && (
                  <a className="lc-link" href={`#log-${s.log}`} onClick={(e) => { e.preventDefault(); document.getElementById(`log-${s.log}`)?.scrollIntoView({ behavior: "smooth" }); }}>Log it ↓</a>
                )}
              </div>
            ))}
          </section>
        );
      })}

      <section className="lc-part" id="log">
        <h2>Log this day</h2>
        <div className="lc-card">
          <label className="lc-field">One gratitude
            <input value={note.grat ?? ""} onChange={(e) => setNote({ grat: e.target.value })} />
          </label>
          <label className="lc-field">Energy today
            <select value={note.energy ?? ""} onChange={(e) => setNote({ energy: e.target.value })}>
              <option value="">Choose…</option>
              {["1 (low)", "2", "3", "4", "5 (great)"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="lc-field">Notes: what I made, learned or noticed
            <textarea rows={4} value={note.note ?? ""} onChange={(e) => setNote({ note: e.target.value })} />
          </label>
        </div>
        {lesson.logs.map((k) => <LogSection key={k} kind={k} date={lesson.date} compact />)}
      </section>

      <div className="lc-complete">
        <button type="button" className={`lc-btn${done.has(id) ? " lc-btn-on" : ""}`} onClick={() => toggleDone(id)} aria-pressed={done.has(id)}>
          {done.has(id) ? "✓ Day complete (tap to undo)" : "Mark this day complete"}
        </button>
        <a className="lc-link" href={yt("how to sew for beginners full course").href} target="_blank" rel="noopener noreferrer">Need help? Search a beginner course ↗</a>
      </div>

      <nav className="lc-pager" aria-label="Previous and next day">
        {prev ? <a href={`#/day/${prev.id}`}>← {DAY_LONG[prev.dayIdx]}: {prev.title}</a> : <span />}
        {next ? <a href={`#/day/${next.id}`}>{DAY_LONG[next.dayIdx]}: {next.title} →</a> : <span />}
      </nav>
    </article>
  );
}
