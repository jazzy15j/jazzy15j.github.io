import type { CategoryId, Confirm, PackItem, Settings, Stop } from "./types";

/* ------------------------------------------------------------------ */
/* Trip basics                                                         */
/* ------------------------------------------------------------------ */

export const HOTEL = {
  name: "The Signature at MGM Grand, Tower A",
  address: "145 E Harmon Ave, Las Vegas, NV 89109",
  lat: 36.1034,
  lng: -115.1641,
};

export const TRIP_TZ = "America/Los_Angeles";
/** Wheels down at LAS, 2:03 PM PST (UTC-8) on Mon 11/9/2026. */
export const TRIP_START_UTC = Date.UTC(2026, 10, 9, 22, 3, 0);
export const TRIP_END_UTC = Date.UTC(2026, 10, 13, 14, 30, 0);
export const LV = { lat: 36.1147, lng: -115.1728 };

export interface DayInfo {
  index: number;
  iso: string;
  short: string;
  weekday: string;
  label: string;
  title: string;
  tagline: string;
  emoji: string;
  loveNote: string;
}

export const DAYS: DayInfo[] = [
  {
    index: 0,
    iso: "2026-11-09",
    short: "Mon 11/9",
    weekday: "Monday",
    label: "Nov 9",
    title: "Arrival & Planet 13",
    tagline: "Wheels down, adventure on.",
    emoji: "✈️",
    loveNote:
      "Day one, stamped. Three years ago we said yes to forever — tonight we get to say yes to a whole new adventure. Cheers to us.",
  },
  {
    index: 1,
    iso: "2026-11-10",
    short: "Tue 11/10",
    weekday: "Tuesday",
    label: "Nov 10",
    title: "Free Art & Fountains",
    tagline: "Chandeliers, couture and dancing water.",
    emoji: "⛲",
    loveNote:
      "The fountains danced, but you were the best thing I watched all night. Same time next year?",
  },
  {
    index: 2,
    iso: "2026-11-11",
    short: "Wed 11/11",
    weekday: "Wednesday",
    label: "Nov 11",
    title: "Our Anniversary",
    tagline: "Three years. One very lucky pair.",
    emoji: "💍",
    loveNote:
      "Three years, a lake of dreams, and the best dinner date a person could ask for. Happy anniversary, my love — here's to a hundred more.",
  },
  {
    index: 3,
    iso: "2026-11-12",
    short: "Thu 11/12",
    weekday: "Thursday",
    label: "Nov 12",
    title: "Fremont Food Adventure",
    tagline: "Old Vegas neon, new favorite bites.",
    emoji: "🎰",
    loveNote:
      "Old Vegas glow, good food, and my favorite person. Every adventure is better with you in it.",
  },
  {
    index: 4,
    iso: "2026-11-13",
    short: "Fri 11/13",
    weekday: "Friday",
    label: "Nov 13",
    title: "Homeward Bound",
    tagline: "Early bird, full heart.",
    emoji: "🌅",
    loveNote: "Home with a full heart and a passport full of stamps. Until next time, Las Vegas.",
  },
];

/* ------------------------------------------------------------------ */
/* Budget                                                              */
/* ------------------------------------------------------------------ */

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  short: string;
  emoji: string;
  /** Tailwind-free colour used for the bars. */
  color: string;
  protected?: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: "restaurants", label: "Restaurants & social hours", short: "Dining", emoji: "🍸", color: "#8c2438" },
  { id: "beerCannabis", label: "Beer & cannabis", short: "Planet 13", emoji: "🍺", color: "#b8893a" },
  { id: "groceries", label: "Groceries (Instacart)", short: "Groceries", emoji: "🛒", color: "#6b7b4a" },
  { id: "airportTaxis", label: "Airport taxis", short: "Airport", emoji: "🚕", color: "#3b2418" },
  { id: "monorail", label: "Monorail", short: "Monorail", emoji: "🚝", color: "#a2566a" },
  { id: "deuce", label: "Deuce bus", short: "Deuce", emoji: "🚌", color: "#c07a3e" },
  { id: "backup", label: "Backup transportation", short: "Backup rides", emoji: "🚖", color: "#5d6f7a" },
  { id: "cushion", label: "Protected cushion", short: "Cushion", emoji: "🛟", color: "#d4a94f", protected: true },
];

export const CAT: Record<CategoryId, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryInfo>;

export const DEFAULT_SETTINGS: Settings = {
  limit: 800,
  alloc: {
    groceries: 49,
    restaurants: 295,
    beerCannabis: 100,
    airportTaxis: 70,
    monorail: 23,
    deuce: 16,
    backup: 50,
    cushion: 197,
  },
  cashInHand: 400,
  atmPlanned: 350,
  atmDone: false,
  deposit: {
    amount: 300,
    method: "card",
    status: "pending",
    note: "Refundable hotel security hold — not part of the $800 budget.",
  },
};

/* ------------------------------------------------------------------ */
/* Things that still need confirming                                   */
/* ------------------------------------------------------------------ */

const c = (id: string, text: string): Confirm => ({ id, text });

/* ------------------------------------------------------------------ */
/* Itinerary                                                           */
/* ------------------------------------------------------------------ */

