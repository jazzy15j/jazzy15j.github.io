"use client";

import { useEffect, useId, useRef, useState } from "react";
import credits from "../lib/credits.json";
import type { StopKind } from "../lib/types";

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

const UI_ICONS: Record<string, React.ReactNode> = {
  plan: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M12 13l.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 15.1l2-.3z" fill="currentColor" stroke="none" />
    </>
  ),
  budget: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v1.5" />
      <rect x="3.5" y="8" width="17" height="11.5" rx="2.5" />
      <circle cx="16.5" cy="13.75" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  map: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  eat: (
    <>
      <path d="M7 3v8M4.5 3v5.5A2.5 2.5 0 0 0 7 11a2.5 2.5 0 0 0 2.5-2.5V3M7 11v10" />
      <path d="M17 21V3c-2.5 1.5-3.5 5-3.5 8H17" />
    </>
  ),
  stamp: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M5 21h14v-3.2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
      <path d="M12 6.5l.8 1.6 1.7.25-1.25 1.2.3 1.7-1.55-.8-1.55.8.3-1.7-1.25-1.2 1.7-.25z" fill="currentColor" stroke="none" />
    </>
  ),
  tools: (
    <>
      <path d="M12 3l1.7 4.4L18 9l-4.3 1.6L12 15l-1.7-4.4L6 9l4.3-1.6z" />
      <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5.5 14.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.8 12.5h9.4L17.5 7" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l1-4.2L16.3 4.5a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  walk: (
    <>
      <circle cx="13" cy="4.5" r="1.8" />
      <path d="M11 21l2-6-2.5-2.5L11.5 8 8 10v3M13 8l3 3 3 .5M13 15l3 2 .5 4" />
    </>
  ),
  bus: (
    <>
      <rect x="4.5" y="4" width="15" height="14" rx="3" />
      <path d="M4.5 11h15M7 18v2M17 18v2" />
      <circle cx="8.5" cy="14.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  car: (
    <>
      <path d="M5 16V12l2-5h10l2 5v4M3.5 16h17M5.5 16v2.5M18.5 16v2.5" />
      <circle cx="8" cy="13" r=".9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="13" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  nav: <path d="M12 3l7 17-7-4-7 4z" />,
  down: <path d="M6 9l6 6 6-6" />,
  alert: (
    <>
      <path d="M12 3.5l9 16H3z" />
      <path d="M12 10v4.5M12 17.2v.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9L3.5 9.7l5.9-.8z" />,
  heart: <path d="M12 20S4 14.5 4 9a4.2 4.2 0 0 1 8-1.8A4.2 4.2 0 0 1 20 9c0 5.5-8 11-8 11z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
    </>
  ),
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />,
  cash: (
    <>
      <rect x="3" y="7" width="18" height="10.5" rx="2" />
      <circle cx="12" cy="12.25" r="2.4" />
      <path d="M6 10v4.5M18 10v4.5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  download: <path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14" />,
  upload: <path d="M12 16V5M7.5 9L12 4.5 16.5 9M5 20h14" />,
  undo: <path d="M9 7L4.5 11.5 9 16M5 11.5h9.5a5 5 0 0 1 0 10H12" />,
  shuttle: (
    <>
      <path d="M3.5 15V8.5a2 2 0 0 1 2-2h10.8a2 2 0 0 1 1.7.9l2.2 3.6a2 2 0 0 1 .3 1V15z" />
      <path d="M3.5 15h17M8 15v1M16 15v1" />
    </>
  ),
};

export function Icon({ name, size = 22, className = "", stroke = 1.8 }: { name: string; size?: number; className?: string; stroke?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {UI_ICONS[name] ?? null}
    </svg>
  );
}

export const Sparkle = ({ size = 14, className = "", style }: { size?: number; className?: string; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
    <path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z" />
  </svg>
);

/* Stamp glyphs, drawn on a 48×48 grid. */
const GLYPHS: Record<string, React.ReactNode> = {
  plane: <path d="M24 5c1.7 0 2.7 1.6 2.7 3.2V19l15.8 9v4.5l-15.8-4.3v8l5.3 4v3.3L24 41l-8 2.5v-3.3l5.3-4v-8L5.5 32.5V28l15.8-9V8.2C21.3 6.6 22.300 5 24 5z" fill="currentColor" stroke="none" />,
  bed: (
    <>
      <path d="M7 36V14M7 28h34v8M41 28v-5a5 5 0 0 0-5-5H20v10" />
      <circle cx="14" cy="22" r="3.6" />
    </>
  ),
  skyline: (
    <>
      <path d="M7 40V23h7v17M14 40V15h8v25M22 40V25h6v15M28 40V19h7v21M35 40V29h6v11M5 40h38M18 15V8" />
    </>
  ),
  leaf: <path d="M24 41V22M24 31c-9-1-14-7-14-17 9 1 14 8 14 17zM24 31c9-1 14-7 14-17-9 1-14 8-14 17zM24 25c-5-4-6-10 0-17 6 7 5 13 0 17z" />,
  cocktail: (
    <>
      <path d="M9 11h30L24 28zM24 28v12M15 40h18M31 6l-9 12" />
      <circle cx="31" cy="17" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),
  cart: (
    <>
      <path d="M6 9h6l4 19h19l4-14H14" />
      <circle cx="19" cy="36" r="2.4" />
      <circle cx="33" cy="36" r="2.4" />
    </>
  ),
  wave: (
    <>
      <circle cx="24" cy="16" r="6" />
      <path d="M24 4v2M12 16h2M34 16h2M15.500 7.500l1.400 1.400M32.500 7.500l-1.400 1.400" />
      <path d="M6 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0M6 37c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
    </>
  ),
  gem: <path d="M14 13h20l7 9-17 19L7 22zM7 22h34M18 13l-4 9 10 19M30 13l4 9-10 19" />,
  chandelier: (
    <>
      <path d="M24 5v8M11 19h26M11 19c0 7 5 11 13 11s13-4 13-11M15 30v6M24 32v9M33 30v6" />
      <circle cx="11" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="24" cy="16" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="37" cy="16" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  fountain: <path d="M24 39V19M24 19c-2-9-11-11-15-6M24 19c2-9 11-11 15-6M24 25c-4-6-12-6-16 0M24 25c4-6 12-6 16 0M6 39h36M11 44h26" />,
  train: (
    <>
      <rect x="9" y="12" width="30" height="20" rx="8" />
      <path d="M9 24h30M18 12v12M30 12v12M4 38h40M16 32l-2 6M32 32l2 6" />
    </>
  ),
  flamingo: (
    <>
      <ellipse cx="22" cy="28" rx="11" ry="6.500" />
      <path d="M30 24c7-1 9-9 4-13-4-3-9 0-8 5M34 11l6 2-6 2M20 34v11M25 34v8" />
    </>
  ),
  gondola: (
    <>
      <path d="M5 28c2 9 36 9 38 0-12 3-26 3-38 0zM24 28V14M24 14l9 6-9 2M39 25l4-9" />
    </>
  ),
  moon: (
    <>
      <path d="M30 7a17 17 0 1 0 11 25A15 15 0 0 1 30 7z" />
      <path d="M38 8v5M35.500 10.500h5" />
    </>
  ),
  heart: <path d="M24 41C7 29 7 14 18 11.500c4-1 6 2 6 4.500 0-2.500 2-5.500 6-4.500C41 14 41 29 24 41z" />,
  bus: (
    <>
      <rect x="8" y="9" width="32" height="27" rx="4" />
      <path d="M8 22h32M14 15h7M27 15h7M14 28h7M27 28h7" />
      <circle cx="16" cy="38.500" r="2.600" />
      <circle cx="32" cy="38.500" r="2.600" />
    </>
  ),
  bowl: (
    <>
      <path d="M7 22h34c0 10-7 17-17 17S7 32 7 22zM14 14c0 3 4 3 4 6M22 11c0 3 4 4 4 9M30 14c0 3 4 3 4 6" />
      <path d="M31 8l8 12" />
    </>
  ),
  tree: (
    <>
      <path d="M24 41V28M24 6l-11 15h22zM24 14L11 30h26z" />
    </>
  ),
  flower: (
    <>
      <circle cx="24" cy="20" r="4" />
      <path d="M24 16c-3-6-1-10 0-11 1 1 3 5 0 11zM24 24c3 6 1 10 0 11-1-1-3-5 0-11zM20 20c-6-3-10-1-11 0 1 1 5 3 11 0zM28 20c6 3 10 1 11 0-1-1-5-3-11 0z" />
      <path d="M24 28v15M24 38c-5 0-8-2-9-5 4 0 8 1 9 5zM24 36c5 0 8-2 9-5-4 0-8 1-9 5z" />
    </>
  ),
  neon: <path d="M24 5l4.500 11h11.500l-9 7.500 3.500 12.500L24 29l-10.500 7 3.500-12.500-9-7.500H19.500z" />,
  sun: (
    <>
      <path d="M8 34h32M12 34a12 12 0 0 1 24 0M24 12v5M10 18l3.500 3.500M38 18l-3.500 3.500M5 28h5M38 28h5" />
      <path d="M12 40h24" />
    </>
  ),
};

export function Glyph({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {GLYPHS[name] ?? GLYPHS.star}
    </svg>
  );
}

const KIND_GLYPH: Record<StopKind, string> = {
  arrive: "plane",
  hotel: "bed",
  walk: "skyline",
  shop: "leaf",
  sight: "flamingo",
  show: "fountain",
  pool: "wave",
  food: "bowl",
  drink: "cocktail",
  grocery: "cart",
  ride: "bus",
  free: "chandelier",
  depart: "sun",
};

/* ------------------------------------------------------------------ */
/* Photo with illustrated fallback                                     */
/* ------------------------------------------------------------------ */

const HAVE = credits as Record<string, unknown>;
export const photoSrc = (id: string) => `/vegas-birthday-30/photos/${id}.jpg`;
export const hasPhoto = (id?: string) => !!id && id in HAVE;

export function Photo({
  id,
  kind = "free",
  alt,
  className = "",
  eager = false,
}: {
  id?: string;
  kind?: StopKind;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (id && hasPhoto(id) && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoSrc(id)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (illustration)`}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: "linear-gradient(165deg,#f6d9a8 0%,#e7a98a 45%,#b05a6d 80%,#123d31 100%)" }}
    >
      <Sparkle className="twinkle" size={12} style={{ left: "14%", top: "18%" }} />
      <Sparkle className="twinkle" size={9} style={{ left: "80%", top: "26%", animationDelay: "1s" }} />
      <Sparkle className="twinkle" size={11} style={{ left: "66%", top: "70%", animationDelay: "2s" }} />
      <div className="text-burgundy/80">
        <Glyph name={KIND_GLYPH[kind]} size={72} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Passport stamp                                                      */
/* ------------------------------------------------------------------ */

const INKS = ["#a3212f", "#8a6417", "#4a2e1f", "#c0392b", "#556b3a", "#3f4f72"];

export function StampArt({
  icon,
  top,
  date,
  index = 0,
  size = 112,
  animate = false,
  ghost = false,
}: {
  icon: string;
  top: string;
  date?: string;
  index?: number;
  size?: number;
  animate?: boolean;
  ghost?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const ink = ghost ? "#a99383" : INKS[index % INKS.length];
  const tilt = ((index * 37) % 17) - 8;
  const label = top.length > 16 ? top.slice(0, 18) : top;
  return (
    <div
      className={animate ? "stamp-slam" : ""}
      style={{ ["--tilt" as string]: `${tilt}deg`, transform: `rotate(${tilt}deg)`, width: size, height: size }}
    >
      <svg viewBox="0 0 140 140" width={size} height={size} style={{ color: ink, opacity: ghost ? 0.5 : 0.94 }} aria-hidden="true">
        <defs>
          <path id={`arc-${uid}`} d="M 22 70 A 48 48 0 0 1 118 70" />
          <path id={`arcb-${uid}`} d="M 14 70 A 56 56 0 0 0 126 70" />
        </defs>
        <g filter={ghost ? undefined : "url(#vb30-ink)"} fill="none" stroke="currentColor">
          <circle cx="70" cy="70" r="64" strokeWidth="3.4" strokeDasharray={ghost ? "4 5" : undefined} />
          <circle cx="70" cy="70" r="57" strokeWidth="1.2" />
          <circle cx="70" cy="70" r="33" strokeWidth="1.6" />
          <text fill="currentColor" stroke="none" fontSize="11.5" fontWeight="800" letterSpacing="1.6" fontFamily="'Special Elite', Georgia, serif">
            <textPath href={`#arc-${uid}`} startOffset="50%" textAnchor="middle">
              {label}
            </textPath>
          </text>
          <text fill="currentColor" stroke="none" fontSize="10" fontWeight="800" letterSpacing="1.8" fontFamily="'Special Elite', Georgia, serif" dominantBaseline="hanging">
            <textPath href={`#arcb-${uid}`} startOffset="50%" textAnchor="middle" dy="1">
              {ghost ? "★ ★ ★" : (date ?? "LAS VEGAS · NV")}
            </textPath>
          </text>
          <g transform="translate(46 46) scale(1)" color={ink}>
            {ghost ? (
              <text x="24" y="33" textAnchor="middle" fontSize="26" fontWeight="800" fill="currentColor" stroke="none" fontFamily="Georgia, serif">
                ?
              </text>
            ) : (
              <Glyph name={icon} size={48} />
            )}
          </g>
          <path d="M10 70h8M122 70h8" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

/** Hidden SVG filter shared by all stamps for a rough, inked look. */
export function InkFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="vb30-ink" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
      </filter>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

export function parseMoney(s: string): number | null {
  const cleaned = s.replace(/[^0-9.]/g, "");
  if (cleaned === "" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

export function MoneyField({
  value,
  onChange,
  placeholder = "—",
  label,
  className = "",
  big = false,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  label: string;
  className?: string;
  big?: boolean;
}) {
  const [text, setText] = useState(value == null ? "" : String(value));
  const last = useRef<number | null>(value);
  useEffect(() => {
    if (value !== last.current) {
      last.current = value;
      setText(value == null ? "" : String(value));
    }
  }, [value]);
  return (
    <div className={`relative ${className}`}>
      <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-bold text-ink-soft ${big ? "text-lg" : ""}`}>$</span>
      <input
        className={`field num pl-7 font-bold ${big ? "!min-h-[52px] text-xl" : ""}`}
        inputMode="decimal"
        aria-label={label}
        placeholder={placeholder}
        value={text}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, "");
          setText(raw);
          const v = parseMoney(raw);
          last.current = v;
          onChange(v);
        }}
      />
    </div>
  );
}

export function PayToggle({ value, onChange, label }: { value: "cash" | "card"; onChange: (v: "cash" | "card") => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      <button type="button" aria-pressed={value === "cash"} onClick={() => onChange("cash")}>
        Cash
      </button>
      <button type="button" aria-pressed={value === "card"} onClick={() => onChange("card")}>
        Card
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom sheet                                                        */
/* ------------------------------------------------------------------ */

export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" className="fade absolute inset-0 bg-night/60 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className="sheet-up relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-paper px-4 pt-3 shadow-2xl"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-ink-soft/30" />
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-burgundy">{title}</h2>
          <button className="btn btn-ghost !min-h-[40px] !px-3" onClick={onClose} aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Collapse({
  title,
  icon,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon?: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="card overflow-hidden">
      <button
        className="flex min-h-[56px] w-full items-center gap-3 px-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{ background: "transparent", border: 0 }}
      >
        {icon ? <Icon name={icon} className="text-wine" /> : null}
        <span className="font-display flex-1 text-[17px] font-extrabold text-burgundy">{title}</span>
        {badge}
        <Icon name="down" className={`text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="fade border-t border-gold/25 px-4 pb-4 pt-3">{children}</div> : null}
    </section>
  );
}
