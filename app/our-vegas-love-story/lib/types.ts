export type Method = "cash" | "card";

export type CategoryId =
  | "groceries"
  | "restaurants"
  | "beerCannabis"
  | "airportTaxis"
  | "monorail"
  | "deuce"
  | "backup"
  | "cushion";

export type StopKind =
  | "arrive"
  | "hotel"
  | "walk"
  | "shop"
  | "sight"
  | "show"
  | "pool"
  | "food"
  | "drink"
  | "grocery"
  | "ride"
  | "free"
  | "depart";

export type TravelMode = "walk" | "transit" | "shuttle" | "taxi" | "none";

export interface Leg {
  mode: TravelMode;
  /** Short human text, e.g. "0.8 mi walk" */
  distance: string;
  /** Short human text, e.g. "~17 min" */
  time: string;
  /** How to actually do it. */
  how: string;
}

export interface Confirm {
  id: string;
  /** What still needs to be verified. */
  text: string;
}

export interface Stop {
  id: string;
  day: number;
  /** Display time, e.g. "4:00 – 5:00 PM" */
  time: string;
  /** Minutes after midnight, for ordering and "up next". */
  start: number;
  title: string;
  kind: StopKind;
  blurb: string;
  /** Place name + address, used for Google Maps. */
  place: string;
  address: string;
  url?: string;
  urlLabel?: string;
  photo?: string;
  lat: number;
  lng: number;
  est: number;
  category: CategoryId | null;
  method: Method;
  leg?: Leg;
  confirm?: Confirm[];
  tips?: string[];
  stamp?: string;
  /** Optional note that the estimate is an assumption. */
  assumed?: string;
}

export interface StopState {
  actual: number | null;
  method: Method;
  notes: string;
  done: boolean;
  doneAt?: string;
}

export interface Extra {
  id: string;
  stopId: string | null;
  label: string;
  amount: number;
  method: Method;
  category: CategoryId;
  ts: string;
  note: string;
}

export interface OrderItem {
  id: string;
  item: string;
  price: number | null;
  rating: number;
}

export interface FoodLog {
  confirmedHours: string;
  notes: string;
  orders: OrderItem[];
}

export interface PackItem {
  id: string;
  group: string;
  label: string;
  done: boolean;
  custom?: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  qty: number;
  price: number | null;
  inRoom: boolean;
}

export interface HotelDeposit {
  amount: number;
  method: Method;
  status: "pending" | "held" | "refunded";
  note: string;
}

export interface Settings {
  limit: number;
  alloc: Record<CategoryId, number>;
  cashInHand: number;
  atmPlanned: number;
  atmDone: boolean;
  deposit: HotelDeposit;
}

export interface AppState {
  v: 1;
  stops: Record<string, StopState>;
  extras: Extra[];
  settings: Settings;
  food: Record<string, FoodLog>;
  packing: PackItem[];
  groceries: GroceryItem[];
  confirmed: Record<string, { done: boolean; note: string }>;
  notes: string;
  dayNotes: Record<number, string>;
}
