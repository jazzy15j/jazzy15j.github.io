"use client";

import { useEffect, useState } from "react";
import { DAYS, TRIP_END_UTC, TRIP_START_UTC, TYPICAL_WEATHER } from "../lib/data";
import { countdown, fmtClock, sunTimes, vegasNow } from "../lib/geo";
import { describeWeather, fetchWeather, readCachedWeather, type WeatherMap } from "../lib/weather";
import { Icon, Sparkle } from "./ui";

/** Loads the forecast once per page view; falls back to cache, then typical values. */
export function useWeather(): { map: WeatherMap | null; live: boolean } {
  const [map, setMap] = useState<WeatherMap | null>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let alive = true;
    const cached = readCachedWeather();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached) setMap(cached);
    fetchWeather().then((w) => {
      if (!alive || !w) return;
      setMap(w);
      setLive(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return { map, live };
}

export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export function tripPhase(now: number | null): "before" | "during" | "after" | "unknown" {
  if (now == null) return "unknown";
  if (now < TRIP_START_UTC - 12 * 3600 * 1000) return "before";
  if (now > TRIP_END_UTC) return "after";
  return "during";
}

export function currentTripDay(now: number | null): number | null {
  if (now == null) return null;
  const { iso } = vegasNow(now);
  const d = DAYS.find((x) => x.iso === iso);
  return d ? d.index : null;
}

export function Countdown({ tone = "light" }: { tone?: "light" | "dark" }) {
  const now = useNow(1000);
  const phase = tripPhase(now);
  const cd = countdown(TRIP_START_UTC, now ?? TRIP_START_UTC);
  const dayIdx = currentTripDay(now);
  const cell = (n: number, l: string) => (
    <div className="flex min-w-[64px] flex-1 flex-col items-center rounded-2xl bg-white/10 px-2 py-2.5 ring-1 ring-gold-lt/40">
      <span className="font-display num text-3xl font-extrabold leading-none text-[#ffe9b0]">{String(n).padStart(2, "0")}</span>
      <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#f0d9a6]">{l}</span>
    </div>
  );
  if (phase === "during") {
    return (
      <div className="text-center">
        <p className="font-script text-4xl neon">{dayIdx != null ? `Day ${dayIdx + 1} of 5` : "Adventure in progress"}</p>
        <p className="mt-1 text-sm font-bold text-[#f0d9a6]">{dayIdx != null ? DAYS[dayIdx].title : "Thanks for the memories, Vegas"}</p>
      </div>
    );
  }
  if (phase === "after") {
    return <p className="text-center font-script text-3xl neon">What a trip. ♥</p>;
  }
  return (
    <div className={tone === "dark" ? "" : ""} aria-label="Countdown to landing in Las Vegas">
      <div className="flex gap-2">
        {cell(cd.days, "days")}
        {cell(cd.hours, "hrs")}
        {cell(cd.mins, "min")}
        {cell(cd.secs, "sec")}
      </div>
      <p className="mt-2 text-center text-xs font-bold text-[#f0d9a6]">until check-in opens · Mon 12/14, 4:00 PM</p>
    </div>
  );
}

export function WeatherChip({ iso, compact = false }: { iso: string; compact?: boolean }) {
  const { map, live } = useWeather();
  const w = map?.[iso];
  const sun = sunTimes(iso);
  const desc = w ? describeWeather(w.code) : null;
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${compact ? "text-[13px]" : "text-sm"} font-bold`}>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden>{desc?.icon ?? "🌤️"}</span>
        {w ? (
          <>
            <span className="num">
              {w.hi}° / {w.lo}°
            </span>
            <span className="font-semibold opacity-80">{desc?.label}</span>
            {w.rain >= 20 ? <span className="opacity-80">· {w.rain}% rain</span> : null}
          </>
        ) : (
          <span className="num">
            ~{TYPICAL_WEATHER.hi}° / {TYPICAL_WEATHER.lo}° <span className="font-semibold opacity-70">typical</span>
          </span>
        )}
        {w && !live ? <span className="text-[11px] opacity-60">(saved)</span> : null}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Icon name="sun" size={16} />
        <span className="num">Sunset {fmtClock(sun.sunset)}</span>
      </span>
    </div>
  );
}

export function TwinkleField() {
  const stars = [
    { l: "6%", t: "12%", s: 10, d: "0s" },
    { l: "88%", t: "8%", s: 14, d: "0.8s" },
    { l: "76%", t: "42%", s: 9, d: "1.6s" },
    { l: "14%", t: "58%", s: 12, d: "2.2s" },
    { l: "52%", t: "6%", s: 8, d: "1.1s" },
    { l: "92%", t: "70%", s: 11, d: "0.4s" },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <Sparkle key={i} className="twinkle" size={s.s} style={{ left: s.l, top: s.t, animationDelay: s.d }} />
      ))}
    </>
  );
}

export { fmtClock };
