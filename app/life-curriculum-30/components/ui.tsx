"use client";

import type { Link } from "../lib/links";

export function ExtLink({ link, className }: { link: Link; className?: string }) {
  const internal = link.href.startsWith("/") || link.href.startsWith("#");
  return (
    <a
      className={className ?? "lc-pill"}
      href={link.href}
      {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {link.label}
      {!internal && <span aria-hidden="true"> ↗</span>}
      {!internal && <span className="lc-sr"> (opens in a new tab)</span>}
    </a>
  );
}

export function Links({ links }: { links?: Link[] }) {
  if (!links?.length) return null;
  return (
    <div className="lc-pills">
      {links.map((l) => <ExtLink key={l.href + l.label} link={l} />)}
    </div>
  );
}

export function Bar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="lc-bar" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label ?? "Progress"}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
