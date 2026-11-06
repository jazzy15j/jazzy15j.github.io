"use client";

import { useState } from "react";
import { EATERIES, STOP_BY_ID, type Eatery } from "../lib/data";
import { mapsDirUrl, mapsPlaceUrl } from "../lib/geo";
import { fmt, r2 } from "../lib/money";
import { useStore, uid } from "../lib/store";
import { Collapse, Icon, MoneyField, PayToggle, Photo } from "./ui";

function Hearts({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <span className="inline-flex" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          aria-label={`${n} heart${n > 1 ? "s" : ""}`}
          aria-pressed={value >= n}
          onClick={() => onChange(value === n ? 0 : n)}
          className="flex h-9 w-7 items-center justify-center"
          style={{ background: "transparent", border: 0, color: value >= n ? "#86243a" : "#cdb99a" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={value >= n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 20S4 14.500 4 9a4.200 4.200 0 0 1 8-1.800A4.200 4.200 0 0 1 20 9c0 5.500-8 11-8 11z" />
          </svg>
        </button>
      ))}
    </span>
  );
}

function EateryCard({ e }: { e: Eatery }) {
  const { state, patchFood, patchStop, setConfirmed, pushToast } = useStore();
  const stop = STOP_BY_ID[e.stopId];
  const st = state.stops[e.stopId];
  const log = state.food[e.id] ?? { confirmedHours: "", notes: "", orders: [] };
  const conf = state.confirmed[e.confirmId];
  const [item, setItem] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const total = r2(log.orders.reduce((a, o) => a + (o.price ?? 0), 0));

  const addOrder = () => {
    if (!item.trim()) return;
    patchFood(e.id, (f) => ({ ...f, orders: [...f.orders, { id: uid("o"), item: item.trim(), price, rating: 0 }] }));
    setItem("");
    setPrice(null);
  };

  return (
    <article className="card overflow-hidden" id={`eat-${e.id}`}>
      <div className="relative">
        <Photo id={stop.photo} kind={stop.kind} alt={e.name} className="h-36 w-full" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-night/80 to-transparent" aria-hidden />
        <div className="absolute inset-x-3 bottom-2 flex items-end justify-between gap-2 text-[#fdf1d6]">
          <div>
            <h3 className="font-display text-2xl font-extrabold leading-tight">{e.name}</h3>
            <p className="text-[12.5px] font-bold opacity-90">{e.cuisine}</p>
          </div>
          <span className="chip bg-gold-lt text-espresso">{fmt(e.budget)} plan</span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="flex items-center gap-2 text-[14px] font-bold text-wine">
          <Icon name="clock" size={17} /> Our slot: {e.slot}
        </p>
        <p className="text-[14.5px]">{e.blurb}</p>

        {/* Verified info + what to order */}
        <div className="rounded-xl border border-sage/50 bg-sage/10 px-3 py-2 text-[14px]">
          <p className="lbl !text-sage">Verified on the venue’s site · Nov 6</p>
          <p className="mt-1 font-semibold">{e.verified}</p>
          {e.caveat ? <p className="mt-1 font-bold text-wine">⚠ {e.caveat}</p> : null}
        </div>
        <div className="rounded-xl bg-blush/50 px-3 py-2 text-[14px]">
          <p className="lbl">Best things to order</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 font-semibold">
            {e.picks.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="mt-1 font-extrabold text-burgundy">{e.pickTotal}</p>
          {e.tip ? <p className="mt-1 text-ink-soft">{e.tip}</p> : null}
        </div>

        {/* Happy-hour confirmation */}
        <div className={`rounded-xl border px-3 py-2 ${conf?.done ? "border-sage/50 bg-sage/10" : "border-gold/60 bg-gold-lt/25"}`}>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-6 w-6 shrink-0 accent-[#5e1626]"
              checked={!!conf?.done}
              onChange={(ev) => setConfirmed(e.confirmId, { done: ev.target.checked })}
              aria-label={`${e.name} happy-hour times confirmed`}
            />
            <span className="text-[14px] font-bold leading-snug">
              {conf?.done ? "Happy-hour days, times & prices confirmed" : "Not confirmed yet — re-check the official page or call before we go"}
            </span>
          </label>
          <input
            className="field mt-2 !min-h-[40px]"
            placeholder="Published hours / what we found (e.g. Mon–Fri 5–7 PM)"
            value={log.confirmedHours}
            onChange={(ev) => patchFood(e.id, (f) => ({ ...f, confirmedHours: ev.target.value }))}
            aria-label={`Published happy hour for ${e.name}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <a className="btn btn-gold" href={e.socialUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="link" size={17} /> Happy hour
          </a>
          <a className="btn btn-gold" href={e.menuUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="eat" size={17} /> {e.menuLabel}
          </a>
          <a className="btn btn-primary" href={mapsPlaceUrl(stop)} target="_blank" rel="noopener noreferrer">
            <Icon name="map" size={17} /> Map pin
          </a>
          <a
            className="btn btn-ghost"
            href={mapsDirUrl({ place: "The Signature at MGM Grand", address: "145 E Harmon Ave, Las Vegas, NV 89109" }, stop, stop.leg?.mode === "transit" ? "transit" : "walking")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="nav" size={17} /> Directions
          </a>
        </div>

        {/* Money */}
        <div className="rounded-2xl border border-gold/40 bg-white/60 p-3">
          <div className="grid grid-cols-[auto_1fr] items-end gap-3">
            <div>
              <span className="lbl">Estimated</span>
              <div className="font-display num min-h-[44px] pt-2 text-[22px] font-extrabold text-ink-soft">{fmt(stop.est)}</div>
            </div>
            <div>
              <span className="lbl">Actual spent</span>
              <MoneyField value={st.actual} onChange={(v) => patchStop(stop.id, { actual: v })} label={`Actual spent at ${e.name}`} placeholder="Enter when paid" />
            </div>
          </div>
          <div className="mt-2">
            <span className="lbl">Paid with</span>
            <div className="mt-1">
              <PayToggle value={st.method} onChange={(m) => patchStop(stop.id, { method: m })} label={`Paid with at ${e.name}`} />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h4 className="lbl mb-1">What we ordered</h4>
          {log.orders.length === 0 ? <p className="text-[13.5px] text-ink-soft">Nothing logged yet. Add dishes and drinks below.</p> : null}
          <ul className="space-y-2">
            {log.orders.map((o) => (
              <li key={o.id} className="rounded-xl bg-paper px-3 py-1.5 ring-1 ring-gold/30">
                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-[14.5px] font-bold">{o.item}</span>
                  <span className="num font-extrabold">{o.price != null ? fmt(o.price) : "—"}</span>
                  <button
                    className="btn btn-danger !min-h-[36px] !px-2"
                    aria-label={`Delete ${o.item}`}
                    onClick={() => {
                      const gone = o;
                      patchFood(e.id, (f) => ({ ...f, orders: f.orders.filter((x) => x.id !== o.id) }));
                      pushToast(`Removed ${gone.item}`, () => patchFood(e.id, (f) => ({ ...f, orders: [...f.orders, gone] })));
                    }}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
                <Hearts value={o.rating} onChange={(n) => patchFood(e.id, (f) => ({ ...f, orders: f.orders.map((x) => (x.id === o.id ? { ...x, rating: n } : x)) }))} />
              </li>
            ))}
          </ul>
          <form
            className="mt-2 grid grid-cols-[1fr_96px_auto] gap-2"
            onSubmit={(ev) => {
              ev.preventDefault();
              addOrder();
            }}
          >
            <input className="field" placeholder="Dish or drink" value={item} onChange={(ev) => setItem(ev.target.value)} aria-label="Dish or drink name" />
            <MoneyField value={price} onChange={setPrice} label="Price" placeholder="0.00" />
            <button type="submit" className="btn btn-primary !px-3" aria-label="Add to order log">
              <Icon name="plus" size={18} />
            </button>
          </form>
          {log.orders.length > 0 ? (
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-parchment/70 px-3 py-2 text-[14px]">
              <span className="font-bold">
                Logged total: <span className="num">{fmt(total)}</span>
              </span>
              <button
                className="btn btn-ghost !min-h-[38px] !px-3 text-[13px]"
                disabled={total <= 0}
                onClick={() => {
                  const prev = st.actual;
                  patchStop(stop.id, { actual: total });
                  pushToast(`Actual set to ${fmt(total)}`, () => patchStop(stop.id, { actual: prev }));
                }}
              >
                Use as Actual
              </button>
            </div>
          ) : null}
        </div>

        <label className="block">
          <span className="lbl">Notes &amp; memories</span>
          <textarea
            className="field mt-1 min-h-[72px]"
            placeholder="Favorite bite, cocktail to order again…"
            value={log.notes}
            onChange={(ev) => patchFood(e.id, (f) => ({ ...f, notes: ev.target.value }))}
          />
        </label>
      </div>
    </article>
  );
}

export default function Food() {
  const { totals, state } = useStore();
  const cat = totals.byCat.restaurants;
  const unconfirmed = EATERIES.filter((e) => !state.confirmed[e.confirmId]?.done).length;
  return (
    <div className="space-y-4">
      <div>
        <p className="lbl">Food &amp; happy-hour guide</p>
        <h1 className="font-display text-[28px] font-extrabold leading-tight text-burgundy">Five tables, one sweet week</h1>
      </div>

      <section className="airmail">
        <div className="inner night grid grid-cols-3 gap-2 p-3 text-center">
          {[
            ["Dining plan", fmt(cat.alloc)],
            ["Spent", fmt(cat.spent)],
            [cat.left < 0 ? "Over" : "Unused", fmt(Math.abs(cat.left))],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-white/10 py-2 ring-1 ring-gold-lt/30">
              <div className="lbl !text-[#f0d9a6]">{l}</div>
              <div className="font-display num text-xl font-extrabold text-[#ffe9b0]">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {unconfirmed > 0 ? (
        <div className="flex gap-3 rounded-2xl border border-gold/60 bg-gold-lt/30 px-4 py-3">
          <Icon name="alert" className="mt-0.5 shrink-0 text-gold" />
          <p className="text-[14px] font-semibold">
            <b>Happy-hour days and times were read from each venue’s own site on Nov 6, 2026.</b> Schedules can change, so re-check the day before. Park on Fremont still needs a quick call. Dollar figures in “Best things to order” are estimates with Las Vegas sales tax (about 8.4%) and a 20% tip — check each bill, since some venues add a service charge.
          </p>
        </div>
      ) : null}

      {EATERIES.map((e) => (
        <EateryCard key={e.id} e={e} />
      ))}

      <Collapse title="Cheers checklist" icon="star">
        <ul className="list-disc space-y-1.5 pl-5 text-[14.5px]">
          <li>Bring photo ID — social hours and cocktails are 21+.</li>
          <li>Ask whether the Social Hour menu applies to the seats you’re offered (bar vs. dining room).</li>
          <li>Check whether the checks include service charges before adding a tip.</li>
          <li>Anniversary dinner? Mention it when you arrive or reserve — Wednesday at TAO is the big one.</li>
        </ul>
      </Collapse>
    </div>
  );
}
