"use client";

import { useMemo, useState } from "react";
import { CAT, CATEGORIES, DAYS, STOP_BY_ID, STOPS } from "../lib/data";
import { fmt, r2 } from "../lib/money";
import { useStore } from "../lib/store";
import type { CategoryId, Method } from "../lib/types";
import { Collapse, Icon, MoneyField, PayToggle, Sparkle } from "./ui";
import { useUi } from "./uiCtx";

function Ring({ spent, projected, limit }: { spent: number; projected: number; limit: number }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const pct = Math.min(1, Math.max(0, spent / limit));
  const proj = Math.min(1, Math.max(0, projected / limit));
  const over = spent > limit;
  return (
    <svg viewBox="0 0 140 140" className="h-[132px] w-[132px] shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="13" />
      <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(232,201,124,0.4)" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${C * proj} ${C}`} />
      <circle
        cx="70"
        cy="70"
        r={R}
        fill="none"
        stroke={over ? "#ff8a8a" : "#ffe9b0"}
        strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray={`${C * pct} ${C}`}
        style={{ transition: "stroke-dasharray .5s ease", filter: "drop-shadow(0 0 5px rgba(232,201,124,.8))" }}
      />
    </svg>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-gold-lt/30">
      <div className="lbl !text-[#f0d9a6]">{label}</div>
      <div className={`font-display num text-[22px] font-extrabold leading-tight ${tone || "text-[#ffe9b0]"}`}>{value}</div>
    </div>
  );
}

