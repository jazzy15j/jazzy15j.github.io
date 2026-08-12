// Small date helpers. Kept dependency-free on purpose.

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Monday of the week containing the given ISO date. */
export function mondayOf(iso: string): string {
  const d = parseISODate(iso);
  const day = d.getDay(); // 0 = Sun ... 6 = Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return toISODate(d);
}

export function daysBetween(fromISO: string, toISOStr: string): number {
  const a = parseISODate(fromISO);
  const b = parseISODate(toISOStr);
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const MONTH_DAY_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

export function fullWeekdayName(iso: string): string {
  return WEEKDAY_FORMAT.format(parseISODate(iso));
}

export function monthDay(iso: string): string {
  return MONTH_DAY_FORMAT.format(parseISODate(iso));
}
