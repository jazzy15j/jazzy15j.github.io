"use client";

import { useMemo, useState } from "react";
import { DAYS, HOTEL, stopsForDay } from "../lib/data";
import { mapsDayRouteUrl, mapsDirUrl, mapsPlaceUrl, modeFor } from "../lib/geo";
import { fmt } from "../lib/money";
import { useStore } from "../lib/store";
import type { Stop } from "../lib/types";
import { Collapse, Icon, Sparkle } from "./ui";
import { useUi } from "./uiCtx";

/* ------------------------------------------------------------------ */
/* Schematic geography                                                 */
/* ------------------------------------------------------------------ */

type LL = [number, number]; // lat, lng

const STRIP: LL[] = [
  [36.097, -115.1735],
  [36.102, -115.1723],
  [36.1076, -115.1728],
  [36.1126, -115.1722],
  [36.1166, -115.1715],
  [36.1215, -115.1712],
  [36.1268, -115.17],
  [36.1335, -115.166],
];

const MONORAIL: { name: string; at: LL }[] = [
  { name: "MGM Grand", at: [36.1029, -115.1662] },
  { name: "Horseshoe/Paris", at: [36.1126, -115.1664] },
  { name: "Flamingo/Caesars", at: [36.1157, -115.166] },
  { name: "Harrah’s/LINQ", at: [36.1181, -115.1662] },
];

const W = 360;
const H = 470;

interface Proj {
  x: (lng: number) => number;
  y: (lat: number) => number;
}

function fit(points: LL[]): Proj {
  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minX = Math.min(...lngs) * k;
  const maxX = Math.max(...lngs) * k;
  const padX = Math.max((maxX - minX) * 0.22, 0.0016);
  const padY = Math.max((maxLat - minLat) * 0.18, 0.0018);
  const spanX = maxX - minX + padX * 2;
  const spanY = maxLat - minLat + padY * 2;
  const s = Math.min((W - 24) / spanX, (H - 24) / spanY);
  const cx = (minX + maxX) / 2;
  const cy = (minLat + maxLat) / 2;
  return {
    x: (lng) => W / 2 + (lng * k - cx) * s,
    y: (lat) => H / 2 - (lat - cy) * s,
  };
}

interface Cluster {
  x: number;
  y: number;
  idx: number[];
  stops: Stop[];
}

function cluster(stops: Stop[], p: Proj): Cluster[] {
  const out: Cluster[] = [];
  stops.forEach((s, i) => {
    const x = p.x(s.lng);
    const y = p.y(s.lat);
    const hit = out.find((c) => Math.hypot(c.x - x, c.y - y) < 22);
    if (hit) {
      hit.idx.push(i + 1);
      hit.stops.push(s);
    } else out.push({ x, y, idx: [i + 1], stops: [s] });
  });
  return out;
}

const shortTitle = (t: string) =>
  t
    .replace("Social Hour", "")
    .replace(" — anniversary dinner", "")
    .replace("Happy Hour", "")
    .replace("Hotel pool", "Pool")
    .replace("Shops at ", "")
    .replace("The ", "")
    .trim();

/* ------------------------------------------------------------------ */
/* One illustrated map                                                 */
/* ------------------------------------------------------------------ */

