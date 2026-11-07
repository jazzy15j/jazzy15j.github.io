import type { CategoryId, Confirm, PackItem, Settings, Stop } from "./types";

/* ------------------------------------------------------------------ */
/* Trip basics                                                         */
/* ------------------------------------------------------------------ */

export const HOTEL = {
  name: "Hilton Vacation Club Desert Retreat Las Vegas",
  address: "5165 S Decatur Blvd, Las Vegas, NV 89118",
  lat: 36.0935,
  lng: -115.2073,
};

export const TRIP_TZ = "America/Los_Angeles";
/** Wheels down at LAS, 9:43 PM PST on Mon 12/14/2026 (UTC-8). */
export const TRIP_START_UTC = Date.UTC(2026, 11, 15, 5, 43, 0);
/** Flight home leaves 11:57 AM PST on Fri 12/18/2026. */
export const TRIP_END_UTC = Date.UTC(2026, 11, 18, 19, 57, 0);
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
    iso: "2026-12-14",
    short: "Mon 12/14",
    weekday: "Monday",
    label: "Dec 14",
    title: "Arrive & Settle In",
    tagline: "Thirty, and just getting started.",
    emoji: "🎄",
    loveNote: "Day one in the suite, stamped. Thirty looks incredible on you — and the lights haven’t even come on yet.",
  },
  {
    index: 1,
    iso: "2026-12-15",
    short: "Tue 12/15",
    weekday: "Tuesday",
    label: "Dec 15",
    title: "Bellagio Glow & Birthday Dinner",
    tagline: "Winter gardens, fountains and a fancy table.",
    emoji: "🎂",
    loveNote: "A birthday dinner by the dancing fountains. Thirty is going to be your best year yet.",
  },
  {
    index: 2,
    iso: "2026-12-16",
    short: "Wed 12/16",
    weekday: "Wednesday",
    label: "Dec 16",
    title: "Palazzo, Wynn & the Lake",
    tagline: "Snow-white trees and glowing water.",
    emoji: "✨",
    loveNote: "Every tree was pretty, but you were the sparkle. Happy 30th, birthday girl.",
  },
  {
    index: 3,
    iso: "2026-12-17",
    short: "Thu 12/17",
    weekday: "Thursday",
    label: "Dec 17",
    title: "Fremont Lights",
    tagline: "Old Vegas neon under a canopy of lights.",
    emoji: "🎰",
    loveNote: "Neon, good food and my favorite person. Thirty is looking very bright.",
  },
  {
    index: 4,
    iso: "2026-12-18",
    short: "Fri 12/18",
    weekday: "Friday",
    label: "Dec 18",
    title: "Homeward Bound",
    tagline: "A full heart and a full passport.",
    emoji: "🌅",
    loveNote: "Home with a passport full of stamps and a heart full of lights. Thirty starts here.",
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
  color: string;
  protected?: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: "birthday", label: "Birthday dinner", short: "Birthday", emoji: "🎂", color: "#b3202f" },
  { id: "dining", label: "Happy hours & casual dining", short: "Dining", emoji: "🍜", color: "#8a5a1f" },
  { id: "rides", label: "Rideshare to the Strip & Fremont", short: "Rides", emoji: "🚖", color: "#2f6b52" },
  { id: "airport", label: "Airport rides", short: "Airport", emoji: "✈️", color: "#3b4f6b" },
  { id: "groceries", label: "Groceries for the suite", short: "Groceries", emoji: "🛒", color: "#6b7b4a" },
  { id: "fun", label: "Fun extras & souvenirs", short: "Fun", emoji: "🎁", color: "#a2566a" },
  { id: "cushion", label: "Protected cushion", short: "Cushion", emoji: "🛟", color: "#d4a94f", protected: true },
];

export const CAT: Record<CategoryId, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryInfo>;

export const DEFAULT_SETTINGS: Settings = {
  limit: 800,
  alloc: {
    birthday: 130,
    dining: 190,
    rides: 150,
    airport: 50,
    groceries: 60,
    fun: 120,
    cushion: 100,
  },
  cashInHand: 400,
  atmPlanned: 0,
  atmDone: false,
  deposit: {
    amount: 0,
    method: "card",
    status: "pending",
    note: "Resort incidentals hold, if they place one at check-in.",
  },
};

