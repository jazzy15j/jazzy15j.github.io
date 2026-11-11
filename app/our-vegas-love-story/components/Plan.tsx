"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CAT, CONFIRMATIONS, DAYS, STOPS, STOP_BY_ID, stopsForDay } from "../lib/data";
import { mapsDayRouteUrl, mapsDirUrl, mapsPlaceUrl, modeFor, vegasNow } from "../lib/geo";
import { fmt } from "../lib/money";
import { useStore } from "../lib/store";
import type { Stop } from "../lib/types";
import { Countdown, TwinkleField, WeatherChip, currentTripDay, tripPhase, useNow } from "./Info";
import { Icon, MoneyField, PayToggle, Photo, Sparkle } from "./ui";
import { useUi } from "./uiCtx";

const MODE_ICON: Record<string, string> = { walk: "walk", transit: "bus", shuttle: "shuttle", taxi: "car", none: "walk" };
const MODE_LABEL: Record<string, string> = { walk: "Walk", transit: "Transit", shuttle: "Shuttle", taxi: "Taxi", none: "" };

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  const { totals } = useStore();
  const { setTab } = useUi();
  return (
    <section className="airmail pop" aria-label="Welcome">
      <div className="inner night relative overflow-hidden px-4 pb-5 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/our-vegas-love-story/photos/skyline.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/20 to-night/80" aria-hidden />
        <TwinkleField />
        <div className="marquee relative" aria-hidden />
        <div className="relative mt-3 text-center">
          <p className="lbl !text-[#f0d9a6]">Greetings from fabulous</p>
          <h1 className="font-script text-[54px] leading-[0.95] neon sm:text-6xl">Las Vegas</h1>
          <p className="font-display mt-1 text-[19px] font-extrabold italic text-[#fbeed2]">Our Vegas Love Story</p>
          <p className="mt-1 text-[13px] font-bold text-[#f0d9a6]">
            Jasmine &amp; Tristan · 3rd Anniversary · Nov 9–13, 2026
          </p>
        </div>
        <div className="relative mt-4">
          <Countdown />
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-2">
          <button
            className="rounded-2xl bg-white/10 px-3 py-2 text-left ring-1 ring-gold-lt/40"
            style={{ border: 0, color: "inherit" }}
            onClick={() => setTab("budget")}
          >
            <span className="lbl !text-[#f0d9a6]">Left of {fmt(totals.limit)}</span>
            <span className="font-display num block text-2xl font-extrabold text-[#ffe9b0]">{fmt(totals.leftUnderLimit)}</span>
          </button>
          <button
            className="rounded-2xl bg-white/10 px-3 py-2 text-left ring-1 ring-gold-lt/40"
            style={{ border: 0, color: "inherit" }}
            onClick={() => setTab("budget")}
          >
            <span className="lbl !text-[#f0d9a6]">Cash left</span>
            <span className="font-display num block text-2xl font-extrabold text-[#ffe9b0]">{fmt(totals.cashRemaining)}</span>
          </button>
        </div>
        <div className="marquee relative mt-4" aria-hidden />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Up next                                                             */
/* ------------------------------------------------------------------ */

function UpNext() {
  const now = useNow(30000);
  const { state } = useStore();
  const { goToStop } = useUi();
  if (tripPhase(now) !== "during" || now == null) return null;
  const v = vegasNow(now);
  const day = DAYS.find((d) => d.iso === v.iso);
  if (!day) return null;
  const list = stopsForDay(day.index);
  const next = list.find((s) => !state.stops[s.id].done && s.start >= v.minutes - 45) ?? list.find((s) => !state.stops[s.id].done);
  if (!next) return null;
  const prev = list[list.indexOf(next) - 1] ?? null;
  const showDir = prev && prev.address !== next.address;
  return (
    <section className="card pop relative overflow-hidden p-4" aria-label="Up next">
      <Sparkle className="twinkle" size={16} style={{ right: 14, top: 12 }} />
      <p className="lbl">Up next · {next.time}</p>
      <h2 className="font-display mt-1 text-xl font-extrabold text-burgundy">{next.title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{next.leg ? `${next.leg.distance} · ${next.leg.time}` : next.address}</p>
      <div className="mt-3 flex gap-2">
        <a className="btn btn-primary flex-1" target="_blank" rel="noopener noreferrer" href={showDir ? mapsDirUrl(prev, next, modeFor(next)) : mapsPlaceUrl(next)}>
          <Icon name="nav" size={18} /> {showDir ? "Directions" : "Open in Maps"}
        </a>
        <button className="btn btn-ghost" onClick={() => goToStop(next.id)}>
          See stop
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stop card                                                           */
/* ------------------------------------------------------------------ */

function ConfirmFlags({ stop }: { stop: Stop }) {
  const { state, setConfirmed } = useStore();
  if (!stop.confirm?.length) return null;
  return (
    <ul className="space-y-2">
      {stop.confirm.map((c) => {
        const st = state.confirmed[c.id];
        return (
          <li key={c.id} className={`rounded-xl border px-3 py-2 ${st?.done ? "border-sage/50 bg-sage/10" : "border-gold/60 bg-gold-lt/25"}`}>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-6 w-6 shrink-0 accent-[#5e1626]"
                checked={!!st?.done}
                onChange={(e) => setConfirmed(c.id, { done: e.target.checked })}
                aria-label={`Confirmed: ${c.text}`}
              />
              <span className="text-[14px] font-semibold leading-snug">
                <span className="chip mr-1.5 !px-2 !py-0.5 text-[11px]" style={{ background: st?.done ? "#6b7b4a" : "#b3842f", color: "#fff" }}>
                  {st?.done ? "Confirmed" : "Confirm"}
                </span>
                {c.text}
              </span>
            </label>
            <input
              className="field mt-2 !min-h-[40px] text-[15px]"
              placeholder="What we found out (times, prices, stop…)"
              value={st?.note ?? ""}
              onChange={(e) => setConfirmed(c.id, { note: e.target.value })}
              aria-label={`Notes for: ${c.text}`}
            />
          </li>
        );
      })}
    </ul>
  );
}

export function StopCard({ stop, prev, index }: { stop: Stop; prev: Stop | null; index: number }) {
  const { state, totals, patchStop, toggleDone, deleteExtra } = useStore();
  const { openAdd, openEdit, celebrate, focusStop } = useUi();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const st = state.stops[stop.id];
  const extras = state.extras.filter((e) => e.stopId === stop.id);
  const stopTotal = totals.stopSpent[stop.id] ?? 0;
  const pendingConfirm = (stop.confirm ?? []).filter((c) => !state.confirmed[c.id]?.done).length;
  const showDir = prev && prev.address !== stop.address;
  const cat = stop.category ? CAT[stop.category] : null;
  const extrasTotal = extras.reduce((a, e) => a + e.amount, 0);

  useEffect(() => {
    if (focusStop === stop.id) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, [focusStop, stop.id]);

  const done = st.done;

  return (
    <article
      ref={ref}
      id={`stop-${stop.id}`}
      className={`card relative scroll-mt-24 overflow-hidden ${done ? "ring-2 ring-sage/60" : ""}`}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      {/* Photo */}
      <div className="relative">
        <Photo id={stop.photo} kind={stop.kind} alt={stop.title} className="h-40 w-full" eager={index === 0} />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-night/75 to-transparent" aria-hidden />
        <div className="absolute bottom-2 left-3 right-16 flex flex-wrap items-center gap-2">
          <span className="chip bg-gold-lt text-espresso shadow">
            <Icon name="clock" size={14} /> {stop.time}
          </span>
          {cat ? (
            <span className="chip bg-paper/95 text-burgundy">
              {cat.emoji} {cat.short}
            </span>
          ) : (
            <span className="chip bg-paper/95 text-sage">Free</span>
          )}
        </div>
        <button
          onClick={() => {
            const nowDone = toggleDone(stop.id);
            if (nowDone && stop.stamp) celebrate(stop.stamp);
          }}
          aria-pressed={done}
          aria-label={done ? `Undo complete: ${stop.title}` : `Mark complete: ${stop.title}`}
          className={`absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full shadow-lg ${
            done ? "bg-sage text-white" : "bg-paper/95 text-burgundy"
          }`}
          style={{ border: "2px solid rgba(232,201,124,0.9)" }}
        >
          <Icon name={done ? "check" : "stamp"} size={24} />
        </button>
        {pendingConfirm > 0 ? (
          <span className="chip absolute left-3 top-3 bg-gold text-white shadow">
            <Icon name="alert" size={14} /> {pendingConfirm} to confirm
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-[21px] font-extrabold leading-tight text-burgundy">{stop.title}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-ink">{stop.blurb}</p>
        </div>

        {stop.leg ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-parchment/70 px-3 py-2 text-[13px] font-bold text-ink">
            <span className="inline-flex items-center gap-1.5 text-wine">
              <Icon name={MODE_ICON[stop.leg.mode]} size={18} /> {MODE_LABEL[stop.leg.mode]}
            </span>
            <span className="num">{stop.leg.distance}</span>
            <span className="num">{stop.leg.time}</span>
            {prev && prev.address !== stop.address ? <span className="font-semibold text-ink-soft">from {prev.title}</span> : null}
          </div>
        ) : null}

        {/* Estimated | Actual | Paid with | Notes */}
        <div className="rounded-2xl border border-gold/40 bg-white/60 p-3" role="group" aria-label={`Costs for ${stop.title}`}>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 sm:grid-cols-[auto_1fr_auto]">
            <div>
              <span className="lbl">Estimated</span>
              <div className="font-display num flex min-h-[44px] items-center text-[22px] font-extrabold text-ink-soft">{fmt(stop.est)}</div>
            </div>
            <div>
              <span className="lbl">Actual spent</span>
              <MoneyField
                value={st.actual}
                onChange={(v) => patchStop(stop.id, { actual: v })}
                label={`Actual spent at ${stop.title}`}
                placeholder="Enter when paid"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="lbl">Paid with</span>
              <div className="mt-1">
                <PayToggle value={st.method} onChange={(m) => patchStop(stop.id, { method: m })} label={`Paid with at ${stop.title}`} />
              </div>
            </div>
            <label className="col-span-2 sm:col-span-3">
              <span className="lbl">Notes</span>
              <input
                className="field mt-1"
                value={st.notes}
                placeholder="What we ordered, tips, memories…"
                onChange={(e) => patchStop(stop.id, { notes: e.target.value })}
              />
            </label>
          </div>
          {stop.assumed ? <p className="mt-2 text-[12.5px] italic text-ink-soft">{stop.assumed}</p> : null}
          {!stop.category ? (
            <p className="mt-2 text-[12.5px] italic text-ink-soft">Free stop — anything spent here comes out of the protected cushion.</p>
          ) : null}
          {st.actual != null ? (
            <div className="mt-2 flex items-center justify-between text-[13px] font-bold">
              <span className={st.actual > stop.est ? "text-wine" : "text-sage"}>
                {st.actual === stop.est ? "Right on estimate" : st.actual > stop.est ? `${fmt(st.actual - stop.est)} over estimate` : `${fmt(stop.est - st.actual)} under estimate`}
              </span>
              <button className="underline" style={{ background: "transparent", border: 0, color: "var(--color-wine)", minHeight: 40 }} onClick={() => patchStop(stop.id, { actual: null })}>
                Clear actual
              </button>
            </div>
          ) : null}

          {extras.length ? (
            <ul className="mt-3 space-y-2 border-t border-dashed border-gold/50 pt-3" aria-label="Add-on expenses">
              {extras.map((e) => (
                <li key={e.id} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2">
                  <button className="min-w-0 flex-1 text-left" style={{ background: "transparent", border: 0 }} onClick={() => openEdit(e.id)}>
                    <span className="block truncate text-[14px] font-bold">{e.label}</span>
                    <span className="text-[12px] text-ink-soft">
                      Add-on · {e.method === "cash" ? "Cash" : "Card"} · {CAT[e.category].short}
                    </span>
                  </button>
                  <span className="font-display num text-base font-extrabold">{fmt(e.amount)}</span>
                  <button className="btn btn-ghost !min-h-[40px] !px-2.5" onClick={() => openEdit(e.id)} aria-label={`Edit ${e.label}`}>
                    <Icon name="pencil" size={16} />
                  </button>
                  <button className="btn btn-danger !min-h-[40px] !px-2.5" onClick={() => deleteExtra(e.id)} aria-label={`Delete ${e.label}`}>
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
              <li className="flex justify-between px-1 text-[13px] font-extrabold">
                <span>Stop total (actual + add-ons)</span>
                <span className="num">{fmt(stopTotal)}</span>
              </li>
            </ul>
          ) : extrasTotal === 0 && stopTotal > 0 ? null : null}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <a
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            href={showDir ? mapsDirUrl(prev, stop, modeFor(stop)) : mapsPlaceUrl(stop)}
          >
            <Icon name="nav" size={18} /> {showDir ? "Directions" : "Open in Maps"}
          </a>
          {stop.url ? (
            <a className="btn btn-gold" target="_blank" rel="noopener noreferrer" href={stop.url}>
              <Icon name="link" size={18} /> {stop.urlLabel ?? "Website"}
            </a>
          ) : (
            <a className="btn btn-gold" target="_blank" rel="noopener noreferrer" href={mapsPlaceUrl(stop)}>
              <Icon name="map" size={18} /> Pin on map
            </a>
          )}
          <button className="btn btn-ghost" onClick={() => openAdd({ stopId: stop.id })}>
            <Icon name="plus" size={18} /> Add expense
          </button>
          <button className="btn btn-ghost" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            Details <Icon name="down" size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open ? (
          <div className="fade space-y-3 border-t border-dashed border-gold/50 pt-3 text-[14.5px]">
            <dl className="space-y-2">
              <div>
                <dt className="lbl">Address</dt>
                <dd>
                  <a className="font-bold text-wine underline" target="_blank" rel="noopener noreferrer" href={mapsPlaceUrl(stop)}>
                    {stop.address}
                  </a>
                </dd>
              </div>
              {stop.url ? (
                <div>
                  <dt className="lbl">Official website</dt>
                  <dd>
                    <a className="break-all font-bold text-wine underline" target="_blank" rel="noopener noreferrer" href={stop.url}>
                      {stop.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
              {stop.leg ? (
                <div>
                  <dt className="lbl">
                    Getting there · {stop.leg.distance} · {stop.leg.time}
                  </dt>
                  <dd>{stop.leg.how}</dd>
                </div>
              ) : null}
            </dl>
            {stop.tips?.length ? (
              <ul className="space-y-1.5">
                {stop.tips.map((t) => (
                  <li key={t} className="flex gap-2 rounded-xl bg-blush/50 px-3 py-2">
                    <Sparkle size={12} className="mt-1 shrink-0 text-gold" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <ConfirmFlags stop={stop} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Plan screen                                                         */
/* ------------------------------------------------------------------ */

export default function Plan() {
  const { state, totals, setDayNote } = useStore();
  const { day, setDay, setTab } = useUi();
  const now = useNow(60000);
  const today = currentTripDay(now);
  const info = DAYS[day];
  const stops = useMemo(() => stopsForDay(day), [day]);
  const tabsRef = useRef<HTMLDivElement>(null);

  const pending = CONFIRMATIONS.filter((c) => !state.confirmed[c.id]?.done).length;
  const dayEst = stops.reduce((a, s) => a + (s.category ? s.est : 0), 0);
  const daySpent = stops.reduce((a, s) => a + (totals.stopSpent[s.id] ?? 0), 0);
  const dayDone = stops.filter((s) => state.stops[s.id].done).length;
  const stampable = stops.filter((s) => s.stamp);
  const stampsGot = stampable.filter((s) => state.stops[s.id].done).length;

  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [day]);

  return (
    <div className="space-y-4">
      <Hero />
      <UpNext />

      {pending > 0 ? (
        <button
          className="flex w-full items-center gap-3 rounded-2xl border border-gold/60 bg-gold-lt/30 px-4 py-3 text-left"
          onClick={() => setTab("tools")}
        >
          <Icon name="alert" className="shrink-0 text-gold" />
          <span className="flex-1 text-[14px] font-bold">
            {pending} details still need confirming
            <span className="block text-[12.5px] font-semibold text-ink-soft">Shuttle, pool and happy-hour times — tap to review</span>
          </span>
          <Icon name="down" className="-rotate-90 text-ink-soft" />
        </button>
      ) : null}

      {/* Day selector */}
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Trip days"
        className="no-scrollbar sticky top-[var(--hdr)] z-20 -mx-4 flex gap-2 overflow-x-auto bg-cream/95 px-4 py-2 backdrop-blur"
      >
        {DAYS.map((d) => (
          <button
            key={d.index}
            role="tab"
            aria-selected={day === d.index}
            onClick={() => setDay(d.index)}
            className={`relative shrink-0 rounded-2xl px-4 py-2 text-left ${
              day === d.index ? "bg-burgundy text-[#fdf1d6] shadow-lg" : "bg-paper text-ink ring-1 ring-gold/40"
            }`}
            style={{ border: 0, minHeight: 56 }}
          >
            <span className="block text-[11px] font-extrabold uppercase tracking-wider opacity-80">{d.weekday.slice(0, 3)}</span>
            <span className="font-display text-lg font-extrabold">{d.label}</span>
            {today === d.index ? <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-gold-lt ring-2 ring-burgundy" aria-label="Today" /> : null}
          </button>
        ))}
      </div>

      {/* Day header */}
      <section className="card relative overflow-hidden p-4" aria-label={`${info.weekday} summary`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="lbl">
              {info.weekday} · {info.label}, 2026
            </p>
            <h2 className="font-display text-[26px] font-extrabold leading-tight text-burgundy">{info.title}</h2>
            <p className="font-script text-2xl text-wine">{info.tagline}</p>
          </div>
          <span className="floaty text-4xl" aria-hidden>
            {info.emoji}
          </span>
        </div>
        <div className="mt-3 rounded-xl bg-parchment/70 px-3 py-2">
          <WeatherChip iso={info.iso} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/60 py-2">
            <div className="lbl">Planned</div>
            <div className="font-display num text-lg font-extrabold">{fmt(dayEst)}</div>
          </div>
          <div className="rounded-xl bg-white/60 py-2">
            <div className="lbl">Spent</div>
            <div className="font-display num text-lg font-extrabold text-wine">{fmt(daySpent)}</div>
          </div>
          <div className="rounded-xl bg-white/60 py-2">
            <div className="lbl">Stops</div>
            <div className="font-display num text-lg font-extrabold">
              {dayDone}/{stops.length}
            </div>
          </div>
        </div>
        <a className="btn btn-gold mt-3 w-full" target="_blank" rel="noopener noreferrer" href={mapsDayRouteUrl(stops)}>
          <Icon name="map" size={18} /> Open whole day in Google Maps
        </a>
        {stampable.length > 0 && stampsGot === stampable.length ? (
          <div className="pop mt-3 rounded-2xl border-2 border-dashed border-gold bg-blush/60 p-3 text-center">
            <p className="lbl">Day complete · love note unlocked</p>
            <p className="font-script mt-1 text-2xl leading-snug text-burgundy">{info.loveNote}</p>
          </div>
        ) : stampable.length > 0 ? (
          <p className="mt-3 text-center text-[13px] font-bold text-ink-soft">
            Collect all {stampable.length} stamps today to unlock a love note ({stampsGot}/{stampable.length})
          </p>
        ) : null}
      </section>

      {/* Stops */}
      <div className="space-y-4">
        {stops.map((s, i) => (
          <StopCard key={s.id} stop={s} prev={stops[i - 1] ?? null} index={i} />
        ))}
      </div>

      {/* Day notes */}
      <section className="card p-4">
        <label>
          <span className="lbl">Our notes for {info.weekday}</span>
          <textarea
            className="field mt-1 min-h-[96px]"
            placeholder="Favorite moments, things to remember, ideas for tomorrow…"
            value={state.dayNotes[day] ?? ""}
            onChange={(e) => setDayNote(day, e.target.value)}
          />
        </label>
      </section>

      {day < DAYS.length - 1 ? (
        <button className="btn btn-primary w-full" onClick={() => { setDay(day + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          Next: {DAYS[day + 1].title} →
        </button>
      ) : null}
    </div>
  );
}

export { STOPS, STOP_BY_ID };
