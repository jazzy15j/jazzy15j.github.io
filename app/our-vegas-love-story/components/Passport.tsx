"use client";

import { useState } from "react";
import { DAYS, STAMPS, STOPS, STOP_BY_ID, type StampDef } from "../lib/data";
import { useStore } from "../lib/store";
import { Icon, Sparkle, StampArt } from "./ui";
import { useUi } from "./uiCtx";

function stampDate(iso?: string): string {
  if (!iso) return "LAS VEGAS · NV";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Los_Angeles" }).toUpperCase();
}

export default function Passport() {
  const { state, toggleDone } = useStore();
  const { celebrate, goToStop } = useUi();
  const [ask, setAsk] = useState<StampDef | null>(null);

  const stopForStamp = (id: string) => STOPS.find((s) => s.stamp === id)!;
  const got = STAMPS.filter((s) => state.stops[stopForStamp(s.id).id].done);
  const pct = Math.round((got.length / STAMPS.length) * 100);
  const all = got.length === STAMPS.length;

  return (
    <div className="space-y-4">
      {/* Cover */}
      <section className="relative overflow-hidden rounded-[22px] p-5 text-center shadow-xl" style={{ background: "linear-gradient(160deg,#6d1b2e,#4a1020 60%,#35101b)", border: "2px solid #b3842f" }}>
        <div className="pointer-events-none absolute inset-2 rounded-[16px] border border-gold-lt/50" />
        <Sparkle className="twinkle" size={14} style={{ left: 18, top: 16 }} />
        <Sparkle className="twinkle" size={10} style={{ right: 24, top: 30, animationDelay: "1s" }} />
        <p className="lbl !text-[#e8c97c]">Adventure passport</p>
        <h1 className="font-script mt-1 text-[44px] leading-none text-gold-lt" style={{ textShadow: "0 1px 0 #7a5a1b, 0 0 14px rgba(232,201,124,.45)" }}>
          Love Story
        </h1>
        <p className="font-display text-sm font-extrabold uppercase tracking-[0.3em] text-[#e8c97c]">Las Vegas · Nevada</p>
        <p className="mt-2 text-[13px] font-bold text-[#f4dfb0]">Jasmine &amp; Tristan · 2026</p>
        <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-black/30" role="progressbar" aria-valuemin={0} aria-valuemax={STAMPS.length} aria-valuenow={got.length} aria-label="Stamps collected">
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-lt transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 font-display text-lg font-extrabold text-[#ffe9b0]">
          <span className="num">{got.length}</span> of <span className="num">{STAMPS.length}</span> stamps
        </p>
      </section>

      {all ? (
        <section className="pop card relative overflow-hidden p-5 text-center">
          <Sparkle className="twinkle" size={16} style={{ left: 16, top: 12 }} />
          <Sparkle className="twinkle" size={12} style={{ right: 20, top: 24, animationDelay: "1.2s" }} />
          <p className="lbl">Passport complete</p>
          <p className="font-script mt-1 text-3xl leading-snug text-burgundy">
            Every stamp, every sparkle, every moment — together. Happy third anniversary, my love. ♥
          </p>
        </section>
      ) : null}

      {/* Stamps */}
      <section className="card p-4" aria-label="Stamps">
        <p className="mb-3 text-[13.5px] text-ink-soft">Mark a stop complete in the itinerary (the round stamp button) — or tap a faded stamp here.</p>
        <ul className="grid grid-cols-3 gap-x-1 gap-y-4">
          {STAMPS.map((s, i) => {
            const stop = stopForStamp(s.id);
            const st = state.stops[stop.id];
            return (
              <li key={s.id} className="flex flex-col items-center">
                <button
                  className="flex flex-col items-center"
                  style={{ background: "transparent", border: 0 }}
                  aria-label={st.done ? `${s.name} stamp collected. Open stop.` : `${s.name} stamp not collected yet. Stamp it.`}
                  onClick={() => (st.done ? goToStop(stop.id) : setAsk(s))}
                >
                  <StampArt icon={s.icon} top={s.top} index={i} size={100} ghost={!st.done} date={stampDate(st.doneAt)} />
                  <span className={`mt-1 text-center text-[12.5px] font-extrabold leading-tight ${st.done ? "text-ink" : "text-ink-soft"}`}>{s.name}</span>
                  <span className="text-[11px] text-ink-soft">{DAYS[stop.day].short}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Love notes */}
      <section className="card p-4" aria-label="Love notes">
        <h2 className="font-display text-xl font-extrabold text-burgundy">Day-by-day love notes</h2>
        <p className="text-[13.5px] text-ink-soft">Collect every stamp for a day to unlock its note.</p>
        <ul className="mt-3 space-y-3">
          {DAYS.map((d) => {
            const ds = STOPS.filter((s) => s.day === d.index && s.stamp);
            const have = ds.filter((s) => state.stops[s.id].done).length;
            const unlocked = ds.length > 0 && have === ds.length;
            return (
              <li key={d.index} className={`rounded-2xl p-3 ${unlocked ? "bg-blush/60 ring-1 ring-rose" : "bg-parchment/60"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-[16px] font-extrabold text-burgundy">
                    {d.emoji} {d.short} · {d.title}
                  </span>
                  <span className="chip bg-paper text-ink">
                    {have}/{ds.length}
                  </span>
                </div>
                {unlocked ? (
                  <p className="font-script mt-1 text-2xl leading-snug text-burgundy">{d.loveNote}</p>
                ) : (
                  <p className="mt-1 flex items-center gap-2 text-[13.5px] text-ink-soft">
                    <Icon name="stamp" size={16} /> Locked — {ds.length - have} stamp{ds.length - have === 1 ? "" : "s"} to go
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {ask ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label={`Stamp ${ask.name}`}>
          <button className="fade absolute inset-0 bg-night/60" aria-label="Cancel" onClick={() => setAsk(null)} />
          <div className="pop card relative w-full max-w-sm p-5 text-center">
            <div className="flex justify-center">
              <StampArt icon={ask.icon} top={ask.top} size={110} ghost index={0} />
            </div>
            <h3 className="font-display mt-2 text-xl font-extrabold text-burgundy">Stamp “{ask.name}”?</h3>
            <p className="text-[14px] text-ink-soft">
              This marks “{STOP_BY_ID[stopForStamp(ask.id).id].title}” complete. You can undo it from the itinerary.
            </p>
            <div className="mt-4 flex gap-3">
              <button className="btn btn-ghost flex-1" onClick={() => setAsk(null)}>
                Not yet
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={() => {
                  const stop = stopForStamp(ask.id);
                  if (toggleDone(stop.id)) celebrate(ask.id);
                  setAsk(null);
                }}
              >
                Stamp it!
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