/** Hotel already paid through Booking.com — shown separately, never counted in the budget. */
export const HOTEL_PREPAID = 364.9;

const c = (id: string, text: string): Confirm => ({ id, text });

/* ------------------------------------------------------------------ */
/* Itinerary                                                           */
/* ------------------------------------------------------------------ */

const HOTEL_PLACE = "Hilton Vacation Club Desert Retreat Las Vegas";

export const STOPS: Stop[] = [
  /* -------------------------- Monday 12/14 -------------------------- */
  {
    id: "mon-land",
    day: 0,
    time: "9:43 PM",
    start: 21 * 60 + 43,
    title: "Touchdown at LAS",
    kind: "arrive",
    blurb:
      "Flight 40 leaves Grand Island (GRI) at 8:58 PM Central and lands at 9:43 PM Pacific. Wheels down for the 30th-birthday trip — the lights will wait for tomorrow.",
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
    tips: [
      "Eat before you fly or grab something at the airport — everything else is closed by the time you reach the suite.",
      "Flight check-in opens 8:58 PM Sunday 12/13.",
    ],
  },
  {
    id: "mon-ride",
    day: 0,
    time: "10:15 PM",
    start: 22 * 60 + 15,
    title: "Rideshare to the resort",
    kind: "ride",
    blurb: "A late-night ride to the suite, about 15–25 minutes depending on bags and the pickup line.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 25,
    category: "airport",
    method: "card",
    assumed: "Assumed ~$25 for a rideshare or taxi. Edit once you see the real fare.",
    leg: {
      mode: "taxi",
      distance: "~6 mi",
      time: "15–25 min",
      how: "Use the rideshare pickup area at LAS, or a taxi from the stand outside baggage claim.",
    },
  },
  {
    id: "mon-checkin",
    day: 0,
    time: "10:30 PM",
    start: 22 * 60 + 30,
    title: "Late check-in at the resort",
    kind: "hotel",
    blurb:
      "Our home base: a one-bedroom king suite with a sofa bed, full kitchen, washer and dryer, balcony and living area. The booking is under Jasmine Stock, 2 adults. Straight to bed after a long travel day.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    url: "https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/desert-paradise-resort",
    urlLabel: "Resort site",
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    stamp: "homebase",
    tips: [
      "Booked Dec 14–18 through Booking.com ($364.90, already paid). Normal check-in is from 4:00 PM, checkout by 10:00 AM.",
      "The resort has no restaurant, so groceries get delivered Tuesday morning.",
      "Resort phone (listed on its official page): 702-579-3600.",
    ],
    confirm: [
      c(
        "late-checkin",
        "You arrive about 10:30 PM. Call the resort (702-579-3600) to confirm the front desk is staffed that late and how late-arrival check-in works.",
      ),
      c("incidentals", "Does the resort place an incidentals/security hold at check-in? Log it in Budget → Hotel & holds."),
    ],
  },

  /* -------------------------- Tuesday 12/15 ------------------------- */
  {
    id: "tue-groceries",
    day: 1,
    time: "9:30 AM",
    start: 9 * 60 + 30,
    title: "Grocery delivery to the suite",
    kind: "grocery",
    blurb: "Breakfast, snacks and drinks delivered so the kitchen works for us all week. Order it Monday while you travel so the delivery window is ready. Paid by card.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    url: "https://www.instacart.com/",
    urlLabel: "Instacart",
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 60,
    category: "groceries",
    method: "card",
    stamp: "stocked",
    tips: ["Track what arrives in Tools → Grocery inventory."],
  },
  {
    id: "tue-cozy",
    day: 1,
    time: "10:30 AM",
    start: 10 * 60 + 30,
    title: "Cozy first morning in the suite",
    kind: "free",
    blurb: "Sleep in after the late flight, cook breakfast in your own kitchen and enjoy the balcony before the lights.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    stamp: "cozy",
  },
  {
    id: "tue-ride",
    day: 1,
    time: "3:00 PM",
    start: 15 * 60,
    title: "Rideshare to the Strip",
    kind: "ride",
    blurb: "Head to the Bellagio, about 20–25 minutes depending on traffic.",
    place: "Bellagio Conservatory & Botanical Gardens",
    address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
    lat: 36.1129,
    lng: -115.1768,
    est: 20,
    category: "rides",
    method: "card",
    assumed: "Assumed ~$20 each way. Check your app for real prices.",
    leg: {
      mode: "taxi",
      distance: "~5 mi",
      time: "20–25 min",
      how: "Ask the driver to drop you at the Bellagio Conservatory entrance on the Strip.",
    },
  },
  {
    id: "tue-conservatory",
    day: 1,
    time: "3:30 – 4:30 PM",
    start: 15 * 60 + 30,
    title: "Bellagio Conservatory holiday display",
    kind: "free",
    blurb:
      "The one we couldn’t see in November: towering seasonal gardens dressed for Christmas. Free to walk through, and the main reason for this trip.",
    place: "Bellagio Conservatory & Botanical Gardens",
    address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://bellagio.mgmresorts.com/",
    urlLabel: "Bellagio site",
    photo: "conservatory",
    lat: 36.1129,
    lng: -115.1768,
    est: 0,
    category: null,
    method: "cash",
    stamp: "conservatory",
    confirm: [
      c(
        "conservatory",
        "Holiday display dates/hours. Travel sites report it opens Nov 14 and runs to about Jan 2, open all day and free — confirm on Bellagio’s site.",
      ),
    ],
    tips: [
      "It’s closed Nov 8–13 between displays (reported), so Dec 15 should be in the middle of the holiday run.",
      "Go while it’s still light for photos, then see how different it looks after dark.",
    ],
  },
  {
    id: "tue-cosmo",
    day: 1,
    time: "4:30 – 5:30 PM",
    start: 16 * 60 + 30,
    title: "The Cosmopolitan sparkle",
    kind: "free",
    blurb: "A free look-around at the three-story Chandelier lounge and holiday touches. Nothing to buy — skip anything that isn’t fun.",
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
      how: "Walk north along the Strip from the Bellagio to the Cosmopolitan.",
    },
    tips: ["Walking in costs nothing. The ice rink and bars are optional and cost money."],
  },
  {
    id: "tue-dinner",
    day: 1,
    time: "5:45 – 7:15 PM",
    start: 17 * 60 + 45,
    title: "Birthday dinner at Mon Ami Gabi",
    kind: "food",
    blurb:
      "A French bistro at Paris Las Vegas whose patio faces the Bellagio fountains. Our one nicer meal for the 30th birthday — candlelight, a view and dessert.",
    place: "Mon Ami Gabi, Paris Las Vegas",
    address: "3655 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.opentable.com/mon-ami-gabi-las-vegas",
    urlLabel: "Menu & reservations",
    photo: "paris",
    lat: 36.1128,
    lng: -115.171,
    est: 120,
    category: "birthday",
    method: "card",
    stamp: "birthday",
    assumed: "Planning figure for two with tax and tip (one shared starter, two entrées, one dessert). Check the menu prices.",
    leg: {
      mode: "walk",
      distance: "0.4 mi",
      time: "~10 min",
      how: "Walk south along the Strip from the Cosmopolitan, cross to Paris and find Mon Ami Gabi on the Strip-facing side.",
    },
    confirm: [
      c("gabi-res", "Reserve a patio table (OpenTable) around sunset, and ask whether the patio has heaters — December evenings are chilly."),
    ],
    tips: ["Mention it’s a 30th birthday when you book."],
  },
  {
    id: "tue-fountains",
    day: 1,
    time: "7:30 PM",
    start: 19 * 60 + 30,
    title: "Fountains of Bellagio",
    kind: "show",
    blurb: "Water, music and light dancing across the lake — dessert for the eyes after dinner. Free.",
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
      distance: "0.1 mi",
      time: "~3 min",
      how: "The lake is right across the Strip from Paris — walk to the rail and find a spot.",
    },
    confirm: [c("fountain-times", "Fountain show times and any holiday-themed shows (reported every 15–30 min in the evening).")],
  },
  {
    id: "tue-home",
    day: 1,
    time: "8:15 PM",
    start: 20 * 60 + 15,
    title: "Rideshare back to the suite",
    kind: "ride",
    blurb: "Warm car, full heart, back to the kitchen suite.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 20,
    category: "rides",
    method: "card",
    leg: {
      mode: "taxi",
      distance: "~5 mi",
      time: "20–25 min",
      how: "Request your ride from the Bellagio/Paris area. Surge pricing can hit after shows, so wait a few minutes if it spikes.",
    },
  },

  /* -------------------------- Wednesday 12/16 ----------------------- */
  {
    id: "wed-morning",
    day: 2,
    time: "10:00 AM",
    start: 10 * 60,
    title: "Slow morning & the heated pool",
    kind: "pool",
    blurb: "Breakfast in the suite, coffee on the balcony and a dip in the resort’s heated pool and hot tub if it feels nice.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    url: "https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/desert-paradise-resort",
    urlLabel: "Resort site",
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    stamp: "splash",
    confirm: [c("pool-open", "Pool and hot tub hours (the resort lists an outdoor heated pool and hot tub) — confirm they’re open in December.")],
  },
  {
    id: "wed-ride",
    day: 2,
    time: "3:30 PM",
    start: 15 * 60 + 30,
    title: "Rideshare to the Venetian",
    kind: "ride",
    blurb: "About 25 minutes to the north end of the Strip, where the Palazzo, Venetian and Wynn are all within walking distance.",
    place: "The Palazzo Waterfall Atrium",
    address: "3325 S Las Vegas Blvd, Las Vegas, NV 89109",
    lat: 36.1236,
    lng: -115.1695,
    est: 22,
    category: "rides",
    method: "card",
    assumed: "Assumed ~$22. Check your app.",
    leg: {
      mode: "taxi",
      distance: "~7 mi",
      time: "20–30 min",
      how: "Ask to be dropped at the Palazzo entrance on the Strip.",
    },
  },
  {
    id: "wed-palazzo",
    day: 2,
    time: "4:00 – 5:00 PM",
    start: 16 * 60,
    title: "Palazzo Waterfall Atrium",
    kind: "free",
    blurb: "A bright indoor garden with a waterfall, seasonal trees and poinsettias. Free, pretty and a perfect warm-up to the evening.",
    place: "The Palazzo Waterfall Atrium",
    address: "3325 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.venetianlasvegas.com/",
    urlLabel: "Venetian site",
    photo: "palazzo",
    lat: 36.1236,
    lng: -115.1695,
    est: 0,
    category: null,
    method: "cash",
    stamp: "palazzo",
    confirm: [c("atrium", "Palazzo Waterfall Atrium: open and free to walk through, and what the holiday display looks like this year.")],
    tips: ["Listings from past seasons describe snow-covered trees and poinsettias — this year’s display may differ."],
  },
  {
    id: "wed-venetian",
    day: 2,
    time: "5:00 – 5:45 PM",
    start: 17 * 60,
    title: "Venetian holiday decor & Grand Canal",
    kind: "sight",
    blurb: "Painted skies, canal-side lights and holiday decorations inside the Venetian — an easy, free stroll.",
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
      distance: "0.2 mi",
      time: "~5 min",
      how: "Follow the signs from the Palazzo through the Venetian to the Grand Canal Shoppes.",
    },
  },
  {
    id: "wed-wynn",
    day: 2,
    time: "5:45 – 7:15 PM",
    start: 17 * 60 + 45,
    title: "Wynn holidays & Lake of Dreams",
    kind: "show",
    blurb: "Holiday decor inside the Wynn, then the glowing Lake of Dreams show. Free to the public, no need to be a guest.",
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
      distance: "0.6 mi",
      time: "~13 min",
      how: "Walk north from the Venetian along the Strip, or through the casinos if it’s cold.",
    },
    confirm: [
      c("lake-times", "Lake of Dreams show times for Dec 16 and what holiday decor is on display at the Wynn (past years had winter villages in the atrium)."),
    ],
    tips: [
      "The lake is free to watch. Bar Parasol, Overlook Lounge and SW Steakhouse’s patio offer seated views but cost money.",
      "Bring a warm layer — the lake is outdoors.",
    ],
  },
  {
    id: "wed-dinner",
    day: 2,
    time: "8:30 – 10:00 PM",
    start: 20 * 60 + 30,
    title: "TAO Social Hour",
    kind: "drink",
    blurb: "Pan-Asian bites at the bar and lounge in the Venetian. A cozy, affordable end to a long night of lights.",
    place: "TAO Asian Bistro, The Venetian",
    address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://taogroup.com/venues/tao-asian-bistro-las-vegas/social-hour/",
    urlLabel: "Social hour & menu",
    photo: "tao",
    lat: 36.1218,
    lng: -115.1706,
    est: 82,
    category: "dining",
    method: "card",
    stamp: "tao",
    leg: {
      mode: "walk",
      distance: "0.6 mi",
      time: "~13 min",
      how: "Walk back south from the Wynn to the Venetian; TAO is on the casino level.",
    },
    confirm: [c("tao-hours", "TAO Social Hour: posted as Sun–Wed 8:30–10 PM at the bar & lounge (read Nov 6). Re-check close to the trip.")],
    tips: ["Prefer somewhere new? Lavo at the Venetian was reported to have happy-hour pricing around $7 — unverified."],
  },
  {
    id: "wed-home",
    day: 2,
    time: "10:00 PM",
    start: 22 * 60,
    title: "Rideshare back to the suite",
    kind: "ride",
    blurb: "Home to the kitchen suite.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 22,
    category: "rides",
    method: "card",
    leg: {
      mode: "taxi",
      distance: "~7 mi",
      time: "20–30 min",
      how: "Request your ride from the Venetian’s rideshare pickup.",
    },
  },

  /* -------------------------- Thursday 12/17 ------------------------ */
  {
    id: "thu-morning",
    day: 3,
    time: "10:00 AM",
    start: 10 * 60,
    title: "Brunch at home & pool time",
    kind: "pool",
    blurb: "Cook breakfast, rest and save energy for a big night of neon.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
  },
  {
    id: "thu-ride",
    day: 3,
    time: "3:00 PM",
    start: 15 * 60,
    title: "Rideshare to Fremont",
    kind: "ride",
    blurb: "Downtown is farther than the Strip, about 25–35 minutes.",
    place: "Le Thai",
    address: "523 Fremont St, Las Vegas, NV 89101",
    lat: 36.1691,
    lng: -115.1389,
    est: 28,
    category: "rides",
    method: "card",
    assumed: "Assumed ~$28. Check your app.",
    leg: {
      mode: "taxi",
      distance: "~11 mi",
      time: "25–35 min",
      how: "Ask to be dropped on Fremont Street near Las Vegas Blvd.",
    },
  },
  {
    id: "thu-lethai",
    day: 3,
    time: "4:00 – 5:15 PM",
    start: 16 * 60,
    title: "Le Thai Happy Hour",
    kind: "drink",
    blurb: "Bold, beautiful Thai on Fremont East. Happy-hour appetizers and a Thai iced tea.",
    place: "Le Thai",
    address: "523 Fremont St, Las Vegas, NV 89101",
    url: "https://lethaivegas.com/menu/",
    urlLabel: "Menu",
    photo: "fremont",
    lat: 36.1691,
    lng: -115.1389,
    est: 45,
    category: "dining",
    method: "card",
    stamp: "lethai",
    confirm: [c("lethai-hours", "Le Thai Happy Hour: posted as Mon–Thu 4–6 PM (read Nov 6). Re-check close to the trip.")],
  },
  {
    id: "thu-park",
    day: 3,
    time: "5:45 – 6:45 PM",
    start: 17 * 60 + 45,
    title: "Park on Fremont Happy Hour",
    kind: "drink",
    blurb: "A leafy patio and a casual second stop on Fremont East. Share wings or onion rings.",
    place: "Park on Fremont",
    address: "506 Fremont St, Las Vegas, NV 89101",
    url: "https://www.parkonfremont.com/happy-hour",
    urlLabel: "Happy hour",
    photo: "fremont",
    lat: 36.1693,
    lng: -115.1393,
    est: 32,
    category: "dining",
    method: "card",
    stamp: "parkfremont",
    leg: {
      mode: "walk",
      distance: "0.1 mi",
      time: "~2 min",
      how: "A quick stroll along Fremont East from Le Thai.",
    },
    confirm: [
      c(
        "park-hours",
        "Park on Fremont: happy hour is posted as Wed–Fri 5–7 PM, but its site metadata lists Wed/Thu opening at 6 PM, and happy-hour prices aren’t published. Call (725) 210-0306.",
      ),
    ],
  },
  {
    id: "thu-fse",
    day: 3,
    time: "7:00 – 9:15 PM",
    start: 19 * 60,
    title: "Fremont Street Experience",
    kind: "show",
    blurb: "A canopy of lights, live music and neon in every direction, dressed up for the holidays. Free.",
    place: "Fremont Street Experience",
    address: "425 Fremont St, Las Vegas, NV 89101",
    url: "https://vegasexperience.com/",
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
    confirm: [
      c("fse-shows", "Fremont canopy holiday shows and times for Dec 17 (shows reported to run on the hour from about 6 PM; holiday productions in December)."),
    ],
  },
  {
    id: "thu-home",
    day: 3,
    time: "9:30 PM",
    start: 21 * 60 + 30,
    title: "Rideshare back to the suite",
    kind: "ride",
    blurb: "Back to the resort after a night of neon.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 28,
    category: "rides",
    method: "card",
    leg: {
      mode: "taxi",
      distance: "~11 mi",
      time: "25–35 min",
      how: "Request your ride from Fremont Street.",
    },
  },

  /* -------------------------- Friday 12/18 -------------------------- */
  {
    id: "fri-checkout",
    day: 4,
    time: "8:30 AM",
    start: 8 * 60 + 30,
    title: "Pack up & check out",
    kind: "hotel",
    blurb: "Pack up the kitchen suite and leave early for the airport. Checkout is by 10:00 AM but your flight is at 11:57 AM.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    tips: [
      "Pack the night before (Thursday after Fremont) so the morning is easy.",
      "Check your card statement for any incidentals hold release.",
    ],
  },
  {
    id: "fri-ride",
    day: 4,
    time: "9:00 AM",
    start: 9 * 60,
    title: "Rideshare to the airport",
    kind: "ride",
    blurb: "Back to LAS in time for a relaxed arrival about 2½ hours before takeoff.",
    place: "Harry Reid International Airport",
    address: "5757 Wayne Newton Blvd, Las Vegas, NV 89119",
    lat: 36.084,
    lng: -115.1537,
    est: 25,
    category: "airport",
    method: "card",
    leg: {
      mode: "taxi",
      distance: "~6 mi",
      time: "15–25 min",
      how: "Request a rideshare to your airline’s terminal. Morning traffic and the drop-off line can add time.",
    },
  },
  {
    id: "fri-flight",
    day: 4,
    time: "11:57 AM",
    start: 11 * 60 + 57,
    title: "Flight home to Grand Island",
    kind: "depart",
    blurb: "Flight 95 leaves LAS at 11:57 AM Pacific and lands at Grand Island (GRI) at 4:21 PM Central. Safe travels, birthday girl. Vegas will keep the lights on.",
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
    tips: ["Flight check-in opens 11:57 AM Thursday 12/17 — a good reminder to check in from your phone."],
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
/* Food guide                                                          */
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
  verified: string;
  caveat?: string;
  picks: string[];
  pickTotal: string;
  tip?: string;
}