export const STOPS: Stop[] = [
  /* -------------------------- Monday 11/9 -------------------------- */
  {
    id: "mon-land",
    day: 0,
    time: "2:03 PM",
    start: 14 * 60 + 3,
    title: "Touchdown at LAS",
    kind: "arrive",
    blurb: "Wheels down in Las Vegas! Grab the bags, take a breath, and let the neon welcome you.",
    place: "Harry Reid International Airport",
    address: "5757 Wayne Newton Blvd, Las Vegas, NV 89119",
    url: "https://www.harryreidairport.com/",
    urlLabel: "Airport site",
    photo: "lasairport",
    lat: 36.084,
    lng: -115.1537,
    est: 0,
    category: null,
    method: "cash",
    stamp: "touchdown",
    tips: ["Terminal 1 taxi line is outside baggage claim. Keep your gate/flight info handy for the trip home."],
  },
  {
    id: "mon-taxi",
    day: 0,
    time: "2:40 PM",
    start: 14 * 60 + 40,
    title: "Taxi to the hotel",
    kind: "ride",
    blurb: "Straight from the airport to The Signature — about 10–15 minutes without traffic.",
    place: "The Signature at MGM Grand",
    address: "145 E Harmon Ave, Las Vegas, NV 89109",
    url: "https://taxi.nv.gov/",
    urlLabel: "Taxicab Authority",
    lat: 36.1034,
    lng: -115.1641,
    est: 35,
    category: "airportTaxis",
    method: "cash",
    assumed:
      "Assumed: your $70 airport-taxi budget covers one ride each way (~$35). Edit if you ride share or pay differently.",
    leg: {
      mode: "taxi",
      distance: "~4 mi",
      time: "10–20 min",
      how: "Taxi stand outside baggage claim. Ask for The Signature at MGM Grand (Tower A, Harmon Ave side).",
    },
  },
  {
    id: "mon-checkin",
    day: 0,
    time: "3:00 PM",
    start: 15 * 60,
    title: "Check in at The Signature",
    kind: "hotel",
    blurb: "Check in (or store the bags if the room isn't ready yet). Our home base for the whole adventure.",
    place: "The Signature at MGM Grand, Tower A",
    address: "145 E Harmon Ave, Las Vegas, NV 89109",
    url: "https://mgmgrand.mgmresorts.com/",
    urlLabel: "MGM Grand site",
    photo: "signature",
    lat: 36.1034,
    lng: -115.1641,
    est: 0,
    category: null,
    method: "card",
    stamp: "homebase",
    tips: [
      "The refundable $300 security hold goes on the card — track it in Budget → Hotel deposit. It is NOT part of the $800.",
      "Ask the front desk whether the pool is open and when.",
    ],
  },
  {
    id: "mon-walk-nyny",
    day: 0,
    time: "3:30 – 4:00 PM",
    start: 15 * 60 + 30,
    title: "Walk to New York-New York",
    kind: "walk",
    blurb: "Stroll the Strip to the New York-New York shuttle stop for Planet 13's free ride.",
    place: "New York-New York Hotel & Casino",
    address: "3790 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://planet13.com/visit",
    urlLabel: "Planet 13 shuttle info",
    photo: "nyny",
    lat: 36.1023,
    lng: -115.1744,
    est: 0,
    category: null,
    method: "cash",
    stamp: "bigapple",
    leg: {
      mode: "walk",
      distance: "0.8 mi",
      time: "~17 min",
      how: "Through MGM Grand to the Strip, then cross the pedestrian bridge at Tropicana to New York-New York.",
    },
    confirm: [
      c("shuttle-times", "Planet 13 free shuttle: exact pickup spot and departure times from New York-New York (unconfirmed)."),
    ],
  },
  {
    id: "mon-planet13",
    day: 0,
    time: "4:00 – 5:00 PM",
    start: 16 * 60,
    title: "Planet 13",
    kind: "shop",
    blurb:
      "The world's largest cannabis dispensary — part art museum, part theme park. Budget comes from the $100 beer & cannabis allowance.",
    place: "Planet 13 Las Vegas",
    address: "2548 W Desert Inn Rd, Las Vegas, NV 89109",
    url: "https://planet13.com/visit",
    urlLabel: "Visit Planet 13",
    photo: "planet13",
    lat: 36.1297,
    lng: -115.1826,
    est: 100,
    category: "beerCannabis",
    method: "cash",
    stamp: "planet13",
    leg: {
      mode: "shuttle",
      distance: "~3.5 mi",
      time: "~15–20 min",
      how: "Free Planet 13 shuttle from New York-New York (times unconfirmed). Backup: taxi or rideshare from the backup fund.",
    },
    confirm: [c("shuttle-times", "Shuttle departure times & pickup spot — see above.")],
    tips: [
      "Bring a valid government ID (21+) and your cash.",
      "Nevada rules: use cannabis only where it's allowed (not in public or in the hotel), and never take it through the airport.",
    ],
  },
  {
    id: "mon-return",
    day: 0,
    time: "5:00 – 5:45 PM",
    start: 17 * 60,
    title: "Return shuttle to the Strip",
    kind: "ride",
    blurb: "Ride the free shuttle back to New York-New York — if it's confirmed. Otherwise use a rideshare from the backup fund.",
    place: "Planet 13 Las Vegas",
    address: "2548 W Desert Inn Rd, Las Vegas, NV 89109",
    url: "https://planet13.com/visit",
    urlLabel: "Planet 13 shuttle info",
    lat: 36.1297,
    lng: -115.1826,
    est: 0,
    category: "backup",
    method: "card",
    leg: {
      mode: "shuttle",
      distance: "~3.5 mi",
      time: "~15–20 min",
      how: "Free shuttle to New York-New York, then walk ~17 min back to the hotel. If no shuttle, log the rideshare here as Actual (Backup rides).",
    },
    confirm: [c("return-shuttle", "Return shuttle times (unconfirmed). Have a backup rideshare ready.")],
  },
  {
    id: "mon-hakkasan",
    day: 0,
    time: "6:00 – 7:00 PM",
    start: 18 * 60,
    title: "Hakkasan Social Hour",
    kind: "drink",
    blurb: "Glamorous Cantonese-inspired bites and cocktails inside MGM Grand during Social Hour.",
    place: "Hakkasan Las Vegas, MGM Grand",
    address: "3799 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://taogroup.com/venues/hakkasan-las-vegas/social-hour/",
    urlLabel: "Social hour & menu",
    photo: "hakkasan",
    lat: 36.1021,
    lng: -115.1698,
    est: 65,
    category: "restaurants",
    method: "cash",
    stamp: "hakkasan",
    leg: {
      mode: "walk",
      distance: "0.4 mi",
      time: "~10 min",
      how: "From The Signature, follow the covered walkway into MGM Grand and head to the Hakkasan entrance on the casino level.",
    },
    confirm: [c("hakkasan-hours", "Hakkasan Social Hour: posted as Mon–Wed 5–7 PM, bar seating only (verified on the venue site Nov 6). Re-check the day before we go.")],
  },
  {
    id: "mon-instacart",
    day: 1,
    time: "1:00 – 2:00 PM",
    start: 13 * 60,
    title: "Instacart delivery (arrives today)",
    kind: "grocery",
    blurb: "Snacks, water, and breakfast treats delivered to the hotel. Paid by card.",
    place: "The Signature at MGM Grand",
    address: "145 E Harmon Ave, Las Vegas, NV 89109",
    url: "https://www.instacart.com/",
    urlLabel: "Instacart",
    lat: 36.1034,
    lng: -115.1641,
    est: 55,
    category: "groceries",
    method: "card",
    stamp: "stocked",
    tips: ["Track what arrives in Tools → Grocery inventory. Add a tip in the card total if you left one."],
  },

  /* -------------------------- Tuesday 11/10 ------------------------ */
  {
    id: "tue-pool",
    day: 1,
    time: "9:30 – 11:00 AM",
    start: 9 * 60 + 30,
    title: "Hotel pool",
    kind: "pool",
    blurb: "A slow, sunny morning by the water — if the pool is open this time of year.",
    place: "The Signature at MGM Grand",
    address: "145 E Harmon Ave, Las Vegas, NV 89109",
    url: "https://mgmgrand.mgmresorts.com/",
    urlLabel: "MGM Grand site",
    photo: "pool",
    lat: 36.1034,
    lng: -115.1641,
    est: 0,
    category: null,
    method: "card",
    stamp: "splash",
    confirm: [c("pool-open", "Is the pool open (and heated)? Hours in November are unconfirmed — ask the front desk.")],
  },
  {
    id: "tue-brewdog",
    day: 1,
    time: "2:10 PM (option)",
    start: 14 * 60 + 10,
    title: "Option: BrewDog beer break at Aria",
    kind: "drink",
    blurb:
      "The free tram stops at Aria, so this is an easy detour for a $7 beer (reported happy-hour price). Pick this or Alexxa's — or do both if you're feeling it.",
    place: "BrewDog Las Vegas, ARIA",
    address: "3730 S Las Vegas Blvd, Las Vegas, NV 89158",
    lat: 36.1072,
    lng: -115.1766,
    est: 17,
    category: "restaurants",
    method: "cash",
    assumed: "Two $7 beers plus tip. Skip it to keep today fully free.",
    leg: {
      mode: "transit",
      distance: "~1 mi",
      time: "~25 min",
      how: "Walk Signature → MGM Grand → New York-New York → Park MGM, then ride the free tram one stop to Aria.",
    },
    confirm: [
      c("brewdog-hours", "BrewDog at Aria: happy hour reported noon–6 PM Mon–Fri with $7 beer. Confirm it's open and the location inside Aria."),
    ],
  },
  {
    id: "tue-glass",
    day: 1,
    time: "3:00 PM",
    start: 15 * 60,
    title: "Bellagio Lobby Glass Ceiling",
    kind: "free",
    blurb:
      "Free art, no shopping: the Bellagio's hand-blown glass flower ceiling by Dale Chihuly, plus the grand lobby. (The Conservatory gardens are between displays and closed Nov 8–13, so we'll see them on the December trip.)",
    place: "Bellagio Lobby (Fiori di Como glass ceiling)",
    address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://bellagio.mgmresorts.com/",
    urlLabel: "Bellagio site",
    photo: "bellagio",
    lat: 36.1129,
    lng: -115.1768,
    est: 0,
    category: null,
    method: "cash",
    stamp: "conservatory",
    leg: {
      mode: "transit",
      distance: "~2 mi",
      time: "35–45 min",
      how: "All free: walk through MGM Grand → New York-New York → Park MGM, then ride the free tram to Bellagio (about 10 min). The tram is reported to run about 8 AM–2 AM.",
    },
    confirm: [c("tram", "Free Park MGM ↔ Aria ↔ Bellagio tram: confirm it's running today.")],
    tips: [
      "The glass ceiling is in the main lobby and free to look at — no need to gamble or buy anything.",
      "Walking is free all day; the tram just saves your feet.",
    ],
  },
  {
    id: "tue-alexxas",
    day: 1,
    time: "3:30 – 4:15 PM (option)",
    start: 15 * 60 + 30,
    title: "Option: Alexxa's happy hour at Paris",
    kind: "drink",
    blurb:
      "Right across the Strip from the Bellagio, with a view of the fountains. Reported happy hour: $5 draft beer, $6 house wine, $7 cocktails, 3–6 PM. A cheap beer for him and a drink for you if you want one.",
    place: "Alexxa's Bar, Paris Las Vegas",
    address: "3655 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.caesars.com/paris-las-vegas/restaurants/alexxas-bar",
    urlLabel: "Alexxa's page",
    lat: 36.1128,
    lng: -115.171,
    est: 22,
    category: "restaurants",
    method: "cash",
    assumed: "Two $5 beers, one $6–7 drink and tip. Skip to keep today free.",
    leg: {
      mode: "walk",
      distance: "0.2 mi",
      time: "~5 min",
      how: "Cross the Strip at the Bellagio pedestrian bridge to Paris, then find Alexxa's near the front by the Strip.",
    },
    confirm: [
      c(
        "alexxas-hours",
        "Alexxa's happy hour: a third-party list says daily 3–6 PM ($5 draft, $6 wine, $7 cocktails). I couldn't find an official listing — confirm at the bar.",
      ),
    ],
  },
  {
    id: "tue-cosmo",
    day: 1,
    time: "4:15 – 5:15 PM",
    start: 16 * 60 + 15,
    title: "The Cosmopolitan Chandelier",
    kind: "free",
    blurb:
      "A free look-around at the three-story Chandelier lounge, quirky public art and playful corners. Nothing here is required — skip anything that isn't fun.",
    place: "The Cosmopolitan of Las Vegas",
    address: "3708 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.cosmopolitanlasvegas.com/",
    urlLabel: "Cosmopolitan site",
    photo: "cosmo",
    lat: 36.1098,
    lng: -115.1747,
    est: 0,
    category: null,
    method: "cash",
    stamp: "cosmo",
    leg: {
      mode: "walk",
      distance: "0.4 mi",
      time: "~9 min",
      how: "Walk north along the Strip from Paris/Bellagio to the Cosmopolitan.",
    },
    tips: [
      "Walking in and looking around costs nothing. Bars, restaurants and the casino are optional — we only spend if we want to.",
      "Chandelier Bar was reported to have $10 cocktails 3–6 PM on weekdays if you want a drink under the chandelier (unverified).",
    ],
  },
  {
    id: "tue-bellagio",
    day: 1,
    time: "5:15 PM",
    start: 17 * 60 + 15,
    title: "Bellagio Fountains at dusk",
    kind: "show",
    blurb: "Sunset is about 4:37 PM, so the lights come on while the music plays. Water, music and light dancing across the lake. Always free.",
    place: "Fountains of Bellagio",
    address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://bellagio.mgmresorts.com/",
    urlLabel: "Bellagio site",
    photo: "bellagio",
    lat: 36.1126,
    lng: -115.1745,
    est: 0,
    category: null,
    method: "cash",
    stamp: "fountains",
    leg: {
      mode: "walk",
      distance: "0.4 mi",
      time: "~9 min",
      how: "Walk south from the Cosmopolitan along the Strip to the Bellagio lake rail.",
    },
    confirm: [
      c(
        "fountain-times",
        "Fountain show times and sightlines — shows reported every 30 min 3–8 PM; Grand Prix grandstands may block part of the view in November.",
      ),
    ],
  },
  {
    id: "tue-beauty",
    day: 1,
    time: "5:00 – 6:30 PM (optional)",
    start: 17 * 60 + 5,
    title: "Optional: Beauty & Essex Social Hour",
    kind: "drink",
    blurb: "Skipped to keep today free. If you change your mind, Social Hour is Sun–Thu 5–7 PM at the bar, with $10 bites and cocktails.",
    place: "Beauty & Essex, The Cosmopolitan",
    address: "3708 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://taogroup.com/venues/beauty-essex-las-vegas/social-hour/",
    urlLabel: "Social hour & menu",
    photo: "beauty",
    lat: 36.1094,
    lng: -115.1741,
    est: 0,
    category: "restaurants",
    method: "cash",
    stamp: "beauty",
    assumed: "Set to $0 because we're skipping it today. If you go, enter the real total as Actual (about $55–65 for two).",
    leg: {
      mode: "walk",
      distance: "0.1 mi",
      time: "~3 min",
      how: "Inside the Cosmopolitan — head up to the 3rd floor and look for the pawn shop entrance.",
    },
    confirm: [c("beauty-hours", "Beauty & Essex Social Hour: posted as Sun–Thu 5–7 PM at the bar (verified on the venue site Nov 6).")],
  },
  {
    id: "tue-home",
    day: 1,
    time: "6:30 PM",
    start: 18 * 60 + 30,
    title: "Free trip back to The Signature",
    kind: "ride",
    blurb: "Free tram + a stroll home. If your feet say no, a rideshare is the backup.",
    place: "The Signature at MGM Grand",
    address: "145 E Harmon Ave, Las Vegas, NV 89109",
    lat: 36.1034,
    lng: -115.1641,
    est: 0,
    category: "backup",
    method: "card",
    leg: {
      mode: "transit",
      distance: "~2 mi",
      time: "30–40 min",
      how: "Free tram Bellagio → Park MGM, then walk through MGM Grand (~20 min). You can pick up water or snacks at a drugstore near Park MGM on the way. Rideshare = backup fund; log it as Actual.",
    },
  },

  /* -------------------------- Wednesday 11/11 ---------------------- */
  {
    id: "wed-monorail",
    day: 2,
    time: "11:30 AM",
    start: 11 * 60 + 30,
    title: "Free tram to Bellagio",
    kind: "ride",
    blurb: "A free start to the anniversary: walk to Park MGM, ride the free tram to Bellagio, then walk north along the Strip. No monorail needed on the way out.",
    place: "Park MGM tram station",
    address: "3770 S Las Vegas Blvd, Las Vegas, NV 89109",
    photo: "bellagio",
    lat: 36.1033,
    lng: -115.1757,
    est: 0,
    category: null,
    method: "cash",
    leg: {
      mode: "transit",
      distance: "~2 mi",
      time: "35–45 min",
      how: "Walk through MGM Grand → New York-New York → Park MGM, then ride the free tram to Bellagio (about 10 min).",
    },
    confirm: [c("tram", "Free Park MGM ↔ Aria ↔ Bellagio tram: confirm it's running that day.")],
  },
  {
    id: "wed-flamingo",
    day: 2,
    time: "12:30 PM",
    start: 12 * 60 + 30,
    title: "Flamingo Wildlife Habitat",
    kind: "sight",
    blurb: "Pink flamingos, koi, turtles and ducks in a lush garden hidden behind the Flamingo. Free!",
    place: "Flamingo Las Vegas Wildlife Habitat",
    address: "3555 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.google.com/maps/search/?api=1&query=Flamingo+Wildlife+Habitat+Las+Vegas",
    urlLabel: "Habitat in Maps",
    photo: "flamingo",
    lat: 36.1161,
    lng: -115.1707,
    est: 0,
    category: null,
    method: "cash",
    stamp: "flamingo",
    leg: {
      mode: "walk",
      distance: "0.5 mi",
      time: "~12 min",
      how: "Walk north from the Bellagio along the Strip, past Caesars Palace, to the Flamingo and its wildlife habitat by the pool area. All free.",
    },
    confirm: [c("flamingo-hours", "Wildlife Habitat hours and flamingo feeding times — confirm once you're there (signage) or ask Flamingo guest services.")],
    tips: [
      "The habitat is an outdoor garden behind the hotel, near the pool area — it's free and you don't have to gamble. Follow the signs to the Wildlife Habitat once you're inside.",
    ],
  },
  {
    id: "wed-canal",
    day: 2,
    time: "2:15 PM",
    start: 14 * 60 + 15,
    title: "Venetian Grand Canal",
    kind: "sight",
    blurb: "Painted skies, singing gondoliers and canal-side wandering — Venice, but make it Vegas.",
    place: "The Grand Canal Shoppes at The Venetian",
    address: "3377 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.grandcanalshoppes.com/en/visit/",
    urlLabel: "Visit the Grand Canal",
    photo: "venetian",
    lat: 36.1211,
    lng: -115.1698,
    est: 0,
    category: null,
    method: "cash",
    stamp: "canal",
    leg: {
      mode: "walk",
      distance: "0.8 mi",
      time: "~16 min",
      how: "Walk north from the Flamingo through the LINQ Promenade (free) to The Venetian.",
    },
  },
  {
    id: "wed-palazzo",
    day: 2,
    time: "3:30 – 4:30 PM",
    start: 15 * 60 + 30,
    title: "Palazzo Waterfall Atrium",
    kind: "free",
    blurb: "A bright, leafy indoor garden with a glass-roofed waterfall and seasonal flower displays. A calm, pretty breather — no shopping required.",
    place: "The Palazzo Waterfall Atrium",
    address: "3325 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.venetianlasvegas.com/",
    urlLabel: "Venetian site",
    photo: "venetian",
    lat: 36.1236,
    lng: -115.1695,
    est: 0,
    category: null,
    method: "cash",
    stamp: "palazzo",
    leg: {
      mode: "walk",
      distance: "0.2 mi",
      time: "~5 min",
      how: "From the Grand Canal Shoppes, follow the signs through the Venetian into the Palazzo and look for the Waterfall Atrium.",
    },
    confirm: [c("atrium", "Palazzo Waterfall Atrium: confirm it's open and free to walk through (and where the entrance is).")],
    tips: ["Free to wander. Seasonal displays change, so bring the camera."],
  },
  {
    id: "wed-wynn-gardens",
    day: 2,
    time: "4:45 – 5:45 PM",
    start: 16 * 60 + 45,
    title: "Wynn & Encore gardens wander",
    kind: "free",
    blurb: "Strolling through the Wynn and Encore's floral displays and gardens on the way to the lake — and sunset is around 4:37 PM.",
    place: "Wynn Las Vegas and Encore",
    address: "3131 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.wynnlasvegas.com/",
    urlLabel: "Wynn site",
    photo: "wynn",
    lat: 36.127,
    lng: -115.1652,
    est: 0,
    category: null,
    method: "cash",
    stamp: "wynngardens",
    leg: {
      mode: "walk",
      distance: "0.5 mi",
      time: "~12 min",
      how: "Walk north from the Palazzo along the Strip (or through the casinos) to the Wynn, then look for the floral displays and gardens.",
    },
    confirm: [c("wynn-gardens", "Wynn/Encore garden and floral display locations and what's on this week (ask at the Wynn guest services desk).")],
    tips: ["Free to look around. Enjoy the cool evening light before Lake of Dreams at 6."],
  },
  {
    id: "wed-lake",
    day: 2,
    time: "6:00 – 7:30 PM",
    start: 18 * 60,
    title: "Wynn Lake of Dreams",
    kind: "show",
    blurb: "A glowing lake, a giant sculpted mountain and a dreamy sunset-to-evening show. Free.",
    place: "Wynn Las Vegas – Lake of Dreams",
    address: "3131 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.wynnlasvegas.com/entertainment/lake-of-dreams",
    urlLabel: "Lake of Dreams",
    photo: "wynn",
    lat: 36.1266,
    lng: -115.1659,
    est: 0,
    category: null,
    method: "cash",
    stamp: "lake",
    leg: {
      mode: "walk",
      distance: "0.1 mi",
      time: "~3 min",
      how: "From the Wynn gardens, head to the lake-side area outside the Wynn to find a good spot before the show.",
    },
    confirm: [c("lake-times", "Lake of Dreams show times for Wednesday — check the Wynn page.")],
    tips: [
      "Free to the general public — you do not need to be a Wynn guest.",
      "Watch from the free viewing area, or sit down with a drink or meal at Bar Parasol, Overlook Lounge, or SW Steakhouse's lake-level patio (those cost money; the free spot is fine).",
    ],
  },
  {
    id: "wed-tao",
    day: 2,
    time: "8:30 – 10:00 PM",
    start: 20 * 60 + 30,
    title: "TAO Social Hour — anniversary dinner",
    kind: "drink",
    blurb: "Our anniversary dinner: pan-Asian plates, candlelight, and a toast to three years.",
    place: "TAO Asian Bistro, The Venetian",
    address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://taogroup.com/venues/tao-asian-bistro-las-vegas/social-hour/",
    urlLabel: "Social hour & menu",
    photo: "tao",
    lat: 36.1218,
    lng: -115.1706,
    est: 80,
    category: "restaurants",
    method: "cash",
    stamp: "anniversary",
    leg: {
      mode: "walk",
      distance: "0.6 mi",
      time: "~13 min",
      how: "Walk back south from the Wynn to The Venetian; TAO is on the casino level.",
    },
    confirm: [
      c("tao-hours", "TAO Social Hour: posted as Sun–Wed 8:30–10 PM at the bar & lounge (verified on the venue site Nov 6). TAO also lists a Veterans Day event on 11/11 — check it doesn’t change Social Hour."),
    ],
  },
  {
    id: "wed-return",
    day: 2,
    time: "10:00 PM",
    start: 22 * 60,
    title: "Monorail home (one way)",
    kind: "ride",
    blurb: "Ride the monorail back to MGM Grand. We walked and rode the free tram out, so you only pay one way — about half the $23 round trip.",
    place: "Las Vegas Monorail – Harrah's/The LINQ Station",
    address: "3535 S Las Vegas Blvd (The LINQ Promenade), Las Vegas, NV 89109",
    url: "https://www.lvmonorail.com/",
    urlLabel: "Monorail site",
    lat: 36.1178,
    lng: -115.1668,
    est: 12,
    category: "monorail",
    method: "cash",
    stamp: "monorail",
    leg: {
      mode: "transit",
      distance: "~0.7 mi + ride",
      time: "35–45 min",
      how: "Walk to Harrah's/The LINQ station (~12 min), ride to MGM Grand (~10 min), then walk to Tower A (~10 min). Backup: rideshare.",
    },
    confirm: [c("monorail-hours", "Last monorail of the night.")],
  },

  /* -------------------------- Thursday 11/12 ----------------------- */
  {
    id: "thu-pool",
    day: 3,
    time: "Morning",
    start: 10 * 60,
    title: "Pool & relaxation",
    kind: "pool",
    blurb: "A lazy anniversary-week morning: pool, coffee, and absolutely nowhere to be.",
    place: "The Signature at MGM Grand",
    address: "145 E Harmon Ave, Las Vegas, NV 89109",
    photo: "pool",
    lat: 36.1034,
    lng: -115.1641,
    est: 0,
    category: null,
    method: "card",
    confirm: [c("pool-open", "Pool open status — see Tuesday.")],
  },
  {
    id: "thu-deuce",
    day: 3,
    time: "3:00 PM",
    start: 15 * 60,
    title: "Deuce bus to Fremont",
    kind: "ride",
    blurb: "Hop on the double-decker Deuce up the Strip to Downtown. Two 24-hour passes cover the return too.",
    place: "Deuce bus stop, Las Vegas Blvd at MGM Grand",
    address: "Las Vegas Blvd S near MGM Grand, Las Vegas, NV 89109",
    url: "https://www.rtcsnv.com/ways-to-travel/fares-passes/",
    urlLabel: "RTC fares & passes",
    photo: "deuce",
    lat: 36.1039,
    lng: -115.1722,
    est: 16,
    category: "deuce",
    method: "cash",
    stamp: "deuce",
    leg: {
      mode: "transit",
      distance: "~8 mi",
      time: "50–65 min",
      how: "Walk to a northbound Deuce stop on Las Vegas Blvd by MGM Grand (~10 min). Buy the 24-hour passes on the rideRTC app or at a stop's ticket machine. Ride to Fremont Street.",
    },
    confirm: [
      c("deuce-stop", "Exact northbound Deuce stop near MGM Grand and where to buy passes (rideRTC app vs ticket machine)."),
    ],
    tips: ["Check Google Maps → Transit for live arrival times."],
  },
  {
    id: "thu-lethai",
    day: 3,
    time: "4:00 – 5:15 PM",
    start: 16 * 60,
    title: "Le Thai Happy Hour",
    kind: "drink",
    blurb: "Bold, beautiful Thai on Fremont East. Happy-hour bites and cocktails.",
    place: "Le Thai",
    address: "523 Fremont St, Las Vegas, NV 89101",
    url: "https://lethaivegas.com/menu/",
    urlLabel: "Menu",
    photo: "fremont",
    lat: 36.1691,
    lng: -115.1389,
    est: 45,
    category: "restaurants",
    method: "cash",
    stamp: "lethai",
    leg: {
      mode: "walk",
      distance: "0.2 mi",
      time: "~4 min",
      how: "Get off the Deuce at Fremont Street/Las Vegas Blvd and walk east along Fremont East.",
    },
    confirm: [c("lethai-hours", "Le Thai Happy Hour: posted as Mon–Thu 4–6 PM, with prices on its menu page (verified Nov 6). Re-check the day before we go.")],
  },
  {
    id: "thu-park",
    day: 3,
    time: "5:45 – 6:45 PM",
    start: 17 * 60 + 45,
    title: "Optional: Park on Fremont (his beer stop)",
    kind: "drink",
    blurb: "A leafy patio and cozy bar right on Fremont East for a second happy hour.",
    place: "Park on Fremont",
    address: "506 Fremont St, Las Vegas, NV 89101",
    url: "https://www.parkonfremont.com/happy-hour",
    urlLabel: "Happy hour",
    photo: "fremont",
    lat: 36.1693,
    lng: -115.1393,
    est: 0,
    assumed: "Set to $0 so the day stays tight. If you go for a beer, enter the real total as Actual (about $12–25).",
    category: "restaurants",
    method: "cash",
    stamp: "parkfremont",
    leg: {
      mode: "walk",
      distance: "0.1 mi",
      time: "~2 min",
      how: "A quick stroll along Fremont East from Le Thai.",
    },
    confirm: [c("park-hours", "Park on Fremont: happy hour is posted as Wed–Fri 5–7 PM, but its site metadata lists Wed/Thu opening at 6 PM, and happy-hour prices aren’t published. Call (725) 210-0306 to confirm the opening time and prices.")],
  },
  {
    id: "thu-fse",
    day: 3,
    time: "7:00 – 9:15 PM",
    start: 19 * 60,
    title: "Fremont Street Experience",
    kind: "show",
    blurb: "A canopy of lights, live music, zip-liners overhead and neon in every direction. Free fun.",
    place: "Fremont Street Experience",
    address: "425 Fremont St, Las Vegas, NV 89101",
    url: "https://fremontstreetexperience.com/",
    urlLabel: "Fremont Street Experience",
    photo: "fremont",
    lat: 36.1708,
    lng: -115.1431,
    est: 0,
    category: null,
    method: "cash",
    stamp: "fremont",
    leg: {
      mode: "walk",
      distance: "0.3 mi",
      time: "~7 min",
      how: "Walk west on Fremont toward Las Vegas Blvd and under the canopy.",
    },
    confirm: [c("fse-shows", "Canopy light-show schedule for the evening (check the FSE page).")],
  },
  {
    id: "thu-return",
    day: 3,
    time: "9:30 PM",
    start: 21 * 60 + 30,
    title: "Return by Deuce",
    kind: "ride",
    blurb: "Your 24-hour passes are already paid for. Ride the Deuce back down the Strip.",
    place: "Deuce bus stop, Fremont Street / Las Vegas Blvd",
    address: "Fremont St & Las Vegas Blvd, Las Vegas, NV 89101",
    url: "https://www.rtcsnv.com/ways-to-travel/fares-passes/",
    urlLabel: "RTC fares & passes",
    lat: 36.1699,
    lng: -115.1398,
    est: 0,
    category: "deuce",
    method: "cash",
    leg: {
      mode: "transit",
      distance: "~8 mi",
      time: "50–65 min",
      how: "Catch a southbound Deuce near Fremont/Las Vegas Blvd. Get off by MGM Grand and walk ~10 min to Tower A. Backup: rideshare.",
    },
  },

  /* -------------------------- Friday 11/13 ------------------------- */
  {
    id: "fri-taxi",
    day: 4,
    time: "4:00 AM",
    start: 4 * 60,
    title: "Airport taxi",
    kind: "ride",
    blurb: "Early-morning ride to LAS. About $35 — the second half of the $70 airport-taxi budget.",
    place: "Harry Reid International Airport",
    address: "5757 Wayne Newton Blvd, Las Vegas, NV 89119",
    url: "https://www.harryreidairport.com/",
    urlLabel: "Airport site",
    lat: 36.084,
    lng: -115.1537,
    est: 35,
    category: "airportTaxis",
    method: "cash",
    leg: {
      mode: "taxi",
      distance: "~4 mi",
      time: "10–20 min",
      how: "Ask the bell desk or find the taxi stand outside The Signature. Pack and check out the night before if you can.",
    },
    tips: ["Check the hotel folio — the $300 hold should be released after checkout (can take a few business days)."],
  },
  {
    id: "fri-flight",
    day: 4,
    time: "6:30 AM",
    start: 6 * 60 + 30,
    title: "Flight home",
    kind: "depart",
    blurb: "Safe travels, Mr. & Mrs. Adventurer. Vegas will keep the lights on for you.",
    place: "Harry Reid International Airport",
    address: "5757 Wayne Newton Blvd, Las Vegas, NV 89119",
    url: "https://www.harryreidairport.com/",
    urlLabel: "Airport site",
    photo: "lasairport",
    lat: 36.084,
    lng: -115.1537,
    est: 0,
    category: null,
    method: "card",
    stamp: "homeward",
  },
];