function IllustratedMap({
  stops,
  region,
  selected,
  onSelect,
  allStops,
}: {
  stops: Stop[];
  region: "strip" | "downtown";
  selected: string | null;
  onSelect: (id: string) => void;
  allStops: Stop[];
}) {
  const pts: LL[] = stops.map((s) => [s.lat, s.lng]);
  if (region === "strip") {
    // keep the monorail visible when we're riding it
    if (stops.some((s) => s.id === "wed-monorail" || s.id === "wed-return")) pts.push(MONORAIL[0].at, MONORAIL[3].at);
  }
  const p = useMemo(() => fit(pts), [stops, region]); // eslint-disable-line react-hooks/exhaustive-deps
  const clusters = cluster(stops, p);
  const route = clusters.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const strip = STRIP.map(([la, ln]) => `${p.x(ln).toFixed(1)},${p.y(la).toFixed(1)}`).join(" ");
  const rail = MONORAIL.map((m) => `${p.x(m.at[1]).toFixed(1)},${p.y(m.at[0]).toFixed(1)}`).join(" ");
  const showRail = region === "strip";

  return (
    <div className="relative overflow-hidden rounded-[20px] border-[3px] border-gold bg-[#f1e2bd] shadow-inner">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="group" aria-label={`Illustrated ${region === "strip" ? "Las Vegas Strip" : "Fremont Street"} map`}>
        <defs>
          <pattern id={`grid-${region}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="rgba(122,96,77,0.14)" strokeWidth="1" />
          </pattern>
          <radialGradient id={`vig-${region}`} cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="rgba(94,22,38,0)" />
            <stop offset="100%" stopColor="rgba(94,22,38,0.22)" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#f1e2bd" />
        <rect width={W} height={H} fill={`url(#grid-${region})`} />

        {region === "strip" ? (
          <>
            {/* Strip */}
            <polyline points={strip} fill="none" stroke="#d8c08a" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={strip} fill="none" stroke="#fffaf0" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={strip} fill="none" stroke="#e0b862" strokeWidth="1.4" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
            <text x={p.x(-115.1722)} y={p.y(36.1076) + 3} fontSize="9" fontFamily="'Special Elite', serif" fill="#86243a" textAnchor="middle" letterSpacing="2" transform={`rotate(-80 ${p.x(-115.1722)} ${p.y(36.1076)})`}>
              THE STRIP
            </text>
            {/* Monorail */}
            {showRail ? (
              <g>
                <polyline points={rail} fill="none" stroke="#a2566a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={rail} fill="none" stroke="#fffaf0" strokeWidth="1" strokeDasharray="3 4" strokeLinecap="round" />
                {MONORAIL.map((m) => (
                  <g key={m.name}>
                    <rect x={p.x(m.at[1]) - 4} y={p.y(m.at[0]) - 4} width="8" height="8" rx="2" fill="#a2566a" stroke="#fffaf0" strokeWidth="1.5" />
  
                  </g>
                ))}
                <text x={p.x(MONORAIL[0].at[1]) + 10} y={p.y(MONORAIL[0].at[0]) + 16} fontSize="7.5" fill="#7b3a4c" fontFamily="'Special Elite', serif">
                  ▮ MONORAIL
                </text>
              </g>
            ) : null}
          </>
        ) : (
          <>
            {/* Fremont Street pedestrian mall + Las Vegas Blvd */}
            <rect x={p.x(-115.1458)} y={p.y(36.1704) - 9} width={p.x(-115.1402) - p.x(-115.1458)} height="18" rx="8" fill="#fff6dc" stroke="#e0b862" strokeWidth="1.4" />
            <line x1="0" x2={W} y1={p.y(36.1701)} y2={p.y(36.1701)} stroke="#d8c08a" strokeWidth="14" />
            <line x1="0" x2={W} y1={p.y(36.1701)} y2={p.y(36.1701)} stroke="#fffaf0" strokeWidth="9" />
            <line y1="0" y2={H} x1={p.x(-115.1398)} x2={p.x(-115.1398)} stroke="#d8c08a" strokeWidth="14" />
            <line y1="0" y2={H} x1={p.x(-115.1398)} x2={p.x(-115.1398)} stroke="#fffaf0" strokeWidth="9" />
            <text x={p.x(-115.1432)} y={p.y(36.1704) - 14} fontSize="8.5" textAnchor="middle" fontFamily="'Special Elite', serif" fill="#86243a" letterSpacing="1">
              ✦ CANOPY ✦
            </text>
            <text x="8" y={p.y(36.1701) + 3} fontSize="8.5" fontFamily="'Special Elite', serif" fill="#86243a" letterSpacing="1.5">
              FREMONT ST
            </text>
            <text x={p.x(-115.1398) + 11} y="16" fontSize="8.5" fontFamily="'Special Elite', serif" fill="#86243a" letterSpacing="1.5" transform={`rotate(90 ${p.x(-115.1398) + 11} 16)`}>
              LAS VEGAS BLVD
            </text>
          </>
        )}

        <rect width={W} height={H} fill={`url(#vig-${region})`} />

        {/* Route */}
        {clusters.length > 1 ? (
          <>
            <polyline points={route} fill="none" stroke="#fffaf0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <polyline points={route} fill="none" stroke="#86243a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="route-line" />
          </>
        ) : null}

        {/* Other days' pins, faint */}
        {allStops
          .filter((s) => !stops.includes(s) && (region === "strip" ? s.lat < 36.15 : s.lat >= 36.15))
          .map((s) => (
            <circle key={s.id} cx={p.x(s.lng)} cy={p.y(s.lat)} r="3" fill="#b3842f" opacity="0.45" />
          ))}

        {/* Pins + labels */}
        {clusters.map((c, i) => {
          const first = c.stops[0];
          const isSel = c.stops.some((s) => s.id === selected);
          const right = c.x < W * 0.58;
          const lead = c.stops.find((x) => x.kind !== "ride" && x.kind !== "walk") ?? first;
          const label = shortTitle(lead.title) + (c.stops.length > 1 ? ` +${c.stops.length - 1}` : "");
          const tx = right ? c.x + 17 : c.x - 17;
          return (
            <g
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Stop ${c.idx.join(", ")}: ${first.title}`}
              onClick={() => onSelect(first.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(first.id)}
              style={{ cursor: "pointer", animation: `pinDrop .5s ${i * 60}ms both` }}
            >
              <circle cx={c.x} cy={c.y} r={isSel ? 17 : 14.5} fill="#fffaf0" stroke="#b3842f" strokeWidth="1.5" />
              <circle cx={c.x} cy={c.y} r={isSel ? 14 : 12} fill={isSel ? "#5e1626" : "#86243a"} />
              <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize={c.idx.length > 2 ? 8.5 : 11} fontWeight="800" fill="#fdf1d6" fontFamily="'Nunito Sans', sans-serif">
                {c.idx.length > 1 ? `${c.idx[0]}+` : c.idx[0]}
              </text>
              <text
                x={tx}
                y={c.y + (i % 2 === 0 ? 4 : 19)}
                textAnchor={right ? "start" : "end"}
                fontSize="10.5"
                fontWeight="800"
                fill="#3a2417"
                paintOrder="stroke"
                stroke="#f6ecd6"
                strokeWidth="3.5"
                strokeLinejoin="round"
                fontFamily="'Nunito Sans', sans-serif"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Decorations */}
        <g transform="translate(318 34)" aria-hidden="true">
          <circle r="19" fill="none" stroke="#b3842f" strokeWidth="1.2" />
          <path d="M0 -17 L4 0 L0 17 L-4 0Z" fill="#86243a" />
          <path d="M-17 0 L0 -4 L17 0 L0 4Z" fill="#b3842f" opacity=".7" />
          <text y="-21" textAnchor="middle" fontSize="9" fontWeight="800" fill="#5e1626">
            N
          </text>
        </g>
        <g aria-hidden="true" fill="#b3842f">
          <g transform="translate(24 28) scale(.6)"><path d="M12 0c.8 6.200 5.800 11.200 12 12-6.200.8-11.200 5.800-12 12-.8-6.200-5.800-11.200-12-12C6.200 11.200 11.200 6.200 12 0z" /></g>
          <g transform="translate(30 440) scale(.5)"><path d="M12 0c.8 6.200 5.800 11.200 12 12-6.200.8-11.200 5.800-12 12-.8-6.200-5.800-11.200-12-12C6.200 11.200 11.200 6.200 12 0z" /></g>
        </g>
        <text x={W - 10} y={H - 10} textAnchor="end" fontSize="8" fontFamily="'Special Elite', serif" fill="#7a604d">
          schematic · not to scale
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Leg row                                                             */
/* ------------------------------------------------------------------ */

const MODE_ICON: Record<string, string> = { walk: "walk", transit: "bus", shuttle: "shuttle", taxi: "car", none: "walk" };

function RouteList({ stops, selected, onSelect }: { stops: Stop[]; selected: string | null; onSelect: (id: string) => void }) {
  const { state } = useStore();
  const { goToStop } = useUi();
  return (
    <ol className="space-y-0">
      {stops.map((s, i) => {
        const prev = stops[i - 1];
        const moved = prev && prev.address !== s.address;
        const isSel = selected === s.id;
        return (
          <li key={s.id}>
            {moved && s.leg ? (
              <div className="ml-[15px] border-l-[3px] border-dashed border-wine/40 py-2 pl-6">
                <div className="rounded-xl bg-parchment/70 px-3 py-2 text-[13.5px]">
                  <div className="flex flex-wrap items-center gap-x-3 font-extrabold text-wine">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name={MODE_ICON[s.leg.mode]} size={17} /> {s.leg.mode === "walk" ? "Walk" : s.leg.mode === "transit" ? "Transit" : s.leg.mode === "shuttle" ? "Shuttle" : "Taxi"}
                    </span>
                    <span className="num text-ink">{s.leg.distance}</span>
                    <span className="num text-ink">{s.leg.time}</span>
                  </div>
                  <p className="mt-1 leading-snug text-ink">{s.leg.how}</p>
                  <a className="mt-1.5 inline-flex min-h-[36px] items-center gap-1.5 font-extrabold text-wine underline" target="_blank" rel="noopener noreferrer" href={mapsDirUrl(prev, s, modeFor(s))}>
                    <Icon name="nav" size={15} /> Directions in Google Maps
                  </a>
                </div>
              </div>
            ) : prev ? (
              <div className="ml-[15px] h-3 border-l-[3px] border-dashed border-wine/40" />
            ) : null}
            <div className={`flex items-center gap-3 rounded-2xl p-2 ${isSel ? "bg-gold-lt/40 ring-2 ring-gold" : ""}`}>
              <button
                onClick={() => onSelect(s.id)}
                className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  state.stops[s.id].done ? "bg-sage text-white" : "bg-wine text-[#fdf1d6]"
                }`}
                style={{ border: "2px solid #e8c97c" }}
                aria-label={`Select stop ${i + 1}`}
              >
                {state.stops[s.id].done ? <Icon name="check" size={16} /> : i + 1}
              </button>
              <button className="min-w-0 flex-1 text-left" style={{ background: "transparent", border: 0 }} onClick={() => goToStop(s.id)}>
                <span className="block truncate text-[15px] font-extrabold">{s.title}</span>
                <span className="block truncate text-[12.5px] text-ink-soft">
                  {s.time} · {s.address.split(",")[0]}
                </span>
              </button>
              <a className="btn btn-ghost !min-h-[40px] !px-3" target="_blank" rel="noopener noreferrer" href={mapsPlaceUrl(s)} aria-label={`Open ${s.title} in Google Maps`}>
                <Icon name="map" size={17} />
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function MapView() {
  const { day, setDay, goToStop } = useUi();
  const [selected, setSelected] = useState<string | null>(null);
  const info = DAYS[day];
  const stops = useMemo(() => stopsForDay(day), [day]);
  const allStops = useMemo(() => DAYS.flatMap((d) => stopsForDay(d.index)), []);
  const strip = stops.filter((s) => s.lat < 36.15 && s.lat > 36.095);
  const offMap = stops.filter((s) => s.lat <= 36.095);
  const downtown = stops.filter((s) => s.lat >= 36.15);
  const sel = stops.find((s) => s.id === selected) ?? null;

  return (
    <div className="space-y-4">
      <div>
        <p className="lbl">Daily adventure map</p>
        <h1 className="font-display text-[28px] font-extrabold leading-tight text-burgundy">Where we’re wandering</h1>
      </div>

      <div role="tablist" aria-label="Choose a day" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {DAYS.map((d) => (
          <button
            key={d.index}
            role="tab"
            aria-selected={day === d.index}
            onClick={() => {
              setDay(d.index);
              setSelected(null);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold ${day === d.index ? "bg-burgundy text-[#fdf1d6]" : "bg-paper text-ink ring-1 ring-gold/40"}`}
            style={{ border: 0, minHeight: 44 }}
          >
            {d.short}
          </button>
        ))}
      </div>

      <section className="card p-3" aria-label={`${info.weekday} map`}>
        <div className="flex items-center justify-between px-1 pb-2">
          <div>
            <h2 className="font-display text-lg font-extrabold text-burgundy">{info.title}</h2>
            <p className="text-[12.5px] text-ink-soft">Tap a pin for details · numbers follow the day’s order</p>
          </div>
          <a className="btn btn-gold !min-h-[40px] !px-3 text-[13px]" target="_blank" rel="noopener noreferrer" href={mapsDayRouteUrl(stops)}>
            <Icon name="nav" size={16} /> Full route
          </a>
        </div>

        {strip.length ? (
          <IllustratedMap stops={strip} region="strip" selected={selected} onSelect={setSelected} allStops={allStops} />
        ) : null}
        {offMap.length ? (
          <p className="mt-2 rounded-xl bg-parchment/70 px-3 py-2 text-[13px] font-bold">
            ✈ Off the map (airport): {offMap.map((s) => s.title).join(" · ")} — use the route list below.
          </p>
        ) : null}
        {downtown.length ? (
          <div className="mt-3">
            <p className="lbl mb-1 px-1">Downtown · Fremont Street</p>
            <IllustratedMap stops={downtown} region="downtown" selected={selected} onSelect={setSelected} allStops={allStops} />
          </div>
        ) : null}

        {sel ? (
          <div className="pop mt-3 rounded-2xl border border-gold/50 bg-white/70 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="lbl">{sel.time}</p>
                <h3 className="font-display text-lg font-extrabold text-burgundy">{sel.title}</h3>
                <p className="text-[13.5px] text-ink-soft">{sel.address}</p>
                {sel.est > 0 ? <p className="mt-1 text-[13px] font-bold">Estimated for two: {fmt(sel.est)}</p> : null}
              </div>
              <Sparkle size={16} className="text-gold" />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a className="btn btn-primary" target="_blank" rel="noopener noreferrer" href={mapsPlaceUrl(sel)}>
                <Icon name="map" size={17} /> Open pin
              </a>
              <button className="btn btn-ghost" onClick={() => goToStop(sel.id)}>
                See stop card
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="card p-4" aria-label="Route and directions">
        <h2 className="font-display text-xl font-extrabold text-burgundy">Route &amp; how to get there</h2>
        <p className="mb-3 text-[13px] text-ink-soft">Distances and times are estimates. Tap Directions for live Google Maps timing.</p>
        <RouteList stops={stops} selected={selected} onSelect={setSelected} />
      </section>

      <Collapse title="Getting around Las Vegas" icon="bus" defaultOpen={false}>
        <ul className="space-y-3 text-[14.5px]">
          <li>
            <b className="text-wine">Walking.</b> Strip blocks are longer than they look (~20 min per mile, more with crossings and casino mazes). Use pedestrian bridges and go through casinos in the heat of the day. Bring comfy shoes.
          </li>
          <li>
            <b className="text-wine">Las Vegas Monorail.</b> Runs behind the east side of the Strip. Our plan: MGM Grand → Flamingo/Caesars Palace, and home from Harrah’s/The LINQ. $23 for two round trip is our budget. Check the last train at{" "}
            <a className="underline" href="https://www.lvmonorail.com/" target="_blank" rel="noopener noreferrer">
              lvmonorail.com
            </a>
            .
          </li>
          <li>
            <b className="text-wine">Deuce bus (RTC).</b> Double-decker up and down the Strip to Fremont Street. Buy 24-hour passes in the rideRTC app or at stop machines.{" "}
            <a className="underline" href="https://www.rtcsnv.com/ways-to-travel/fares-passes/" target="_blank" rel="noopener noreferrer">
              Fares &amp; passes
            </a>
            .
          </li>
          <li>
            <b className="text-wine">Free trams.</b> A free tram links Park MGM ↔ Aria ↔ Bellagio — handy for Tuesday. Confirm it’s running that day.
          </li>
          <li>
            <b className="text-wine">Planet 13 shuttle.</b> Free from New York-New York — times unconfirmed. Backup: taxi or rideshare from the $50 backup fund.
          </li>
          <li>
            <b className="text-wine">Taxis.</b> Airport rides budgeted at ~$35 each way. Hotel bell desks and casino taxi stands are the easiest places to find one.
          </li>
        </ul>
        <p className="mt-3 rounded-xl bg-blush/50 px-3 py-2 text-[13px]">
          Home base: <b>{HOTEL.name}</b>, {HOTEL.address}.
        </p>
      </Collapse>
    </div>
  );
}
