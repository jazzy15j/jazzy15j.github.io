"use client";

import { useChecks } from "../lib/store";
import { course, lessons, lessonForDate, dayName, prettyDate, weekLabel, COURSE_START, DAY_LONG } from "../lib/course";
import { L } from "../lib/links";
import { Bar, ExtLink } from "./ui";

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);
}

export default function Home({ today }: { today: string }) {
  const [done] = useChecks("done");
  const [steps] = useChecks("steps");
  const lesson = lessonForDate(today);
  const week = course.find((w) => w.n === lesson.weekN)!;
  const before = today && today < COURSE_START;
  const finished = lessons.filter((l) => done.has(l.id)).length;
  const stepsDone = lesson.steps.filter((s) => steps.has(s.id)).length;
  const next = lesson.steps.find((s) => !steps.has(s.id));

  return (
    <div>
      <header className="lc-hero2">
        <p className="lc-kicker">Winter Semester · Nov 17 – Mar 14 · Kearney, NE</p>
        <h1>My Life Curriculum</h1>
        <p className="lc-why">Build a life worth living first. Then build an income that fits inside it.</p>
        {before && <p className="lc-banner">{daysBetween(today, COURSE_START) === 1 ? "Your course starts tomorrow, Tuesday Nov 17." : `Your course starts Tuesday Nov 17. ${daysBetween(today, COURSE_START)} days to go.`} You can look around until then.</p>}
      </header>

      <section className="lc-card lc-today">
        <p className="lc-kicker">{before ? "First lesson" : "Today"} · {DAY_LONG[lesson.dayIdx]}, {prettyDate(lesson.date)}</p>
        <h2>{lesson.title}</h2>
        <p className="lc-note">{weekLabel(week.n)}: {week.title}</p>
        <Bar value={stepsDone} max={lesson.steps.length} label="Today's steps" />
        <p className="lc-note">{stepsDone} of {lesson.steps.length} steps done</p>
        {next && <p>Next up: <b>{next.text}</b></p>}
        <a className="lc-btn" href={`#/day/${lesson.id}`}>{stepsDone ? "Continue today's lesson" : "Start today's lesson"}</a>
      </section>

      <section className="lc-card">
        <h2>This week</h2>
        <ol className="lc-weekstrip" style={{ gridTemplateColumns: `repeat(${week.lessons.length}, 1fr)` }}>
          {week.lessons.map((l) => (
            <li key={l.id}>
              <a href={`#/day/${l.id}`} className={`${done.has(l.id) ? "is-done " : ""}${l.id === lesson.id ? "is-now" : ""}`}>
                <span>{dayName(l.dayIdx)}</span><b>{l.date.slice(8)}</b>
                <span aria-hidden="true">{done.has(l.id) ? "✓" : "·"}</span>
                <span className="lc-sr">{done.has(l.id) ? "complete" : "not complete"}</span>
              </a>
            </li>
          ))}
        </ol>
        <p><a href={`#/week/${week.n}`}>See the whole week →</a></p>
      </section>

      <section className="lc-card">
        <h2>Course progress</h2>
        <Bar value={finished} max={lessons.length} label="Course progress" />
        <p className="lc-note">{finished} of {lessons.length} days complete</p>
        <p><a href="#/course">Open the course map →</a></p>
      </section>

      <section className="lc-card">
        <h2>Quick links</h2>
        <div className="lc-pills">
          {[L.reserve, L.libby, L.catalogHome, L.sewPage, L.maker, L.news].map((l) => <ExtLink key={l.href} link={l} />)}
        </div>
        <p className="lc-note">Library hours: Mon–Thu 9–9, Fri–Sat 9–5, Sun 1–5 · 308-233-3282</p>
      </section>
    </div>
  );
}