export const STOP_BY_ID: Record<string, Stop> = Object.fromEntries(STOPS.map((s) => [s.id, s]));

export function stopsForDay(day: number): Stop[] {
  return STOPS.filter((s) => s.day === day).sort((a, b) => a.start - b.start);
}

/** Every unique "still to confirm" item across the trip. */
export const CONFIRMATIONS: { id: string; text: string; stops: string[] }[] = (() => {
  const map = new Map<string, { id: string; text: string; stops: string[] }>();
  for (const s of STOPS) {
    for (const cf of s.confirm ?? []) {
      const prev = map.get(cf.id);
      if (prev) {
        prev.stops.push(s.id);
      } else {
        map.set(cf.id, { id: cf.id, text: cf.text, stops: [s.id] });
      }
    }
  }
  return [...map.values()];
})();

/* ------------------------------------------------------------------ */
/* Food & happy-hour guide                                             */
/* ------------------------------------------------------------------ */

export interface Eatery {
  id: string;
  stopId: string;
  name: string;
  cuisine: string;
  budget: number;
  slot: string;
  address: string;
  blurb: string;
  socialUrl: string;
  menuUrl: string;
  menuLabel: string;
  confirmId: string;
  /** What the venue's own site says (read Nov 6, 2026). */
  verified: string;
  caveat?: string;
  picks: string[];
  pickTotal: string;
  tip?: string;
}

