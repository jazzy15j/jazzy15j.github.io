"use client";

import { useEffect } from "react";
import { useHash, useToday } from "../lib/store";
import { lessonForDate } from "../lib/course";
import Home from "./Home";
import DayView from "./DayView";
import WeekView from "./WeekView";
import CourseMap from "./CourseMap";
import Library from "./Library";
import Books from "./Books";
import LogView from "./LogView";
import Syllabus from "./Syllabus";
import SettingsView from "./SettingsView";
import More from "./More";

export default function App() {
  const hash = useHash();
  const today = useToday();
  const parts = hash.replace(/^\//, "").split("/");
  const route = parts[0] || "home";
  const arg = parts[1] ?? "";
  const todayLesson = lessonForDate(today);
  const currentWeek = today ? todayLesson.weekN : 1;

  useEffect(() => {
    if (!hash.startsWith("/library/")) window.scrollTo({ top: 0 });
  }, [hash]);

  const tabs = [
    ["home", "#/", "Home", "⌂"],
    ["day", `#/day/${todayLesson.id}`, "Today", "✓"],
    ["course", "#/course", "Course", "▤"],
    ["library", "#/library", "Library", "☷"],
    ["log", "#/log", "Logs", "✎"],
    ["more", "#/more", "More", "⋯"],
  ] as const;
  const activeTab = ["books", "syllabus", "settings", "more", "week"].includes(route)
    ? route === "week" ? "course" : "more"
    : route;

  let view: React.ReactNode;
  switch (route) {
    case "day": view = <DayView id={arg} />; break;
    case "week": view = <WeekView n={Number(arg)} />; break;
    case "course": view = <CourseMap currentWeek={currentWeek} />; break;
    case "library": view = <Library />; break;
    case "books": view = <Books />; break;
    case "log": view = <LogView kind={arg} today={today} />; break;
    case "syllabus": view = <Syllabus />; break;
    case "settings": view = <SettingsView />; break;
    case "more": view = <More />; break;
    default: view = <Home today={today} />;
  }

  return (
    <div className="lc30">
      <a className="lc-skip" href="#lc-main" onClick={(e) => { e.preventDefault(); document.getElementById("lc-main")?.focus(); }}>Skip to content</a>
      <header className="lc-top">
        <a href="#/" className="lc-brand">My Life Curriculum</a>
        <nav aria-label="Main">
          {tabs.map(([key, href, label]) => (
            <a key={key} href={href} className={activeTab === key ? "on" : ""} aria-current={activeTab === key ? "page" : undefined}>{label}</a>
          ))}
        </nav>
      </header>
      <main id="lc-main" tabIndex={-1} className="lc-main">{view}</main>
      <nav className="lc-tabbar" aria-label="Main (mobile)">
        {tabs.map(([key, href, label, icon]) => (
          <a key={key} href={href} className={activeTab === key ? "on" : ""} aria-current={activeTab === key ? "page" : undefined}>
            <span aria-hidden="true">{icon}</span>{label}
          </a>
        ))}
      </nav>
    </div>
  );
}