export const EATERIES: Eatery[] = [
  {
    id: "gabi",
    stopId: "tue-dinner",
    name: "Mon Ami Gabi",
    cuisine: "French bistro · Paris Las Vegas",
    budget: 120,
    slot: "Tue 12/15 · 5:45 – 7:15 PM",
    address: "3655 S Las Vegas Blvd, Las Vegas, NV 89109",
    blurb: "Our birthday dinner: a French bistro with a patio facing the Bellagio fountains.",
    socialUrl: "https://www.opentable.com/mon-ami-gabi-las-vegas",
    menuUrl: "https://www.opentable.com/mon-ami-gabi-las-vegas",
    menuLabel: "Menu & reservations",
    confirmId: "gabi-res",
    verified:
      "Not read from the restaurant’s own site. Third-party listings say the patio faces the Bellagio fountains, entrées land in a $31–$50-per-person band, and hours run about 7 AM–10 PM (later Fri–Sat).",
    caveat: "Happy-hour listings conflict (one says 3–5:30 PM weekdays, another 4–6:30 PM), so treat happy hour as unverified. We’re booking dinner, not happy hour.",
    picks: [
      "One shared starter (French onion soup is a classic)",
      "Two entrées — steak frites is the signature",
      "One dessert to share, with a candle",
      "Sparkling water or a mocktail instead of wine",
    ],
    pickTotal: "Planning figure ≈ $100–130 for two with tax and tip. Check real prices on the menu.",
    tip: "Reserve a patio table around sunset (about 4:30 PM) and ask about heaters. Fountains reportedly play every 15–30 minutes from 3 PM on weekdays.",
  },
  {
    id: "tao",
    stopId: "wed-dinner",
    name: "TAO Asian Bistro",
    cuisine: "Pan-Asian · The Venetian",
    budget: 82,
    slot: "Wed 12/16 · 8:30 – 10:00 PM",
    address: "3355 S Las Vegas Blvd, Las Vegas, NV 89109",
    blurb: "Social Hour bites at the bar and lounge — a cozy end to a night of lights.",
    socialUrl: "https://taogroup.com/venues/tao-asian-bistro-las-vegas/social-hour/",
    menuUrl: "https://taogroup.com/venues/tao-asian-bistro-las-vegas/menu/",
    menuLabel: "Menu",
    confirmId: "tao-hours",
    verified: "Social Hour: Sun–Wed, 8:30–10 PM, at the bar and lounge. Bites, two cocktails and sake/wine are $10 each. (Read from the venue’s site on Nov 6, 2026.)",
    picks: [
      "Spicy Tuna Tartare on Crispy Rice $10",
      "Dumplings (gyoza, potsticker, veggie) $10",
      "Thai Chicken Wing Lollipops $10",
      "Avocado Cucumber Roll $10",
      "Banana Pudding to share $10",
      "Zhen Bang zero-proof cocktail (raspberry, lime, agave, club soda) $14",
    ],
    pickTotal: "5 plates ≈ $50 + the $14 zero-proof ≈ $64 before tax and tip ≈ $82 total.",
    tip: "Social Hour only discounts alcohol, so zero-proof drinks are full price. Re-check the schedule close to the trip.",
  },
  {
    id: "lethai",
    stopId: "thu-lethai",
    name: "Le Thai",
    cuisine: "Northern Thai · Fremont East",
    budget: 45,
    slot: "Thu 12/17 · 4:00 – 5:15 PM",
    address: "523 Fremont St, Las Vegas, NV 89101",
    blurb: "Fiery, fragrant Thai on Fremont East. Happy-hour appetizers first.",
    socialUrl: "https://lethaivegas.com/menu/",
    menuUrl: "https://lethaivegas.com/menu/",
    menuLabel: "Full menu",
    confirmId: "lethai-hours",
    verified: "Happy Hour: Mon–Thu, 4–6 PM. Appetizers $10–$12, beers $3–$5, cocktails $6–$7. (Read from the venue’s site on Nov 6, 2026.)",
    picks: ["Waterfall Beef $12", "Chicken Satay $10", "Pork Jerky $10", "Thai Iced Tea $3"],
    pickTotal: "≈ $35 + tax and tip ≈ $45.",
    tip: "Happy hour is appetizers only. The famous Short Rib Fried Rice ($18) is on the regular menu.",
  },
  {
    id: "park",
    stopId: "thu-park",
    name: "Park on Fremont",
    cuisine: "Patio bar & bites · Fremont East",
    budget: 32,
    slot: "Thu 12/17 · 5:45 – 6:45 PM",
    address: "506 Fremont St, Las Vegas, NV 89101",
    blurb: "Leafy patio and a relaxed second-stop happy hour.",
    socialUrl: "https://www.parkonfremont.com/happy-hour",
    menuUrl: "https://www.parkonfremont.com/menu",
    menuLabel: "Menu",
    confirmId: "park-hours",
    verified: "Happy Hour is posted as Wed–Fri, 5–7 PM, with discounted beers, food and well cocktails. Specific happy-hour prices aren’t published. (Read Nov 6, 2026.)",
    caveat: "The site’s opening-hours metadata says Wed/Thu open at 6 PM, so we start at 5:45 PM and may wait a few minutes.",
    picks: ["Share 6 wings $12 (regular price)", "Onion Rings $10 (regular price)", "Soda $3"],
    pickTotal: "≈ $25 at regular prices + tax and tip ≈ $32.",
    tip: "Ask for the happy-hour menu when you sit down. Non-alcoholic choices include sodas, juice, iced tea and coffee.",
  },
];

