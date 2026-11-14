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
    loveNote: "Day one in the suite, stamped. Thirty looks incredible on you, and the desert hasn’t even started yet.",
  },
  {
    index: 1,
    iso: "2026-12-15",
    short: "Tue 12/15",
    weekday: "Tuesday",
    label: "Dec 15",
    title: "Red Rock, Magic Mountains & Birthday Dinner",
    tagline: "Desert canyons by day, fountains by night.",
    emoji: "🏜️",
    loveNote: "Red rock, painted boulders and a birthday dinner by the fountains. Thirty is going to be your best year yet.",
  },
  {
    index: 2,
    iso: "2026-12-16",
    short: "Wed 12/16",
    weekday: "Wednesday",
    label: "Dec 16",
    title: "Valley of Fire",
    tagline: "Red sandstone, a long drive and a cozy night in.",
    emoji: "🔥",
    loveNote: "Every red wave in that valley was beautiful, but you were the sparkle. Happy 30th, birthday girl.",
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
    loveNote: "Home with a passport full of stamps and a camera full of red rock. Thirty starts here.",
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
  { id: "car", label: "Rental car, gas & park fees", short: "Car", emoji: "🚗", color: "#7a4a2a" },
  { id: "birthday", label: "Birthday dinner", short: "Birthday", emoji: "🎂", color: "#b3202f" },
  { id: "dining", label: "Happy hours & drinks", short: "Dining", emoji: "🍜", color: "#8a5a1f" },
  { id: "rides", label: "Rideshare to the Strip & Fremont", short: "Rides", emoji: "🚖", color: "#2f6b52" },
  { id: "airport", label: "Airport rides", short: "Airport", emoji: "✈️", color: "#3b4f6b" },
  { id: "groceries", label: "Groceries for the suite", short: "Groceries", emoji: "🛒", color: "#6b7b4a" },
  { id: "fun", label: "Fun extras & souvenirs", short: "Fun", emoji: "🎁", color: "#a2566a" },
  { id: "cushion", label: "Protected cushion", short: "Cushion", emoji: "🛟", color: "#d4a94f", protected: true },
];

export const CAT: Record<CategoryId, CategoryInfo> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryInfo>;

/**
 * $800 ceiling. Built from the November trip's real receipts: airport Uber $33, short Strip Uber about $19,
 * Tap supper $78, a drinks-and-bites outing $45–70, Instacart $43 plus a $24 CVS top-up.
 * November's $40 street donation and $40 of gambling are why the cushion is protected.
 */
export const DEFAULT_SETTINGS: Settings = {
  limit: 800,
  alloc: {
    car: 182,
    birthday: 80,
    dining: 100,
    rides: 93,
    airport: 68,
    groceries: 90,
    fun: 40,
    cushion: 147,
  },
  cashInHand: 400,
  atmPlanned: 0,
  atmDone: false,
  deposit: {
    amount: 0,
    method: "card",
    status: "pending",
    note: "Resort incidentals hold, if they place one at check-in. The rental car company may also place a hold on the card.",
  },
};

/** Hotel already paid through Booking.com — shown separately, never counted in the budget. */
export const HOTEL_PREPAID = 364.9;

const c = (id: string, text: string): Confirm => ({ id, text });

/* ------------------------------------------------------------------ */
/* Itinerary                                                           */
/* ------------------------------------------------------------------ */

