"use client";

import { useChecks } from "../lib/store";
import { course, prettyDate, weekLabel, TOTAL_WEEKS } from "../lib/course";
import { Bar } from "./ui";

export default function CourseMap({ currentWeek }: { currentWeek: number }) {
  const [done] = useChecks("done");
  const total = course.reduce((n, w) => n + w.lessons.length, 0);
  const finished = course.flatMap((w) => w.lessons).filter((l) => done.has(l.id)).length;
  return (
    <div>
      <h1>Course map</h1>
      <p className="lc-why">{`Orientation plus ${TOTAL_WEEKS} weeks, Nov 17 – Mar 14. Tap a week to see its days.`}</p>
      <Bar value={finished} max={total} label="Course progress" />
      <p className="lc-note">{finished} of {total} days complete</p>
      <ol className="lc-weeks">
        {course.map((w) => {
          const c = w.lessons.filter((l) => done.has(l.id)).length;
          return (
            <li key={w.n}>
              <a href={`#/week/${w.n}`} className={w.n === currentWeek ? "is-now" : ""}>
                <span className="lc-kicker">{weekLabel(w.n)} · {prettyDate(w.start)}{w.kind === "trip" || w.kind === "soft" ? " · light week" : ""}</span>
                <b>{w.title}</b>
                <span className="lc-note">{w.goal}</span>
                <Bar value={c} max={w.lessons.length} label={`${weekLabel(w.n)} progress`} />
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