export const EATERIES: Eatery[] = [
  {
    id: "hakkasan",
    stopId: "mon-hakkasan",
    name: "Hakkasan",
    cuisine: "Modern Cantonese · MGM Grand",
    budget: 65,
    slot: "Mon 11/9 · 6:00 – 7:00 PM",
    address: "3799 S Las Vegas Blvd, Las Vegas, NV 89109",
    blurb: "Glamorous lacquered dining room; the Social Hour is the budget-friendly way in.",
    socialUrl: "https://taogroup.com/venues/hakkasan-las-vegas/social-hour/",
    menuUrl: "https://taogroup.com/venues/hakkasan-las-vegas/menu/",
    menuLabel: "Social hour menu",
    confirmId: "hakkasan-hours",
    verified: "Social Hour: Mon–Wed, 5–7 PM, at the bar only. Bites, dim sum, two specialty cocktails and select wine/sake are all $10 each.",
    picks: ["Hakka Basket dim sum (king crab, shumai, truffle mushroom) $10", "Glazed Duroc Pork Belly Buns $10", "Drunken Wonton $10", "Salt & Pepper Calamari $10", "Chicken Pot Sticker $10"],
    pickTotal: "5 plates ≈ $50 + tax and a 20% tip ≈ $64. No alcohol: the money that would have gone to a cocktail goes to food",
    tip: "Water is free. Social Hour only discounts alcohol, so zero-proof drinks are full price ($16 cocktails, $12 juice blends). If your partner wants a cocktail, swap one plate for a $10 Hakkasan Mule or Hot Tropics.",

  },
  {
    id: "beauty",
    stopId: "tue-beauty",
    name: "Beauty & Essex",
    cuisine: "Eclectic small plates · The Cosmopolitan",
    budget: 70,
    slot: "Tue 11/10 · 5:00 – 6:30 PM",
    address: "3708 S Las Vegas Blvd (Cosmopolitan, 3rd floor), Las Vegas, NV 89109",
    blurb: "Hidden behind a pawn-shop front. Glittering, playful, very photogenic.",
    socialUrl: "https://taogroup.com/venues/beauty-essex-las-vegas/social-hour/",
    menuUrl: "https://taogroup.com/venues/beauty-essex-las-vegas/menu/",
    menuLabel: "Social hour menu",
    confirmId: "beauty-hours",
    verified: "Social Hour: Sun–Thu, 5–7 PM, at the bar. Light bites, two cocktails and select wine are $10 each.",
    picks: ["Grilled Cheese & Tomato Soup Dumplings $10 (their signature)", "“Chile Relleno” Empanadas $10", "Cauliflower Tacos $10", "Crispy Panko Vidalia Onion Rings $10", "BBQ Fries $10"],
    pickTotal: "5 plates ≈ $50 + tax and a 20% tip ≈ $64 (about $6 left of the $70)",
    tip: "For a treat, the spirit-free Garnet Gimlet (strawberry, lime, ginger ale) is $14 at full price — roughly $18 with tax and tip, which swaps in for one plate. Partner cocktail: Basil Gimlet or Hot Tropics, $10.",

  },
  {
    id: "tao",
    stopId: "wed-tao",
    name: "TAO Asian Bistro",
    cuisine: "Pan-Asian · The Venetian",
    budget: 80,
    slot: "Wed 11/11 · 8:30 – 10:00 PM",
    address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
    blurb: "Our anniversary dinner. Statues, candlelight and a sweet toast. Check that Social Hour pricing still applies at 8:30.",
    socialUrl: "https://taogroup.com/venues/tao-asian-bistro-las-vegas/social-hour/",
    menuUrl: "https://taogroup.com/venues/tao-asian-bistro-las-vegas/menu/",
    menuLabel: "Social hour menu",
    confirmId: "tao-hours",
    verified: "Social Hour: Sun–Wed, 8:30–10 PM, at the bar and lounge. Bites, two cocktails and sake/wine are $10 each.",
    caveat: "TAO lists a Veterans Day event on its site (11/11 is Veterans Day). Check it doesn’t change Social Hour.",
    picks: ["Spicy Tuna Tartare on Crispy Rice $10", "Dumplings (gyoza, potsticker, veggie) $10", "Thai Chicken Wing Lollipops $10", "Banana Pudding to share $10", "Two $10 cocktails (Basil Gimlet or Hot Tropics), or one cocktail and one zero-proof $14"],
    pickTotal: "4 plates + 2 cocktails = $60 + tax and a 20% tip ≈ $77–80.",
    tip: "Social Hour only discounts alcohol, so a zero-proof drink is full price. Veterans Day (11/11) event: check it doesn't change Social Hour.",

  },
  {
    id: "lethai",
    stopId: "thu-lethai",
    name: "Le Thai",
    cuisine: "Northern Thai · Fremont East",
    budget: 45,
    slot: "Thu 11/12 · 4:00 – 5:15 PM",
    address: "523 Fremont St, Las Vegas, NV 89101",
    blurb: "Fiery, fragrant Thai on the Fremont East strip. Happy-hour plates first.",
    socialUrl: "https://lethaivegas.com/menu/",
    menuUrl: "https://lethaivegas.com/menu/",
    menuLabel: "Full menu",
    confirmId: "lethai-hours",
    verified: "Happy Hour: Mon–Thu, 4–6 PM. Appetizers $10–$12, beers $3–$5, cocktails $6–$7.",
    picks: ["Waterfall Beef $12", "Chicken Satay $10", "Spiked Thai Iced Tea $6 (hers)", "Singha or Chang beer $5 (his)"],
    pickTotal: "≈ $33 + tax and tip ≈ $42–45.",
    tip: "Happy hour is appetizers only. Add Thai Style Wings ($11) if you're still hungry — about $14 more with tax and tip.",

  },
  {
    id: "park",
    stopId: "thu-park",
    name: "Park on Fremont",
    cuisine: "Patio bar & bites · Fremont East",
    budget: 0,
    slot: "Thu 11/12 · 5:45 – 6:45 PM",
    address: "506 Fremont St, Las Vegas, NV 89101",
    blurb: "Leafy patio, cocktails and a relaxed second-stop happy hour.",
    socialUrl: "https://www.parkonfremont.com/happy-hour",
    menuUrl: "https://www.parkonfremont.com/menu",
    menuLabel: "Happy hour",
    confirmId: "park-hours",
    verified: "Happy Hour is posted as Wed–Fri, 5–7 PM, with discounted beers, food and well cocktails. Specific happy-hour prices aren’t published.",
    caveat: "The site lists the kitchen as Wed–Fri 5–10 PM, but its opening-hours metadata says Wed/Thu open at 6 PM. We moved this stop to 5:45 PM so it works either way.",
    picks: ["His beer: Park Blonde draft $10 (regular price)", "Share onion rings $10 (regular price) if you stay"],
    pickTotal: "Optional stop: about $12–25. Skipped in the tighter plan.",
    tip: "Happy hour is posted Wed–Fri 5–7 PM, so Thursday works. Ask for the happy-hour menu — beer is discounted. The opening time still needs a call.",

  },
];

