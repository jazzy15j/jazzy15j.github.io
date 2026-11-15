"use client";

import { useChecks, useStored } from "../lib/store";
import Semester from "./Semester";
import {
  decisions, dailyPrompts, first90, idealDay, philosophy, pillars, principles,
  seasons, successMeasures, townTripRules, values, vision, week,
} from "../lib/data";

function Section({ id, title, kicker, children }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="lc-section">
      {kicker && <p className="lc-kicker">{kicker}</p>}
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Checklist() {
  const [done, toggle] = useChecks("tasks");
  const all = first90.flatMap((p) => p.tasks);
  const count = all.filter((t) => done.has(t.id)).length;
  return (
    <>
      <p className="lc-note">{count} of {all.length} done. Saved in this browser only.</p>
      <div className="lc-grid3">
        {first90.map((p) => (
          <div key={p.id} className="lc-card">
            <p className="lc-kicker">{p.month}</p>
            <h3>{p.title}</h3>
            <ul className="lc-checks">
              {p.tasks.map((t) => (
                <li key={t.id}>
                  <label>
                    <input type="checkbox" checked={done.has(t.id)} onChange={() => toggle(t.id)} />
                    <span>{t.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function Money() {
  const [target, setTarget] = useStored("money:target", "2500");
  const [rate, setRate] = useStored("money:rate", "159");
  const [mode, setMode] = useStored("money:mode", "gross");
  const [setAside, setSetAside] = useStored("money:setaside", "25");
  const [unpaid, setUnpaid] = useStored("money:unpaid", "0");

  const t = Math.max(0, Number(target) || 0);
  const r = Math.max(0, Number(rate) || 0);
  const s = Math.min(90, Math.max(0, Number(setAside) || 0));
  const u = Math.min(300, Math.max(0, Number(unpaid) || 0));
  // If the target is take-home, gross it up by the set-aside percentage.
  const gross = mode === "net" ? t / (1 - s / 100) : t;
  const billable = r > 0 ? gross / r : 0;
  const total = billable * (1 + u / 100);
  const daily = total / 21;

  return (
    <div className="lc-card lc-money">
      <div className="lc-fields">
        <label>Monthly target ($)
          <input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <label>Value per billable hour ($)
          <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
        </label>
        <label>The target is
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="gross">Gross revenue</option>
            <option value="net">Take-home after taxes &amp; expenses</option>
          </select>
        </label>
        {mode === "net" && (
          <label>Set aside for tax &amp; expenses (%)
            <input inputMode="decimal" value={setAside} onChange={(e) => setSetAside(e.target.value)} />
          </label>
        )}
        <label>Unpaid time per billable hour (%)
          <input inputMode="decimal" value={unpaid} onChange={(e) => setUnpaid(e.target.value)} />
        </label>
      </div>
      <dl className="lc-results">
        <div><dt>Gross needed</dt><dd>${Math.round(gross).toLocaleString()}</dd></div>
        <div><dt>Billable hours / month</dt><dd>{billable.toFixed(1)}</dd></div>
        <div><dt>Total work hours / month</dt><dd>{total.toFixed(1)}</dd></div>
        <div><dt>Per weekday (21)</dt><dd>{daily.toFixed(1)} h <small>{daily <= 2 ? "fits the 2-hour limit" : "over the 2-hour limit"}</small></dd></div>
      </dl>
      <p className="lc-note">
        The $159/hour figure is aspirational, not a validated market rate, and the tax/expense % is a
        placeholder to replace with your own number. At $159 and zero unpaid time, $2,500 gross is about 15.7 hours.
      </p>
    </div>
  );
}

function Decisions() {
  return (
    <div className="lc-grid2">
      {decisions.map((d) => <DecisionCard key={d.id} id={d.id} question={d.question} options={d.options} />)}
    </div>
  );
}

function DecisionCard({ id, question, options }: { id: string; question: string; options?: string[] }) {
  const [choice, setChoice] = useStored(`decision:${id}`, "");
  const [note, setNote] = useStored(`decision-note:${id}`, "");
  return (
    <div className="lc-card">
      <h3>{question}</h3>
      {options && (
        <div className="lc-chips">
          {options.map((o) => (
            <button key={o} type="button" className={choice === o ? "on" : ""} aria-pressed={choice === o}
              onClick={() => setChoice(choice === o ? "" : o)}>{o}</button>
          ))}
        </div>
      )}
      <textarea rows={2} placeholder="Notes…" value={note} onChange={(e) => setNote(e.target.value)} aria-label={`Notes: ${question}`} />
    </div>
  );
}

function Journal() {
  const [entry, setEntry] = useStored("journal:entry", "");
  const [prompt, setPrompt] = useStored("journal:prompt", "0");
  const i = Number(prompt) % dailyPrompts.length;
  return (
    <div className="lc-card">
      <p className="lc-prompt">{dailyPrompts[i]}</p>
      <button type="button" className="lc-link" onClick={() => setPrompt(String((i + 1) % dailyPrompts.length))}>Another prompt</button>
      <textarea rows={6} value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="Write here. It stays in this browser."
        aria-label="Curriculum journal" />
      <p className="lc-note">A scratchpad, not an archive: copy anything you want to keep into a real notebook.</p>
    </div>
  );
}

export default function Curriculum() {
  return (
    <main className="lc30">
      <header className="lc-hero">
        <p className="lc-kicker">Age 30 · December 2026 – December 2027</p>
        <h1>My Personal Life Curriculum</h1>
        <p className="lc-lead">{philosophy}</p>
        <nav aria-label="Sections">
          {[["vision", "Vision"], ["pillars", "Pillars"], ["week", "Week"], ["semester", "Semester"], ["first90", "First 90 days"], ["year", "The year"], ["money", "Money"], ["decide", "To decide"], ["journal", "Journal"]].map(([id, label]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
      </header>

      <Section id="vision" kicker="Why" title="The life I'm designing">
        <div className="lc-grid2">
          <div className="lc-card">
            <h3>Vision</h3>
            <ul>{vision.map((v) => <li key={v}>{v}</li>)}</ul>
            <h3>Values</h3>
            <p className="lc-chips static">{values.map((v) => <span key={v}>{v}</span>)}</p>
          </div>
          <div className="lc-card">
            <h3>An ideal day</h3>
            <ol>{idealDay.map((v) => <li key={v}>{v}</li>)}</ol>
          </div>
        </div>
      </Section>

      <Section id="pillars" kicker="Ten areas" title="Curriculum pillars">
        <div className="lc-grid3">
          {pillars.map((p) => (
            <article key={p.n} className="lc-card">
              <p className="lc-kicker">Pillar {p.n}</p>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              <p className="lc-chips static">{p.focus.map((f) => <span key={f}>{f}</span>)}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="week" kicker="Proposed, not confirmed" title="A flexible weekly rhythm">
        <div className="lc-grid3">
          {week.map((d) => (
            <article key={d.day} className="lc-card">
              <h3>{d.day}</h3>
              <p className="lc-theme">{d.theme}</p>
              <ul>{d.ideas.map((i) => <li key={i}>{i}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="lc-card lc-wide">
          <h3>Town-day rules (save gas, enjoy it)</h3>
          <ul>{townTripRules.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </Section>

      <Section id="semester" kicker="Dec 7 – Mar 14 · Kearney, NE" title="Winter Semester">
        <Semester />
      </Section>

      <Section id="first90" kicker="Dec – Feb" title="The first 90 days">
        <Checklist />
      </Section>

      <Section id="year" kicker="Draft — edit freely" title="The year by season">
        <p className="lc-note">One suggested shape. Planting dates depend on your local frost dates; adjust before relying on them.</p>
        <div className="lc-grid3">
          {seasons.map((s) => (
            <article key={s.months} className="lc-card">
              <p className="lc-kicker">{s.months}</p>
              <h3>{s.season}: {s.lean}</h3>
              <ul>{s.draft.map((d) => <li key={d}>{d}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="lc-card lc-wide">
          <h3>How I&rsquo;ll know it&rsquo;s working</h3>
          <p className="lc-chips static">{successMeasures.map((m) => <span key={m}>{m}</span>)}</p>
          <ul>{principles.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      </Section>

      <Section id="money" kicker="The Freedom-Funded Life" title="What does $2,500 actually take?">
        <Money />
      </Section>

      <Section id="decide" kicker="Open questions" title="Still to decide">
        <Decisions />
      </Section>

      <Section id="journal" title="Curriculum journal">
        <Journal />
      </Section>

      <footer className="lc-foot">Private page · nothing here is sent anywhere.</footer>
    </main>
  );
}
