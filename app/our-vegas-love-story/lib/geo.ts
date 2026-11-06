import { LV, TRIP_TZ } from "./data";
import type { Stop } from "./types";

const enc = encodeURIComponent;

export const mapsPlaceUrl = (s: Pick<Stop, "place" | "address">): string =>
  `https://www.google.com/maps/search/?api=1&query=${enc(`${s.place}, ${s.address}`)}`;

type Mode = "walking" | "transit" | "driving";

export const mapsDirUrl = (
  from: Pick<Stop, "place" | "address"> | null,
  to: Pick<Stop, "place" | "address">,
  mode: Mode = "walking",
): string => {
  const origin = from ? `&origin=${enc(`${from.place}, ${from.address}`)}` : "";
  return `https://www.google.com/maps/dir/?api=1${origin}&destination=${enc(`${to.place}, ${to.address}`)}&travelmode=${mode}`;
};

export const modeFor = (s: Stop): Mode =>
  s.leg?.mode === "transit" || s.leg?.mode === "shuttle"
    ? "transit"
    : s.leg?.mode === "taxi"
      ? "driving"
      : "walking";

/** Whole-day route link (max 9 waypoints), skipping same-place repeats. */
export const mapsDayRouteUrl = (stops: Stop[]): string => {
  const pts: Stop[] = [];
  for (const s of stops) {
    const prev = pts[pts.length - 1];
    if (!prev || prev.address !== s.address || prev.place !== s.place) pts.push(s);
  }
  if (pts.length < 2) return mapsPlaceUrl(pts[0] ?? stops[0]);
  const q = (s: Stop) => enc(`${s.place}, ${s.address}`);
  const mid = pts.slice(1, -1).slice(0, 9).map(q).join("%7C");
  return `https://www.google.com/maps/dir/?api=1&origin=${q(pts[0])}&destination=${q(pts[pts.length - 1])}${
    mid ? `&waypoints=${mid}` : ""
  }&travelmode=walking`;
};

/* ---------------------------- Sunrise / sunset ---------------------------- */

const rad = Math.PI / 180;

/** NOAA-style solar calculation. Returns UTC ms for the event on the given civil date. */
function solarEvent(year: number, month: number, day: number, lat: number, lng: number, sunrise: boolean): number {
  const N1 = Math.floor((275 * month) / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const N = N1 - N2 * N3 + day - 30;
  const lngHour = lng / 15;
  const t = N + ((sunrise ? 6 : 18) - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 282.634;
  L = ((L % 360) + 360) % 360;
  let RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;
  RA = ((RA % 360) + 360) % 360;
  RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
  const sinDec = 0.39782 * Math.sin(L * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(lat * rad)) / (cosDec * Math.cos(lat * rad));
  const H = (sunrise ? 360 - Math.acos(cosH) / rad : Math.acos(cosH) / rad) / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  const UT = (((T - lngHour) % 24) + 24) % 24;
  return Date.UTC(year, month - 1, day) + UT * 3600 * 1000;
}

export function sunTimes(iso: string): { sunrise: number; sunset: number } {
  const [y, m, d] = iso.split("-").map(Number);
  let sunrise = solarEvent(y, m, d, LV.lat, LV.lng, true);
  let sunset = solarEvent(y, m, d, LV.lat, LV.lng, false);
  // Keep both events on the same Pacific civil day.
  const dayStart = Date.UTC(y, m - 1, d, 8, 0, 0);
  while (sunrise < dayStart) sunrise += 86400000;
  while (sunrise >= dayStart + 86400000) sunrise -= 86400000;
  while (sunset < dayStart) sunset += 86400000;
  while (sunset >= dayStart + 86400000) sunset -= 86400000;
  return { sunrise, sunset };
}

export const fmtClock = (utcMs: number): string =>
  new Intl.DateTimeFormat("en-US", { timeZone: TRIP_TZ, hour: "numeric", minute: "2-digit" }).format(utcMs);

/** Minutes after midnight in Las Vegas + ISO date, for "up next". */
export function vegasNow(now = Date.now()): { iso: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TRIP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { iso: `${g("year")}-${g("month")}-${g("day")}`, minutes: Number(g("hour")) * 60 + Number(g("minute")) };
}

export function countdown(target: number, now = Date.now()) {
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return { ms, days, hours, mins, secs };
}
