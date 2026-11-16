"use client";

import { useJson } from "../lib/store";
import { books } from "../lib/books";
import { catalog, libbySearch } from "../lib/links";
import { ExtLink } from "./ui";

type Shelf = { status?: string; note?: string };
const EMPTY: Record<string, Shelf> = {};
const STATUS = ["Want to read", "Reading", "Finished", "Set aside"];

export default function Books() {
  const [shelf, setShelf] = useJson<Record<string, Shelf>>("shelf", EMPTY);
  const upd = (id: string, patch: Shelf) => setShelf({ ...shelf, [id]: { ...shelf[id], ...patch } });
  return (
    <div>
      <h1>Reading shelf</h1>
      <p className="lc-why">Real books for this semester. Search each one in Libby or the library catalog. Availability and wait times change, so place holds early.</p>
      <div className="lc-grid2">
        {books.map((b) => (
          <article key={b.id} className="lc-card">
            <p className="lc-kicker">{b.kind} · {b.when}</p>
            <h2>{b.title}</h2>
            {b.author && <p>{b.author}</p>}
            <p className="lc-note">{b.why}</p>
            <div className="lc-pills">
              <ExtLink link={libbySearch(b.title.replace(/ \(.*\)/, ""), "Libby")} />
              <ExtLink link={catalog(b.title.replace(/ \(.*\)/, ""), "Library catalog")} />
            </div>
            <div className="lc-chips">
              {STATUS.map((s) => (
                <button key={s} type="button" className={shelf[b.id]?.status === s ? "on" : ""} aria-pressed={shelf[b.id]?.status === s}
                  onClick={() => upd(b.id, { status: shelf[b.id]?.status === s ? "" : s })}>{s}</button>
              ))}
            </div>
            <label className="lc-field">Notes
              <textarea rows={2} value={shelf[b.id]?.note ?? ""} onChange={(e) => upd(b.id, { note: e.target.value })} />
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}
