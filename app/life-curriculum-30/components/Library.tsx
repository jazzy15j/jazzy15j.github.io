"use client";

import { useChecks, useStored } from "../lib/store";
import { resourceGroups, supplies } from "../lib/resources";
import { ExtLink } from "./ui";

export default function Library() {
  const [shop, toggle] = useChecks("shopping");
  const [stretch] = useStored("link:stretch", "");
  return (
    <div>
      <h1>Resource library</h1>
      <p className="lc-why">Everything you need, in one place. Each lesson links here too.</p>
      <nav className="lc-pills" aria-label="Jump to a section">
        {resourceGroups.map((g) => <a key={g.id} className="lc-pill" href={`#/library/${g.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(g.id)?.scrollIntoView({ behavior: "smooth" }); }}>{g.title}</a>)}
        <a className="lc-pill" href="#/library/shopping" onClick={(e) => { e.preventDefault(); document.getElementById("shopping")?.scrollIntoView({ behavior: "smooth" }); }}>Shopping list</a>
      </nav>
      {resourceGroups.map((g) => (
        <section key={g.id} id={g.id} className="lc-card lc-res">
          <h2>{g.title}</h2>
          <p className="lc-note">{g.blurb}</p>
          {g.facts && <ul className="lc-facts">{g.facts.map((f) => <li key={f}>{f}</li>)}</ul>}
          <ul className="lc-linklist">
            {g.id === "movement" && stretch && <li><ExtLink link={{ label: "My stretching video", href: stretch }} /></li>}
            {g.items.map((l) => <li key={l.href + l.label}><ExtLink link={l} /></li>)}
          </ul>
        </section>
      ))}
      <section id="shopping" className="lc-card lc-res">
        <h2>Thrifting and supplies list</h2>
        <p className="lc-note">Tick things off as you find them. It saves in this browser.</p>
        {supplies.map((g) => (
          <div key={g.group}>
            <h3>{g.group}</h3>
            <ul className="lc-checks">
              {g.items.map((i) => (
                <li key={i}><label><input type="checkbox" checked={shop.has(`${g.group}:${i}`)} onChange={() => toggle(`${g.group}:${i}`)} /><span>{i}</span></label></li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