/* ------------------------------------------------------------------ */
/* Packing + groceries                                                 */
/* ------------------------------------------------------------------ */

const pk = (group: string, label: string, i: number): PackItem => ({
  id: `p-${group.slice(0, 3).toLowerCase()}-${i}`,
  group,
  label,
  done: false,
});

export const DEFAULT_PACKING: PackItem[] = [
  ...["Photo IDs", "Boarding passes / flight info", "Booking.com confirmation (saved offline)", "Debit/credit card", "Cash for rides and tips"].map((l, i) => pk("Documents & money", l, i)),
  ...["Warm coat — Strip evenings can drop near freezing", "Layers (sweater, scarf, gloves)", "Comfy walking shoes", "Birthday-dinner outfit", "Swimsuits (heated pool & hot tub)", "Pajamas for the cozy suite nights"].map((l, i) => pk("Clothes", l, i)),
  ...["Phone chargers + portable battery", "Offline maps downloaded for Las Vegas", "Rideshare app set up with a card", "Camera or photo-ready phone"].map((l, i) => pk("Tech", l, i)),
  ...["Moisturizer and lip balm (dry air)", "Medications & first-aid basics", "Blister bandages"].map((l, i) => pk("Care", l, i)),
  ...["Birthday card or small surprise", "Reusable water bottle", "Holiday-movie watchlist for the suite"].map((l, i) => pk("Birthday & cozy extras", l, i)),
];