function Summary() {
  const { totals: t } = useStore();
  const pct = Math.round((t.spent / t.limit) * 100);
  const msg =
    t.spent > t.limit
      ? `Over the ${fmt(t.limit)} limit — time to pause the splurging.`
      : t.projected > t.limit
        ? "Projected to pass the limit. Skip an extra or use less backup."
        : t.spent === 0
          ? "Nothing spent yet. Enter Actuals as we go!"
          : "On track. Keep it dreamy.";
  return (
    <section className="airmail" aria-label="Budget summary">
      <div className="inner night relative overflow-hidden p-4">
        <Sparkle className="twinkle" size={12} style={{ right: 16, top: 14 }} />
        <p className="lbl !text-[#f0d9a6]">Overall budget · ${t.limit} limit</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="relative">
            <Ring spent={t.spent} projected={t.projected} limit={t.limit} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display num text-[26px] font-extrabold leading-none text-[#ffe9b0]">{fmt(t.spent)}</span>
              <span className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#f0d9a6]">{pct}% spent</span>
            </div>
          </div>
          <div className="grid min-w-0 flex-1 gap-2">
            <Stat label="Left under limit" value={fmt(t.leftUnderLimit)} tone={t.leftUnderLimit < 0 ? "text-[#ff9a9a]" : ""} />
            <Stat label="Projected finish" value={fmt(t.projected)} tone={t.projected > t.limit ? "text-[#ff9a9a]" : ""} />
          </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Stat label="Unused if we stay on plan" value={fmt(t.projectedUnused)} tone={t.projectedUnused < 0 ? "text-[#ff9a9a]" : ""} />
          <Stat label="Cushion left" value={fmt(t.cushionLeft)} tone={t.cushionLeft < 0 ? "text-[#ff9a9a]" : ""} />
        </div>
        <p className="mt-3 text-center text-[13.5px] font-bold text-[#fbeed2]" role="status">
          {msg}
        </p>
        <p className="mt-1 text-center text-[11.5px] text-[#e8d3a4]">
          Faint ring = projected finish (actuals + estimates not yet spent). Hotel deposit is not included.
        </p>
      </div>
    </section>
  );
}

function CashCard() {
  const { state, totals: t, setSettings } = useStore();
  const s = state.settings;
  return (
    <section className="card p-4" aria-label="Cash and card">
      <h2 className="font-display text-xl font-extrabold text-burgundy">Cash vs. card</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-burgundy p-3 text-[#fdf1d6]">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-gold-lt">
            <Icon name="cash" size={16} /> Cash left
          </div>
          <div className={`font-display num text-[28px] font-extrabold leading-tight ${t.cashRemaining < 0 ? "text-[#ff9a9a]" : "text-[#ffe9b0]"}`}>{fmt(t.cashRemaining)}</div>
          <div className="text-[12px] opacity-80">of {fmt(t.startCash)} · spent {fmt(t.cashSpent)}</div>
        </div>
        <div className="rounded-2xl bg-parchment p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
            <Icon name="card" size={16} /> On card
          </div>
          <div className="font-display num text-[28px] font-extrabold leading-tight text-burgundy">{fmt(t.cardSpent)}</div>
          <div className="text-[12px] text-ink-soft">{t.cardPlanned > 0 ? `+ ${fmt(t.cardPlanned)} still planned` : `Counts toward the ${fmt(t.limit)}`}</div>
        </div>
      </div>

      <div className="mt-3 space-y-2 rounded-2xl border border-gold/40 bg-white/60 p-3">
        <p className="lbl">Starting cash</p>
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="text-[12.5px] font-bold text-ink-soft">Cash in hand</span>
            <MoneyField
              value={s.cashInHand}
              onChange={(v) => setSettings((x) => ({ ...x, cashInHand: v ?? 0 }))}
              label="Cash already in hand"
              className="mt-1"
            />
          </label>
          <label>
            <span className="text-[12.5px] font-bold text-ink-soft">ATM withdrawal</span>
            <MoneyField
              value={s.atmPlanned}
              onChange={(v) => setSettings((x) => ({ ...x, atmPlanned: v ?? 0 }))}
              label="Planned ATM withdrawal"
              className="mt-1"
            />
          </label>
        </div>
        <label className="flex min-h-[44px] items-center gap-3">
          <input
            type="checkbox"
            className="h-6 w-6 accent-[#5e1626]"
            checked={s.atmDone}
            onChange={(e) => setSettings((x) => ({ ...x, atmDone: e.target.checked }))}
          />
          <span className="text-[14.5px] font-bold">ATM withdrawal done {s.atmDone ? "✓" : "(pending — log any ATM fee with +)"}</span>
        </label>
        <div className="flex justify-between border-t border-dashed border-gold/50 pt-2 text-[14px]">
          <span className="font-bold">Total starting cash</span>
          <span className="font-display num font-extrabold">{fmt(t.startCash)}</span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="font-bold text-ink-soft">Cash still planned for the rest of the trip</span>
          <span className="num font-extrabold">{fmt(t.cashStillPlanned)}</span>
        </div>
        <div className="flex justify-between text-[14px]">
          <span className="font-bold text-ink-soft">Cash left after the plan</span>
          <span className={`num font-extrabold ${t.cashAfterPlan < 0 ? "text-wine" : "text-sage"}`}>{fmt(t.cashAfterPlan)}</span>
        </div>
        {t.cashAfterPlan < 0 ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] font-bold text-red-800" role="alert">
            Planned cash spending is {fmt(-t.cashAfterPlan)} more than cash on hand. Switch something to card or trim an extra.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function Categories() {
  const { state, totals: t, setSettings } = useStore();
  const { openAdd } = useUi();
  const [edit, setEdit] = useState(false);
  const alloc = state.settings.alloc;
  const sum = r2(Object.values(alloc).reduce((a, b) => a + b, 0));
  return (
    <section className="card p-4" aria-label="Spending by category">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-xl font-extrabold text-burgundy">By category</h2>
        <button className="btn btn-ghost !min-h-[40px]" aria-pressed={edit} onClick={() => setEdit((e) => !e)}>
          <Icon name="pencil" size={16} /> {edit ? "Done" : "Edit amounts"}
        </button>
      </div>
      <ul className="mt-3 space-y-3">
        {CATEGORIES.map((c) => {
          const row = t.byCat[c.id];
          const isCushion = c.id === "cushion";
          const base = isCushion ? row.alloc : row.alloc;
          const pct = base > 0 ? Math.min(100, (row.spent / base) * 100) : 0;
          const estPct = base > 0 ? Math.min(100, (row.projected / base) * 100) : 0;
          const left = isCushion ? t.cushionLeft : row.left;
          return (
            <li key={c.id} className={`rounded-2xl p-3 ${isCushion ? "border-2 border-dashed border-gold bg-gold-lt/25" : "bg-white/60 ring-1 ring-gold/30"}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-extrabold">{c.label}</div>
                    {isCushion ? <div className="text-[12px] font-bold text-gold">Protected — overages in other categories draw from here</div> : null}
                  </div>
                </div>
                {edit ? (
                  <MoneyField
                    value={row.alloc}
                    onChange={(v) => setSettings((x) => ({ ...x, alloc: { ...x.alloc, [c.id]: v ?? 0 } }))}
                    label={`${c.label} budget`}
                    className="w-28 shrink-0"
                  />
                ) : (
                  <span className="font-display num shrink-0 text-lg font-extrabold">{fmt(row.alloc)}</span>
                )}
              </div>
              <div className="relative mt-2 h-3.5 overflow-hidden rounded-full bg-ink-soft/15" role="img" aria-label={`${c.label}: ${fmt(row.spent)} spent of ${fmt(row.alloc)}`}>
                <div className="absolute inset-y-0 left-0 rounded-full opacity-35" style={{ width: `${estPct}%`, background: c.color }} />
                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: row.over > 0 ? "#b32a2a" : c.color }} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 text-[13px] font-bold">
                <span>
                  Spent <span className="num">{fmt(row.spent)}</span>
                </span>
                {!isCushion ? (
                  <span className="text-ink-soft">
                    Planned <span className="num">{fmt(row.est)}</span>
                  </span>
                ) : null}
                <span className={left < 0 ? "text-wine" : "text-sage"}>
                  {left < 0 ? `Over ${fmt(-left)}` : `${fmt(left)} ${isCushion ? "protected" : "unused"}`}
                </span>
              </div>
              {row.over > 0 ? (
                <p className="mt-1 text-[12.5px] font-bold text-wine">{fmt(row.over)} over — covered by the cushion.</p>
              ) : null}
              {c.id === "backup" || isCushion ? (
                <button className="btn btn-ghost mt-2 !min-h-[40px] w-full text-[13.5px]" onClick={() => openAdd({ category: c.id })}>
                  <Icon name="plus" size={16} /> Log a {c.id === "backup" ? "backup ride" : "cushion expense"}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      {edit ? (
        <p className={`mt-3 rounded-xl px-3 py-2 text-[13px] font-bold ${sum === state.settings.limit ? "bg-sage/15 text-sage" : "bg-gold-lt/40 text-ink"}`}>
          Envelopes total {fmt(sum)} of the {fmt(state.settings.limit)} limit
          {sum === state.settings.limit ? " ✓" : ` (${fmt(state.settings.limit - sum)} ${sum < state.settings.limit ? "unassigned" : "over"})`}
        </p>
      ) : null}
      {edit ? (
        <label className="mt-3 block">
          <span className="lbl">Total trip limit</span>
          <MoneyField
            value={state.settings.limit}
            onChange={(v) => setSettings((x) => ({ ...x, limit: v ?? 0 }))}
            label="Total trip budget limit"
            className="mt-1"
          />
        </label>
      ) : null}
    </section>
  );
}

function Deposit() {
  const { state, setSettings } = useStore();
  const d = state.settings.deposit;
  const patch = (p: Partial<typeof d>) => setSettings((s) => ({ ...s, deposit: { ...s.deposit, ...p } }));
  return (
    <section className="card relative overflow-hidden p-4" aria-label="Hotel deposit">
      <div className="absolute -right-8 top-3 rotate-12 rounded border-2 border-dashed border-wine/50 px-6 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-wine/70">
        not in the budget
      </div>
      <h2 className="font-display text-xl font-extrabold text-burgundy">Hotel security deposit</h2>
      <p className="text-[13.5px] text-ink-soft">Refundable hold at The Signature — tracked separately from spending.</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label>
          <span className="lbl">Hold amount</span>
          <MoneyField value={d.amount} onChange={(v) => patch({ amount: v ?? 0 })} label="Hotel deposit amount" className="mt-1" />
        </label>
        <div>
          <span className="lbl">Placed on</span>
          <div className="mt-1">
            <PayToggle value={d.method} onChange={(m: Method) => patch({ method: m })} label="Deposit placed on" />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <span className="lbl">Status</span>
        <div className="seg mt-1 flex w-full" role="group" aria-label="Deposit status">
          {(
            [
              ["pending", "Not yet"],
              ["held", "Held"],
              ["refunded", "Refunded"],
            ] as const
          ).map(([v, l]) => (
            <button key={v} className="flex-1" aria-pressed={d.status === v} onClick={() => patch({ status: v })}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <input className="field mt-3" value={d.note} onChange={(e) => patch({ note: e.target.value })} aria-label="Deposit notes" />
      <p className="mt-2 text-[13px] font-bold text-ink-soft">
        {d.status === "refunded" ? "Money back in pocket 🎉" : d.status === "held" ? `${fmt(d.amount)} is on hold on the ${d.method}. Check it releases after checkout.` : "Goes on at check-in Monday."}
      </p>
    </section>
  );
}

interface LedgerRow {
  key: string;
  kind: "stop" | "extra";
  id: string;
  stopId: string | null;
  label: string;
  sub: string;
  amount: number;
  method: Method;
  category: CategoryId;
  day: number;
  order: number;
}

function Ledger() {
  const { state, patchStop, deleteExtra, pushToast } = useStore();
  const { openEdit, goToStop } = useUi();
  const [editing, setEditing] = useState<string | null>(null);

  const rows = useMemo(() => {
    const out: LedgerRow[] = [];
    for (const s of STOPS) {
      const st = state.stops[s.id];
      if (st.actual != null) {
        out.push({
          key: `s-${s.id}`,
          kind: "stop",
          id: s.id,
          stopId: s.id,
          label: s.title,
          sub: `${s.time}${st.notes ? ` · ${st.notes}` : ""}`,
          amount: st.actual,
          method: st.method,
          category: s.category ?? "cushion",
          day: s.day,
          order: s.start,
        });
      }
    }
    for (const e of state.extras) {
      const stop = e.stopId ? STOP_BY_ID[e.stopId] : null;
      out.push({
        key: `e-${e.id}`,
        kind: "extra",
        id: e.id,
        stopId: e.stopId,
        label: e.label,
        sub: stop ? `Add-on at ${stop.title}` : "Extra",
        amount: e.amount,
        method: e.method,
        category: e.category,
        day: stop ? stop.day : -1,
        order: stop ? stop.start + 0.5 : 99999 + new Date(e.ts).getTime() / 1e13,
      });
    }
    return out.sort((a, b) => a.day - b.day || a.order - b.order);
  }, [state.stops, state.extras]);

  const groups = useMemo(() => {
    const m = new Map<number, LedgerRow[]>();
    for (const r of rows) m.set(r.day, [...(m.get(r.day) ?? []), r]);
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [rows]);

  const clearStop = (id: string) => {
    const prev = state.stops[id].actual;
    patchStop(id, { actual: null });
    pushToast("Cleared actual", () => patchStop(id, { actual: prev }));
    setEditing(null);
  };

  return (
    <section className="card p-4" aria-label="Expense ledger">
      <h2 className="font-display text-xl font-extrabold text-burgundy">Every expense</h2>
      <p className="text-[13.5px] text-ink-soft">Tap a row to correct it. Stop actuals and add-ons are listed once each, so nothing is double-counted.</p>
      {rows.length === 0 ? (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-gold/60 p-6 text-center">
          <p className="font-script text-3xl text-wine">No spending yet</p>
          <p className="text-[14px] text-ink-soft">Enter an Actual Spent on any stop, or tap the + button to add an expense.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          {groups.map(([day, list]) => (
            <div key={day}>
              <h3 className="lbl mb-1.5">{day >= 0 ? `${DAYS[day].short} · ${DAYS[day].title}` : "Other / not tied to a stop"}</h3>
              <ul className="space-y-2">
                {list.map((r) => {
                  const isEditing = editing === r.key;
                  return (
                    <li key={r.key} className="rounded-2xl bg-white/70 ring-1 ring-gold/30">
                      <button
                        className="flex min-h-[56px] w-full items-center gap-3 px-3 py-2 text-left"
                        style={{ background: "transparent", border: 0 }}
                        onClick={() => (r.kind === "extra" ? openEdit(r.id) : setEditing(isEditing ? null : r.key))}
                        aria-expanded={r.kind === "stop" ? isEditing : undefined}
                      >
                        <span className="text-xl" aria-hidden>
                          {CAT[r.category].emoji}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-extrabold">{r.label}</span>
                          <span className="block truncate text-[12.5px] text-ink-soft">
                            {r.sub} · {r.method === "cash" ? "Cash" : "Card"}
                          </span>
                        </span>
                        <span className="font-display num text-lg font-extrabold">{fmt(r.amount)}</span>
                      </button>
                      {r.kind === "stop" && isEditing ? (
                        <div className="fade space-y-3 border-t border-dashed border-gold/50 px-3 pb-3 pt-3">
                          <div className="grid grid-cols-2 gap-3">
                            <MoneyField value={state.stops[r.id].actual} onChange={(v) => patchStop(r.id, { actual: v })} label={`Actual for ${r.label}`} />
                            <PayToggle value={state.stops[r.id].method} onChange={(m) => patchStop(r.id, { method: m })} label="Paid with" />
                          </div>
                          <div className="flex gap-2">
                            <button className="btn btn-ghost flex-1" onClick={() => goToStop(r.id)}>
                              Open stop
                            </button>
                            <button className="btn btn-danger" onClick={() => clearStop(r.id)}>
                              <Icon name="trash" size={16} /> Clear
                            </button>
                          </div>
                        </div>
                      ) : null}
                      {r.kind === "extra" ? (
                        <div className="flex justify-end gap-2 px-3 pb-2">
                          <button className="btn btn-ghost !min-h-[38px] !px-3 text-[13px]" onClick={() => openEdit(r.id)}>
                            <Icon name="pencil" size={15} /> Edit
                          </button>
                          <button className="btn btn-danger !min-h-[38px] !px-3 text-[13px]" onClick={() => deleteExtra(r.id)}>
                            <Icon name="trash" size={15} /> Delete
                          </button>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Budget() {
  const { openAdd } = useUi();
  return (
    <div className="space-y-4">
      <Summary />
      <button className="btn btn-primary w-full !min-h-[52px] text-[16px]" onClick={() => openAdd()}>
        <Icon name="plus" size={20} /> Quick-add an expense
      </button>
      <CashCard />
      <Categories />
      <Deposit />
      <Ledger />
      <Collapse title="How the math works" icon="star">
        <ul className="list-disc space-y-1.5 pl-5 text-[14px]">
          <li>
            <b>Spent</b> = every Actual Spent entered on a stop + every add-on expense. Cash and card both count toward the trip budget.
          </li>
          <li>
            <b>Projected finish</b> uses the actual when entered, otherwise the stop’s estimate.
          </li>
          <li>
            <b>Cushion left</b> = the cushion envelope minus anything logged to the cushion minus any category that went over its envelope.
          </li>
          <li>The $300 hotel hold is tracked separately and never reduces the budget.</li>
          <li>Two $100 anniversary gifts (Venmo and cash) raised the trip ceiling from $800 to $1,000.</li>
        </ul>
      </Collapse>
    </div>
  );
}