const HOTEL_PLACE = "Hilton Vacation Club Desert Retreat Las Vegas";
const REDROCK_ADDR = "1000 Scenic Loop Dr, Las Vegas, NV 89161";

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
      "Flight 40 leaves Grand Island (GRI) at 8:58 PM Central and lands at 9:43 PM Pacific. Wheels down for the 30th-birthday trip — the desert will wait for tomorrow.",
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
      "The rental car isn’t picked up tonight. It only covers the two desert days (Tue and Wed).",
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
    est: 33,
    category: "airport",
    method: "card",
    assumed: "November’s airport-to-hotel Uber was $33.12. Edit once you see the real fare.",
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
      "The resort has no restaurant, so breakfast and packed lunches come from the groceries you pick up Tuesday.",
      "Resort phone (listed on its official page): 702-579-3600.",
    ],
    confirm: [
      c(
        "late-checkin",
        "You arrive about 10:30 PM. Call the resort (702-579-3600) to confirm the front desk is staffed that late and how late-arrival check-in works.",
      ),
      c("incidentals", "Does the resort place an incidentals/security hold at check-in? Log it in Budget → Hotel & holds."),
      c("resort-parking", "Is parking for a rental car at the resort free? The listing says free self parking — confirm before you rely on it."),
    ],
  },

  /* -------------------------- Tuesday 12/15 ------------------------- */
  {
    id: "tue-car",
    day: 1,
    time: "8:00 AM",
    start: 8 * 60,
    title: "Pick up the rental car",
    kind: "ride",
    blurb:
      "Car day one of two. Booking.com showed a rental from about $108.73 for 4 days, so two days should come in well under that. Book it ahead, take photos of the car before you leave, and ask what the final total is with taxes and fees.",
    place: "Rental car pickup near the resort (confirm)",
    address: HOTEL.address,
    url: "https://www.booking.com/cars/",
    urlLabel: "Booking.com cars",
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 110,
    category: "car",
    method: "card",
    assumed:
      "Planning figure for 2 days with taxes and fees. The only real price we have is Booking.com’s 4-day starting price of $108.73, so this is a safe ceiling. Edit it once you book.",
    confirm: [
      c("car-book", "Book the rental for Tue 8 AM to Wed evening. Compare the pickup spot near the resort against the airport, and check the final price with taxes and fees."),
      c("car-insurance", "Check whether your credit card or auto policy covers rentals before paying for the company’s insurance."),
      c("car-hold", "Ask if the company places a deposit hold on the card, and how big it is."),
    ],
    tips: [
      "If the pickup is off-site, a short rideshare to the counter may be needed. Log it as an extra.",
      "Fill the tank to full on Wednesday before you return it, so there’s no refuel fee.",
    ],
  },
  {
    id: "tue-groceries",
    day: 1,
    time: "8:45 AM",
    start: 8 * 60 + 45,
    title: "Grocery run for the suite",
    kind: "grocery",
    blurb:
      "With the car in hand, shop at a regular grocery store near the resort for the week: breakfasts, packed-lunch fixings, snacks, water and a few beers. Cheaper than delivery, whose fees added up in November.",
    place: "Grocery store near the resort (pick on Maps)",
    address: "Near " + HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 90,
    category: "groceries",
    method: "card",
    stamp: "stocked",
    assumed:
      "November’s Instacart order was $43 for the items that arrived plus a $24 CVS top-up. This plans about $90 for four days of breakfasts, packed lunches and snacks, and a few drinks.",
    tips: [
      "Buy sandwich bags and a small cooler bag if you don’t have one. Lunches travel in the car both days.",
      "Beer from the store costs far less than a bar. In November a Liquor World run was $46.",
      "Track what you bought in Tools → Grocery inventory.",
    ],
  },
  {
    id: "tue-redrock",
    day: 1,
    time: "10:00 AM – 12:30 PM",
    start: 10 * 60,
    title: "Red Rock Canyon scenic drive",
    kind: "sight",
    blurb:
      "A 13-mile one-way loop under the red sandstone cliffs, with short walks at the pullouts. About 30 minutes from the resort. A timed-entry reservation is required for the scenic drive.",
    place: "Red Rock Canyon National Conservation Area",
    address: REDROCK_ADDR,
    url: "https://www.recreation.gov/timed-entry/10075177",
    urlLabel: "Timed entry (Recreation.gov)",
    photo: "redrock",
    lat: 36.1355,
    lng: -115.427,
    est: 22,
    category: "car",
    method: "card",
    stamp: "redrock",
    assumed: "About $20 per vehicle plus about a $2 booking fee, from third-party sites. Confirm the price when you book.",
    leg: {
      mode: "car",
      distance: "~20 mi",
      time: "~30 min",
      how: "Drive from the resort to the Red Rock scenic drive entrance. Arrive within your one-hour entry window; you can arrive up to 30 minutes early.",
    },
    confirm: [
      c(
        "redrock-entry",
        "Book the Red Rock timed entry at recreation.gov/timed-entry/10075177 (required Oct 1–May 31 for entry 8 AM–5 PM). One reservation covers one car for a one-hour entry window; pick the earliest slot you can get.",
      ),
    ],
    tips: [
      "The scenic drive is open 6 AM–5 PM in winter (BLM). Download offline maps and keep the ticket saved; cell service in canyons can be spotty.",
      "Bring jackets. It is cold in the morning and warmer in the sun.",
      "Packed lunch at an overlook, then head back out.",
    ],
  },
  {
    id: "tue-7mm",
    day: 1,
    time: "1:30 – 2:30 PM",
    start: 13 * 60 + 30,
    title: "Seven Magic Mountains",
    kind: "free",
    blurb:
      "Seven towers of stacked, painted boulders in the desert south of town. Free admission and free parking, and a great photo stop. There are no restrooms, so plan ahead.",
    place: "Seven Magic Mountains",
    address: "Las Vegas Blvd S near Jean, NV (about 10 miles south of the 215)",
    url: "https://www.sevenmagicmountains.com/",
    urlLabel: "Seven Magic Mountains",
    lat: 35.8368,
    lng: -115.271,
    est: 0,
    category: null,
    method: "cash",
    stamp: "magic",
    leg: {
      mode: "car",
      distance: "~35 mi",
      time: "~50 min",
      how: "From Red Rock, take I-215 east, then I-15 south toward Jean. The art is a short drive off the highway; use your maps app.",
    },
    confirm: [c("magic-open", "Seven Magic Mountains: it’s free and unstaffed, but check for road work or closures the morning of the trip.")],
    tips: ["Go in the afternoon sun for the best colors.", "No restrooms or shade on site."],
  },
  {
    id: "tue-back",
    day: 1,
    time: "3:00 – 4:00 PM",
    start: 15 * 60,
    title: "Drive back & park at the resort",
    kind: "ride",
    blurb: "Back to the suite by about 4 PM. Park the car at the resort for the night. After this, everything on the Strip is by rideshare, so nobody has to drive after a drink.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    stamp: "wheels",
    leg: {
      mode: "car",
      distance: "~25 mi",
      time: "~35 min",
      how: "Back via I-15 north and the 215 west, or whatever your maps app suggests with live traffic.",
    },
    tips: ["Rest, shower and warm up. Sunset is about 4:40 PM, so the Strip lights are on when you head out."],
  },
  {
    id: "tue-ride",
    day: 1,
    time: "5:15 PM",
    start: 17 * 60 + 15,
    title: "Rideshare to the Strip",
    kind: "ride",
    blurb: "Head to the Bellagio, about 20–25 minutes depending on traffic.",
    place: "Bellagio Conservatory & Botanical Gardens",
    address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109",
    lat: 36.1129,
    lng: -115.1768,
    est: 19,
    category: "rides",
    method: "card",
    assumed: "November’s short Uber rides were $18.94 and $17.94. Check your app for the real price.",
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
    time: "5:45 – 6:30 PM",
    start: 17 * 60 + 45,
    title: "Bellagio Conservatory holiday display",
    kind: "free",
    blurb:
      "The one we couldn’t see in November: towering seasonal gardens dressed for Christmas, lit up after dark. Free to walk through, and the Strip lights are the main reason for the evening.",
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
      "Crowds peak after dark. Go in right away, then see the fountains.",
    ],
  },
  {
    id: "tue-fountains",
    day: 1,
    time: "6:30 PM",
    start: 18 * 60 + 30,
    title: "Fountains of Bellagio",
    kind: "show",
    blurb: "Water, music and light dancing across the lake. Free. The shows run every 15–30 minutes in the evening (reported), so there is no need to plan around a time.",
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
    confirm: [c("fountain-times", "Fountain show times and any holiday-themed shows (reported every 15–30 min in the evening).")],
  },
  {
    id: "tue-dinner",
    day: 1,
    time: "7:00 – 8:30 PM",
    start: 19 * 60,
    title: "Birthday dinner at Mon Ami Gabi",
    kind: "food",
    blurb:
      "A French bistro at Paris Las Vegas whose patio faces the Bellagio fountains. Our one nicer meal for the 30th birthday, planned at about the price of November’s last supper at Tap ($78).",
    place: "Mon Ami Gabi, Paris Las Vegas",
    address: "3655 S Las Vegas Blvd, Las Vegas, NV 89109",
    url: "https://www.opentable.com/mon-ami-gabi-las-vegas",
    urlLabel: "Menu & reservations",
    photo: "paris",
    lat: 36.1128,
    lng: -115.171,
    est: 80,
    category: "birthday",
    method: "card",
    stamp: "birthday",
    assumed:
      "$80 with tax and tip, matching Tap’s $78 from November. Third-party listings put entrées at $31–$50 per person, so two full entrées would run over. Plan to share a starter and an entrée plus a dessert, or confirm menu prices before booking.",
    leg: {
      mode: "walk",
      distance: "0.2 mi",
      time: "~5 min",
      how: "Cross the Strip from the Bellagio fountains to Paris and find Mon Ami Gabi on the Strip-facing side.",
    },
    confirm: [
      c("gabi-res", "Reserve a patio table (OpenTable) around 7 PM, and ask whether the patio has heaters — December evenings are chilly. Check the menu prices against the $80 plan."),
    ],
    tips: ["Mention it’s a 30th birthday when you book.", "If the menu prices run over, split dinner into shared plates, or pick a cheaper spot."],
  },
  {
    id: "tue-home",
    day: 1,
    time: "8:45 PM",
    start: 20 * 60 + 45,
    title: "Rideshare back to the suite",
    kind: "ride",
    blurb: "Warm car, full heart, back to the kitchen suite. Early start tomorrow.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 19,
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
    id: "wed-drive",
    day: 2,
    time: "8:00 AM",
    start: 8 * 60,
    title: "Drive to Valley of Fire",
    kind: "ride",
    blurb:
      "Car day two. Valley of Fire is about an hour and 10 minutes northeast of the resort. The park’s West Entrance is closed Monday through Thursday through the end of 2026, so use the East Entrance. Pack lunch, water and jackets.",
    place: "Valley of Fire State Park (East Entrance)",
    address: "Valley of Fire State Park, Overton, NV 89040",
    url: "https://parks.nv.gov/parks/valley-of-fire",
    urlLabel: "Park site",
    lat: 36.4297,
    lng: -114.5274,
    est: 0,
    category: null,
    method: "card",
    leg: {
      mode: "car",
      distance: "~60 mi",
      time: "~1 hr 10 min",
      how: "Take I-15 north, then State Route 169 or State Route 167 to the East Entrance. Your maps app will try to route you through the West Entrance; ignore it on Mon–Thu.",
    },
    confirm: [
      c("vof-open", "The park has an annual maintenance closure Dec 1–14 and reopens Dec 15. Call (775) 684-2770 the week before to confirm it’s open on Dec 16."),
      c("vof-west", "West Entrance is closed Mon–Thu through the end of 2026. Enter by the East Entrance (SR 169 or SR 167) on Wednesday."),
    ],
    tips: ["Leave by 8 so you have daylight to spare. Sunset is about 4:40 PM.", "Fill up on gas before leaving town."],
  },
  {
    id: "wed-valley",
    day: 2,
    time: "9:30 AM – 1:30 PM",
    start: 9 * 60 + 30,
    title: "Valley of Fire State Park",
    kind: "sight",
    blurb:
      "Nevada’s oldest state park: red and orange sandstone, the swirling Fire Wave and short, easy walks. Take photos, climb a little and eat the packed lunch with a view.",
    place: "Valley of Fire State Park",
    address: "Valley of Fire State Park, Overton, NV 89040",
    url: "https://parks.nv.gov/parks/valley-of-fire",
    urlLabel: "Park site",
    photo: "valleyfire",
    lat: 36.4297,
    lng: -114.5274,
    est: 15,
    category: "car",
    method: "card",
    stamp: "valley",
    assumed: "About $15 per car for non-Nevada residents was reported, but I couldn’t confirm it. Check the park site and edit.",
    confirm: [c("vof-fee", "Valley of Fire entrance fee and payment method (reported $15 per vehicle for non-residents). Confirm on the park site.")],
    tips: [
      "Start with the visitor center, then pick an easy hike (the Fire Wave is a popular short walk).",
      "Bring layers and lots of water. There is little shade.",
    ],
  },
  {
    id: "wed-gas",
    day: 2,
    time: "2:30 – 4:00 PM",
    start: 14 * 60 + 30,
    title: "Gas up & drive back",
    kind: "ride",
    blurb: "Head back before the light fades. Fill the tank before you return the car so there is no refuel fee.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 35,
    category: "car",
    method: "card",
    assumed: "Planning figure for gas across both days. Edit once you fill up.",
    leg: {
      mode: "car",
      distance: "~60 mi",
      time: "~1 hr 10 min",
      how: "Return the way you came and gas up in town.",
    },
  },
  {
    id: "wed-return",
    day: 2,
    time: "4:30 PM",
    start: 16 * 60 + 30,
    title: "Return the rental car",
    kind: "ride",
    blurb: "Drop the car back and take photos of it. No more driving after today. Everything left is rideshare or walking.",
    place: "Rental car return",
    address: HOTEL.address,
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    confirm: [c("car-return", "Return time and place, and confirm the return won’t be billed as a third day.")],
  },
  {
    id: "wed-night",
    day: 2,
    time: "6:00 PM",
    start: 18 * 60,
    title: "Cozy night in & hot tub",
    kind: "pool",
    blurb: "Cook dinner in the suite, soak in the heated hot tub if it feels nice and rest up. A quiet night after two big days.",
    place: HOTEL_PLACE,
    address: HOTEL.address,
    url: "https://www.hiltongrandvacations.com/en/resorts-and-destinations/las-vegas/desert-paradise-resort",
    urlLabel: "Resort site",
    lat: HOTEL.lat,
    lng: HOTEL.lng,
    est: 0,
    category: null,
    method: "card",
    stamp: "cozy",
    confirm: [c("pool-open", "Pool and hot tub hours (the resort lists an outdoor heated pool and hot tub) — confirm they’re open in December.")],
  },

  /* -------------------------- Thursday 12/17 ------------------------ */
  {
    id: "thu-morning",
    day: 3,
    time: "10:00 AM",
    start: 10 * 60,
    title: "Slow morning & the heated pool",
    kind: "pool",
    blurb: "Cook breakfast, swim or soak, rest and save energy for a big night of neon.",
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
  },
  {
    id: "thu-ride",
    day: 3,
    time: "3:15 PM",
    start: 15 * 60 + 15,
    title: "Rideshare to Fremont",
    kind: "ride",
    blurb: "Downtown is farther than the Strip, about 25–35 minutes.",
    place: "Le Thai",
    address: "523 Fremont St, Las Vegas, NV 89101",
    lat: 36.1691,
    lng: -115.1389,
    est: 27,
    category: "rides",
    method: "card",
    assumed: "Estimate from November’s short Uber fares scaled for the longer ride. Check your app.",
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
    tips: [
      "Street performers will ask for tips and “donations.” November’s $40 street donation was a lesson: say no thanks and keep walking.",
      "No casino spending in the plan. A quick walk-through is free.",
    ],
  },
  {
    id: "thu-home",
    day: 3,
    time: "9:30 PM",
    start: 21 * 60 + 30,
    title: "Rideshare back to the suite",
    kind: "ride",
    blurb: "Back to the resort after a night of neon. Pack tonight so Friday is easy.",
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
      "Check your card statement for any incidentals hold release, and the rental car deposit hold.",
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
    est: 35,
    category: "airport",
    method: "card",
    assumed: "November’s taxi to the airport was about $35 (estimate). Edit once you see the real fare.",
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
    budget: 80,
    slot: "Tue 12/15 · 7:00 – 8:30 PM",
    address: "3655 S Las Vegas Blvd, Las Vegas, NV 89109",
    blurb: "Our birthday dinner: a French bistro with a patio facing the Bellagio fountains.",
    socialUrl: "https://www.opentable.com/mon-ami-gabi-las-vegas",
    menuUrl: "https://www.opentable.com/mon-ami-gabi-las-vegas",
    menuLabel: "Menu & reservations",
    confirmId: "gabi-res",
    verified:
      "Not read from the restaurant’s own site. Third-party listings say the patio faces the Bellagio fountains, entrées land in a $31–$50-per-person band, and hours run about 7 AM–10 PM (later Fri–Sat).",
    caveat:
      "At those entrée prices two full entrées would run over $80. Happy-hour listings also conflict (one says 3–5:30 PM weekdays, another 4–6:30 PM), so we’re booking dinner, not happy hour.",
    picks: [
      "One shared starter (French onion soup is a classic)",
      "One shared entrée, or two lighter plates",
      "One dessert to share, with a candle",
      "Sparkling water or a mocktail instead of wine",
    ],
    pickTotal: "Planning figure ≈ $80 for two with tax and tip, matching November’s Tap supper at $78. Check real prices on the menu.",
    tip: "Reserve a patio table around 7 PM and ask about heaters. If the menu runs over $80, switch to shared plates.",
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
    picks: ["Waterfall Beef $12", "Chicken Satay $10", "Pork Jerky $10", "Thai Iced Tea $3", "A $4 beer for him"],
    pickTotal: "≈ $35–39 + tax and tip ≈ $45.",
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
  ...["Photo IDs", "Driver’s license for the rental car", "Boarding passes / flight info", "Booking.com confirmation (saved offline)", "Red Rock timed-entry ticket (saved offline)", "Debit/credit card", "Cash for tips"].map((l, i) => pk("Documents & money", l, i)),
  ...["Jackets for the desert mornings", "Warm coat for Strip evenings (near freezing)", "Layers (sweater, scarf, gloves)", "Sturdy walking or hiking shoes", "Hat, sunglasses and sunscreen", "Birthday-dinner outfit", "Swimsuits (heated pool & hot tub)", "Pajamas for the cozy suite nights"].map((l, i) => pk("Clothes", l, i)),
  ...["Phone chargers + portable battery", "Car phone charger or cable", "Offline maps downloaded for Las Vegas, Red Rock and Valley of Fire", "Rideshare app set up with a card", "Camera or photo-ready phone"].map((l, i) => pk("Tech", l, i)),
  ...["Daypack for the park days", "Cooler bag and sandwich bags for packed lunches", "Reusable water bottles (more than you think)", "Snacks for the car"].map((l, i) => pk("Desert days", l, i)),
  ...["Moisturizer and lip balm (dry air)", "Medications & first-aid basics", "Blister bandages"].map((l, i) => pk("Care", l, i)),
  ...["Birthday card or small surprise", "Holiday-movie watchlist for the suite"].map((l, i) => pk("Birthday & cozy extras", l, i)),
];

