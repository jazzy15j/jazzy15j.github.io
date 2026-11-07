"use client";

import { useRef, useState } from "react";
import credits from "../lib/credits.json";
import { CONFIRMATIONS, DAYS, STOPS, STOP_BY_ID } from "../lib/data";
import { fmtClock, sunTimes } from "../lib/geo";
import { fmt, r2 } from "../lib/money";
import { uid, useStore } from "../lib/store";
import { describeWeather } from "../lib/weather";
import { Countdown, useWeather } from "./Info";
import { Collapse, Icon, MoneyField } from "./ui";
import { useUi } from "./uiCtx";

/* ------------------------------ Confirm list ------------------------------ */

function ConfirmList() {
  const { state, setConfirmed } = useStore();
  const { goToStop } = useUi();
  return (
    <ul className="space-y-2">
      {CONFIRMATIONS.map((c) => {
        const st = state.confirmed[c.id];
        const first = STOP_BY_ID[c.stops[0]];
        return (
          <li key={c.id} className={`rounded-xl border px-3 py-2 ${st?.done ? "border-sage/50 bg-sage/10" : "border-gold/60 bg-gold-lt/25"}`}>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-6 w-6 shrink-0 accent-[#123d31]"
                checked={!!st?.done}
                onChange={(e) => setConfirmed(c.id, { done: e.target.checked })}
                aria-label={c.text}
              />
              <span className="text-[14.5px] font-semibold leading-snug">{c.text}</span>
            </label>
            <input
              className="field mt-2 !min-h-[40px]"
              placeholder="What we found out…"
              value={st?.note ?? ""}
              onChange={(e) => setConfirmed(c.id, { note: e.target.value })}
              aria-label={`Notes: ${c.text}`}
            />
            <button className="mt-1 min-h-[36px] text-[13px] font-extrabold text-wine underline" style={{ background: "transparent", border: 0 }} onClick={() => goToStop(first.id)}>
              Go to {first.title} →
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------------------- Packing -------------------------------- */

function Packing() {
  const { state, setPacking } = useStore();
  const [label, setLabel] = useState("");
  const groups = [...new Set(state.packing.map((p) => p.group))];
  const done = state.packing.filter((p) => p.done).length;
  return (
    <div>
      <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-ink-soft/15" role="progressbar" aria-valuemin={0} aria-valuemax={state.packing.length} aria-valuenow={done} aria-label="Packing progress">
        <div className="h-full rounded-full bg-sage transition-[width]" style={{ width: `${state.packing.length ? (done / state.packing.length) * 100 : 0}%` }} />
      </div>
      {groups.map((g) => (
        <div key={g} className="mb-3">
          <h4 className="lbl mb-1">{g}</h4>
          <ul>
            {state.packing
              .filter((p) => p.group === g)
              .map((p) => (
                <li key={p.id} className="flex items-center gap-1">
                  <label className="flex min-h-[44px] flex-1 items-center gap-3">
                    <input type="checkbox" className="h-6 w-6 shrink-0 accent-[#123d31]" checked={p.done} onChange={(e) => setPacking((l) => l.map((x) => (x.id === p.id ? { ...x, done: e.target.checked } : x)))} />
                    <span className={`text-[15px] ${p.done ? "text-ink-soft line-through" : "font-semibold"}`}>{p.label}</span>
                  </label>
                  {p.custom ? (
                    <button className="btn btn-danger !min-h-[38px] !px-2" aria-label={`Remove ${p.label}`} onClick={() => setPacking((l) => l.filter((x) => x.id !== p.id))}>
                      <Icon name="trash" size={15} />
                    </button>
                  ) : null}
                </li>
              ))}
          </ul>
        </div>
      ))}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!label.trim()) return;
          setPacking((l) => [...l, { id: uid("p"), group: "Our extras", label: label.trim(), done: false, custom: true }]);
          setLabel("");
        }}
      >
        <input className="field" placeholder="Add something to pack…" value={label} onChange={(e) => setLabel(e.target.value)} aria-label="Add packing item" />
        <button className="btn btn-primary !px-3" type="submit" aria-label="Add packing item">
          <Icon name="plus" size={18} />
        </button>
      </form>
    </div>
  );
}

/* -------------------------------- Groceries ------------------------------- */

function Groceries() {
  const { state, setGroceries, patchStop, pushToast } = useStore();
  const [name, setName] = useState("");
  const g = state.groceries;
  const total = r2(g.reduce((a, x) => a + (x.price ?? 0), 0));
  const stop = state.stops["mon-instacart"];
  return (
    <div>
      <p className="mb-3 rounded-xl bg-blush/50 px-3 py-2 text-[13.5px]">
        Starter ideas below — edit them to match the real Instacart cart. Item prices are optional and just help us see where the $49 went.
      </p>
      <ul className="space-y-2">
        {g.map((x) => (
          <li key={x.id} className="rounded-2xl bg-white/70 p-2 ring-1 ring-gold/30">
            <div className="flex items-center gap-2">
              <label className="flex min-h-[44px] min-w-0 flex-1 items-center gap-3">
                <input type="checkbox" className="h-6 w-6 shrink-0 accent-[#123d31]" checked={x.inRoom} onChange={(e) => setGroceries((l) => l.map((y) => (y.id === x.id ? { ...y, inRoom: e.target.checked } : y)))} aria-label={`${x.name} is in the room`} />
                <input
                  className="field !min-h-[40px] !border-transparent !bg-transparent !px-1 font-bold"
                  value={x.name}
                  onChange={(e) => setGroceries((l) => l.map((y) => (y.id === x.id ? { ...y, name: e.target.value } : y)))}
                  aria-label="Item name"
                />
              </label>
              <button className="btn btn-danger !min-h-[38px] !px-2" aria-label={`Delete ${x.name}`} onClick={() => setGroceries((l) => l.filter((y) => y.id !== x.id))}>
                <Icon name="trash" size={15} />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-3 pl-9">
              <div className="inline-flex items-center rounded-full bg-ink-soft/10">
                <button className="h-10 w-10 text-lg font-extrabold" style={{ background: "transparent", border: 0 }} aria-label={`Fewer ${x.name}`} onClick={() => setGroceries((l) => l.map((y) => (y.id === x.id ? { ...y, qty: Math.max(0, y.qty - 1) } : y)))}>
                  −
                </button>
                <span className="num min-w-[28px] text-center text-[15px] font-extrabold" aria-label={`${x.qty} left`}>
                  {x.qty}
                </span>
                <button className="h-10 w-10 text-lg font-extrabold" style={{ background: "transparent", border: 0 }} aria-label={`More ${x.name}`} onClick={() => setGroceries((l) => l.map((y) => (y.id === x.id ? { ...y, qty: y.qty + 1 } : y)))}>
                  +
                </button>
              </div>
              <MoneyField value={x.price} onChange={(v) => setGroceries((l) => l.map((y) => (y.id === x.id ? { ...y, price: v } : y)))} label={`Price of ${x.name}`} placeholder="price" className="w-28" />
              {x.qty === 0 ? <span className="chip bg-ink-soft/15 text-ink-soft">all gone</span> : null}
            </div>
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          setGroceries((l) => [...l, { id: uid("g"), name: name.trim(), qty: 1, price: null, inRoom: false }]);
          setName("");
        }}
      >
        <input className="field" placeholder="Add an item…" value={name} onChange={(e) => setName(e.target.value)} aria-label="Add grocery item" />
        <button className="btn btn-primary !px-3" type="submit" aria-label="Add grocery item">
          <Icon name="plus" size={18} />
        </button>
      </form>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-parchment/70 px-3 py-2 text-[14px]">
        <span className="font-bold">
          Item prices: <span className="num">{fmt(total)}</span> · Instacart est <span className="num">{fmt(49)}</span>
        </span>
        <button
          className="btn btn-ghost !min-h-[38px] !px-3 text-[13px]"
          disabled={total <= 0}
          onClick={() => {
            const prev = stop.actual;
            patchStop("mon-instacart", { actual: total });
            pushToast(`Instacart actual set to ${fmt(total)}`, () => patchStop("mon-instacart", { actual: prev }));
          }}
        >
          Use as Actual
        </button>
      </div>
      <p className="mt-2 text-[12.5px] text-ink-soft">Tip: fees and tip on the final Instacart receipt may be higher than item prices — enter the receipt total as the Actual.</p>
    </div>
  );
}

/* --------------------------------- Weather -------------------------------- */

function WeatherTable() {
  const { map, live } = useWeather();
  return (
    <div>
      <ul className="space-y-1.5">
        {DAYS.map((d) => {
          const w = map?.[d.iso];
          const sun = sunTimes(d.iso);
          const desc = w ? describeWeather(w.code) : null;
          return (
            <li key={d.iso} className="flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-gold/30">
              <span className="text-2xl" aria-hidden>
                {desc?.icon ?? "🌤️"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-extrabold">{d.short}</div>
                <div className="text-[12.5px] text-ink-soft">{desc ? `${desc.label}${w!.rain >= 20 ? ` · ${w!.rain}% rain` : ""}` : "Forecast loading / typical November"}</div>
              </div>
              <div className="text-right">
                <div className="num text-[15px] font-extrabold">{w ? `${w.hi}° / ${w.lo}°` : "~66° / 47°"}</div>
                <div className="num text-[12px] text-ink-soft">
                  ☀ {fmtClock(sun.sunrise)} · ☾ {fmtClock(sun.sunset)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[12.5px] text-ink-soft">
        {live ? "Live forecast from Open-Meteo." : map ? "Showing the last saved forecast." : "Forecast needs a connection; showing typical November weather."} Sunrise and sunset are calculated for Las Vegas. Desert evenings get chilly — bring a layer!
      </p>
    </div>
  );
}

/* ---------------------------------- Data ---------------------------------- */

function DataTools() {
  const { exportJson, importJson, resetAll, pushToast, saved } = useStore();
  const [txt, setTxt] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vegas-birthday-30-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson());
      pushToast("Backup copied");
    } catch {
      pushToast("Couldn’t copy — use Download instead");
    }
  };
  return (
    <div className="space-y-3">
      <p className="text-[14px]">
        Everything saves automatically in this browser on this phone {saved ? "✓ saved" : "…saving"}. Use a backup if you want to move to another device.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn btn-gold" onClick={download}>
          <Icon name="download" size={17} /> Download
        </button>
        <button className="btn btn-ghost" onClick={copy}>
          Copy backup
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const ok = importJson(await f.text());
          pushToast(ok ? "Backup restored" : "That file isn’t a valid backup");
          e.target.value = "";
        }}
      />
      <button className="btn btn-ghost w-full" onClick={() => fileRef.current?.click()}>
        <Icon name="upload" size={17} /> Restore from file
      </button>
      <textarea className="field min-h-[72px]" placeholder="…or paste a copied backup here" value={txt} onChange={(e) => setTxt(e.target.value)} />
      {txt.trim() ? (
        <button
          className="btn btn-primary w-full"
          onClick={() => {
            const ok = importJson(txt);
            pushToast(ok ? "Backup restored" : "That doesn’t look like a valid backup");
            if (ok) setTxt("");
          }}
        >
          Restore pasted backup
        </button>
      ) : null}
      <div className="dash pt-3">
        {confirmReset ? (
          <div className="rounded-2xl bg-red-50 p-3">
            <p className="text-[14px] font-bold text-red-900">Erase every expense, note, checklist and stamp on this device?</p>
            <div className="mt-2 flex gap-2">
              <button className="btn btn-ghost flex-1" onClick={() => setConfirmReset(false)}>
                Keep everything
              </button>
              <button
                className="btn btn-danger flex-1"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                  pushToast("Fresh start");
                }}
              >
                Erase all
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-danger w-full" onClick={() => setConfirmReset(true)}>
            Reset everything…
          </button>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Credits -------------------------------- */

type Credit = { title: string; author: string; license: string; licenseUrl: string; source: string };

function Credits() {
  const c = credits as Record<string, Credit>;
  const usedBy: Record<string, string[]> = {};
  for (const s of STOPS) if (s.photo) (usedBy[s.photo] ??= []).push(s.title);
  usedBy["skyline"] = ["Welcome card"];
  const ids = Object.keys(c).sort();
  return (
    <div>
      <p className="mb-3 text-[13.5px] text-ink-soft">
        Photographs are from Wikimedia Commons under open licenses (CC BY, CC BY-SA, CC0 or public domain). Thank you to the photographers. Photos may show a venue’s exterior or surroundings rather than the exact room.
      </p>
      <ul className="space-y-2.5">
        {ids.map((id) => {
          const x = c[id];
          return (
            <li key={id} className="flex gap-3 rounded-xl bg-white/70 p-2 ring-1 ring-gold/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/vegas-birthday-30/photos/${id}.jpg`} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 text-[12.5px] leading-snug">
                <div className="font-extrabold text-ink">{(usedBy[id] ?? [id]).slice(0, 2).join(" · ")}</div>
                <div className="truncate text-ink-soft">“{x.title}” by {x.author}</div>
                <div>
                  <a className="font-bold text-wine underline" href={x.licenseUrl || x.source} target="_blank" rel="noopener noreferrer">
                    {x.license}
                  </a>{" "}
                  ·{" "}
                  <a className="font-bold text-wine underline" href={x.source} target="_blank" rel="noopener noreferrer">
                    source
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------------------- Screen --------------------------------- */

export default function Tools() {
  const { state, setNotes } = useStore();
  const pending = CONFIRMATIONS.filter((c) => !state.confirmed[c.id]?.done).length;
  const packed = state.packing.filter((p) => p.done).length;
  return (
    <div className="space-y-3">
      <div>
        <p className="lbl">Practical toolbox</p>
        <h1 className="font-display text-[28px] font-extrabold leading-tight text-burgundy">Everything else we need</h1>
      </div>

      <section className="airmail">
        <div className="inner night p-4">
          <Countdown />
        </div>
      </section>

      <Collapse title="Still to confirm" icon="alert" defaultOpen={pending > 0} badge={pending > 0 ? <span className="chip bg-gold text-white">{pending}</span> : <span className="chip bg-sage text-white">all set</span>}>
        <p className="mb-3 text-[13.5px] text-ink-soft">Holiday display dates, show times, reservations and a few schedules aren’t fully verified. Check each source, tick it off and jot what you learn.</p>
        <ConfirmList />
      </Collapse>

      <Collapse title="Optional lights & ideas (cost extra or farther)" icon="star">
        <p className="mb-3 text-[13.5px] text-ink-soft">
          Not in the plan. All of these need a rideshare (or a car), and details come from travel sites, not the venues, so confirm before you go. Anything you do add comes out of the “Fun” envelope and the cushion.
        </p>
        <ul className="space-y-2.5 text-[14.5px]">
          <li className="rounded-xl bg-white/70 p-3 ring-1 ring-gold/30">
            <b className="text-wine">Opportunity Village Magical Forest</b> · Summerlin
            <br />A walk-through light display. Reported open on select dates in Dec (about Dec 10–24), roughly 5:30–9 PM, with date-specific tickets. One listing shows about $26.50 per person (unconfirmed). About 10+ miles from the resort, so figure $25–40 each way.
          </li>
          <li className="rounded-xl bg-white/70 p-3 ring-1 ring-gold/30">
            <b className="text-wine">Glittering Lights</b> · Las Vegas Motor Speedway
            <br />A drive-through show with millions of lights, reported Nov 6–Jan 3. It is per vehicle (reported about $39–44) and you need a car, so it only works with a rental.
          </li>
          <li className="rounded-xl bg-white/70 p-3 ring-1 ring-gold/30">
            <b className="text-wine">Ethel M Holiday Cactus Garden Lights</b> · Henderson
            <br />A cactus garden strung with lights, reported nightly Nov 5–Jan 3. One listing says $3 per person from Nov 6. About 15 miles from the Strip.
          </li>
          <li className="rounded-xl bg-white/70 p-3 ring-1 ring-gold/30">
            <b className="text-wine">LINQ Promenade</b> · Strip
            <br />Free to stroll, with reported holiday performances and snowfall in the evening. The High Roller wheel costs money.
          </li>
        </ul>
      </Collapse>

      <Collapse title="Packing checklist" icon="check" badge={<span className="chip bg-parchment text-ink">{packed}/{state.packing.length}</span>}>
        <Packing />
      </Collapse>

      <Collapse title="Grocery inventory" icon="budget" badge={<span className="chip bg-parchment text-ink">{state.groceries.filter((g) => g.inRoom).length}/{state.groceries.length} in room</span>}>
        <Groceries />
      </Collapse>

      <Collapse title="Weather & sunset" icon="sun">
        <WeatherTable />
      </Collapse>

      <Collapse title="Our notes" icon="pencil">
        <textarea className="field min-h-[160px]" placeholder="Reservation numbers, flight details, the thing you want to remember…" value={state.notes} onChange={(e) => setNotes(e.target.value)} aria-label="Trip notes" />
      </Collapse>

      <Collapse title="Add to your iPhone home screen" icon="download">
        <ol className="list-decimal space-y-1.5 pl-5 text-[14.5px]">
          <li>Open this page in <b>Safari</b>.</li>
          <li>Tap the <b>Share</b> button (square with an arrow).</li>
          <li>Choose <b>Add to Home Screen</b>, then <b>Add</b>.</li>
        </ol>
        <p className="mt-2 text-[13.5px] text-ink-soft">It then opens like an app, and pages you’ve already opened keep working with weak signal. Maps, websites and weather need a connection.</p>
      </Collapse>

      <Collapse title="Backup & reset" icon="upload">
        <DataTools />
      </Collapse>

      <Collapse title="Photo credits" icon="star">
        <Credits />
      </Collapse>

      <p className="pb-2 pt-3 text-center font-script text-2xl text-wine">Made with love for Jasmine’s 30th</p>
    </div>
  );
}
