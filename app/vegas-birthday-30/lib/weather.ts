import { LV, TRIP_TZ } from "./data";

export interface DayWeather {
  hi: number;
  lo: number;
  rain: number;
  code: number;
}

export type WeatherMap = Record<string, DayWeather>;

const KEY = "vb30-weather-v1";

export function describeWeather(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: "☀️", label: "Sunny" };
  if (code <= 2) return { icon: "🌤️", label: "Mostly sunny" };
  if (code === 3) return { icon: "☁️", label: "Cloudy" };
  if (code <= 48) return { icon: "🌫️", label: "Hazy" };
  if (code <= 67) return { icon: "🌧️", label: "Rain" };
  if (code <= 77) return { icon: "🌨️", label: "Snow" };
  if (code <= 82) return { icon: "🌦️", label: "Showers" };
  return { icon: "⛈️", label: "Storms" };
}

export function readCachedWeather(): WeatherMap | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw).data as WeatherMap;
  } catch {
    return null;
  }
}

export async function fetchWeather(): Promise<WeatherMap | null> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${LV.lat}&longitude=${LV.lng}` +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    `&temperature_unit=fahrenheit&timezone=${encodeURIComponent(TRIP_TZ)}` +
    "&start_date=2026-12-14&end_date=2026-12-18";
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = await res.json();
    const out: WeatherMap = {};
    (j.daily.time as string[]).forEach((d, i) => {
      out[d] = {
        hi: Math.round(j.daily.temperature_2m_max[i]),
        lo: Math.round(j.daily.temperature_2m_min[i]),
        rain: Math.round(j.daily.precipitation_probability_max[i] ?? 0),
        code: j.daily.weather_code[i] ?? 0,
      };
    });
    try {
      localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data: out }));
    } catch {
      /* storage may be unavailable */
    }
    return out;
  } catch {
    return null;
  }
}