export const DEFAULT_GROCERIES = [
  { name: "Coffee & creamer", qty: 1 },
  { name: "Breakfast (eggs, bread, yogurt)", qty: 2 },
  { name: "Fresh fruit", qty: 2 },
  { name: "Bottled water & sparkling water", qty: 6 },
  { name: "Snacks & popcorn for movie nights", qty: 3 },
  { name: "Simple dinner for Monday", qty: 1 },
  { name: "Birthday treat (cupcakes or cake slice)", qty: 1 },
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
  { id: "homebase", name: "Home Base", icon: "bed", top: "THE SUITE" },
  { id: "stocked", name: "Stocked Up", icon: "cart", top: "FULL KITCHEN" },
  { id: "cozy", name: "Cozy Night", icon: "bowl", top: "COZY SUITE" },
  { id: "conservatory", name: "Winter Gardens", icon: "flower", top: "BELLAGIO GARDENS" },
  { id: "cosmo", name: "Cosmopolitan", icon: "chandelier", top: "THE COSMOPOLITAN" },
  { id: "birthday", name: "Thirty!", icon: "heart", top: "30TH BIRTHDAY" },
  { id: "fountains", name: "Fountains", icon: "fountain", top: "BELLAGIO FOUNTAINS" },
  { id: "splash", name: "Splash", icon: "wave", top: "HEATED POOL" },
  { id: "palazzo", name: "Palazzo", icon: "tree", top: "PALAZZO ATRIUM" },
  { id: "canal", name: "Grand Canal", icon: "gondola", top: "VENETIAN" },
  { id: "lake", name: "Lake of Dreams", icon: "moon", top: "WYNN" },
  { id: "tao", name: "TAO", icon: "cocktail", top: "TAO SOCIAL HOUR" },
  { id: "lethai", name: "Le Thai", icon: "bowl", top: "LE THAI" },
  { id: "parkfremont", name: "Park on Fremont", icon: "tree", top: "PARK ON FREMONT" },
  { id: "fremont", name: "Fremont Street", icon: "neon", top: "FREMONT STREET" },
  { id: "homeward", name: "Homeward", icon: "sun", top: "HOMEWARD BOUND" },
];

export const STAMP_BY_ID: Record<string, StampDef> = Object.fromEntries(STAMPS.map((s) => [s.id, s]));

/** Typical mid-December weather when the forecast isn't loaded. */
export const TYPICAL_WEATHER = { hi: 57, lo: 39, note: "Typical for mid-December" };