/* ------------------------------------------------------------------ */
/* Packing list + groceries                                            */
/* ------------------------------------------------------------------ */

const pk = (group: string, label: string, i: number): PackItem => ({
  id: `p-${group.slice(0, 3).toLowerCase()}-${i}`,
  group,
  label,
  done: false,
});

export const DEFAULT_PACKING: PackItem[] = [
  ...["Photo IDs (21+ for Planet 13)", "Boarding passes / flight info", "Hotel confirmation", "Debit/credit card", "$400 cash in hand + $350 ATM withdrawal"].map((l, i) => pk("Documents & money", l, i)),
  ...["Comfy walking shoes (we'll walk A LOT)", "Light jacket or wrap for cool desert evenings", "Anniversary-dinner outfit", "Swimsuits + cover-up (pool day)", "Sunglasses", "Small crossbody / day bag"].map((l, i) => pk("Clothes", l, i)),
  ...["Phone chargers + portable battery", "Headphones", "Offline maps downloaded for Las Vegas", "Camera / photo-ready phone"].map((l, i) => pk("Tech", l, i)),
  ...["Sunscreen + lip balm", "Moisturizer (it's the desert)", "Medications & first-aid basics", "Blister bandages"].map((l, i) => pk("Care", l, i)),
  ...["Anniversary card", "Small anniversary surprise", "Reusable water bottle", "Mini sewing kit / stain pen"].map((l, i) => pk("Love & extras", l, i)),
];