export const DEFAULT_GROCERIES = [
  { name: "Coffee & creamer", qty: 1 },
  { name: "Breakfast (eggs, bacon or sausage, bread, yogurt)", qty: 2 },
  { name: "Packed-lunch fixings (bread, deli meat, cheese)", qty: 2 },
  { name: "Sandwich bags", qty: 1 },
  { name: "Fresh fruit", qty: 2 },
  { name: "Bottled water & sparkling water", qty: 8 },
  { name: "Snacks for the car and the trails", qty: 3 },
  { name: "A few beers or Coronas (cheaper than a bar)", qty: 1 },
  { name: "Wednesday-night dinner for the suite", qty: 1 },
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
  { id: "wheels", name: "On the Road", icon: "sun", top: "RENTAL CAR" },
  { id: "stocked", name: "Stocked Up", icon: "cart", top: "FULL KITCHEN" },
  { id: "redrock", name: "Red Rock", icon: "tree", top: "RED ROCK CANYON" },
  { id: "magic", name: "Magic Mountains", icon: "flower", top: "SEVEN MAGIC MOUNTAINS" },
  { id: "conservatory", name: "Winter Gardens", icon: "flower", top: "BELLAGIO GARDENS" },
  { id: "fountains", name: "Fountains", icon: "fountain", top: "BELLAGIO FOUNTAINS" },
  { id: "birthday", name: "Thirty!", icon: "heart", top: "30TH BIRTHDAY" },
  { id: "valley", name: "Valley of Fire", icon: "sun", top: "VALLEY OF FIRE" },
  { id: "cozy", name: "Cozy Night", icon: "bowl", top: "COZY SUITE" },
  { id: "splash", name: "Splash", icon: "wave", top: "HEATED POOL" },
  { id: "lethai", name: "Le Thai", icon: "bowl", top: "LE THAI" },
  { id: "parkfremont", name: "Park on Fremont", icon: "tree", top: "PARK ON FREMONT" },
  { id: "fremont", name: "Fremont Street", icon: "neon", top: "FREMONT STREET" },
  { id: "homeward", name: "Homeward", icon: "sun", top: "HOMEWARD BOUND" },
];

export const STAMP_BY_ID: Record<string, StampDef> = Object.fromEntries(STAMPS.map((s) => [s.id, s]));

/** Typical mid-December weather when the forecast isn't loaded. */
export const TYPICAL_WEATHER = { hi: 57, lo: 39, note: "Typical for mid-December" };