export const DEFAULT_GROCERIES = [
  { name: "Bottled water", qty: 6 },
  { name: "Coffee & creamer", qty: 1 },
  { name: "Breakfast (yogurt / pastries)", qty: 2 },
  { name: "Fresh fruit", qty: 2 },
  { name: "Salty snacks", qty: 2 },
  { name: "Something sparkling (21+ ID)", qty: 1 },
];

/* ------------------------------------------------------------------ */
/* Passport stamps                                                     */
/* ------------------------------------------------------------------ */

export interface StampDef {
  id: string;
  name: string;
  icon: string;
  top: string;
}

export const STAMPS: StampDef[] = [
  { id: "touchdown", name: "Touchdown", icon: "plane", top: "LAS · ARRIVAL" },
  { id: "homebase", name: "Home Base", icon: "bed", top: "THE SIGNATURE" },
  { id: "bigapple", name: "Big Apple", icon: "skyline", top: "NEW YORK-NEW YORK" },
  { id: "planet13", name: "Planet 13", icon: "leaf", top: "PLANET 13" },
  { id: "hakkasan", name: "Hakkasan", icon: "cocktail", top: "HAKKASAN" },
  { id: "stocked", name: "Stocked Up", icon: "cart", top: "INSTACART" },
  { id: "splash", name: "Splash", icon: "wave", top: "POOL DAY" },
  { id: "conservatory", name: "Glass Ceiling", icon: "chandelier", top: "BELLAGIO LOBBY" },
  { id: "cosmo", name: "Cosmopolitan", icon: "chandelier", top: "THE COSMOPOLITAN" },
  { id: "beauty", name: "Beauty & Essex", icon: "cocktail", top: "BEAUTY & ESSEX" },
  { id: "fountains", name: "Bellagio", icon: "fountain", top: "BELLAGIO FOUNTAINS" },
  { id: "monorail", name: "Monorail", icon: "train", top: "LV MONORAIL" },
  { id: "flamingo", name: "Flamingo", icon: "flamingo", top: "WILDLIFE HABITAT" },
  { id: "canal", name: "Grand Canal", icon: "gondola", top: "VENETIAN" },
  { id: "palazzo", name: "Palazzo", icon: "tree", top: "PALAZZO ATRIUM" },
  { id: "wynngardens", name: "Wynn Gardens", icon: "gem", top: "WYNN & ENCORE" },
  { id: "lake", name: "Lake of Dreams", icon: "moon", top: "WYNN" },
  { id: "anniversary", name: "Three Years", icon: "heart", top: "ANNIVERSARY 11·11" },
  { id: "deuce", name: "Deuce", icon: "bus", top: "RTC DEUCE" },
  { id: "lethai", name: "Le Thai", icon: "bowl", top: "LE THAI" },
  { id: "parkfremont", name: "Park on Fremont", icon: "tree", top: "PARK ON FREMONT" },
  { id: "fremont", name: "Fremont Street", icon: "neon", top: "FREMONT STREET" },
  { id: "homeward", name: "Homeward", icon: "sun", top: "HOMEWARD BOUND" },
];

export const STAMP_BY_ID: Record<string, StampDef> = Object.fromEntries(STAMPS.map((s) => [s.id, s]));

/* ------------------------------------------------------------------ */
/* Typical November weather (fallback when the forecast isn't loaded)  */
/* ------------------------------------------------------------------ */

export const TYPICAL_WEATHER = { hi: 66, lo: 47, note: "Typical for mid-November" };
