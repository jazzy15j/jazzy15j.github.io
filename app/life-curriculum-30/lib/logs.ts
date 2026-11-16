import type { LogKind } from "./course";

export type LogField = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
};

export type LogDef = {
  title: string;
  blurb: string;
  fields: LogField[];
  sumKey?: string;
  sumLabel?: string;
};

export type Entry = { id: string; date: string } & Record<string, string>;

export const logOrder: LogKind[] = ["sewing", "kitchen", "reading", "movement", "work", "thrift"];

export const logDefs: Record<LogKind, LogDef> = {
  sewing: {
    title: "Sewing log",
    blurb: "What you made, how long it took and what you learned.",
    fields: [
      { key: "project", label: "Project", type: "text", placeholder: "Napkins, pillow cover…" },
      { key: "minutes", label: "Minutes at the machine", type: "number" },
      { key: "learned", label: "What I learned", type: "textarea" },
      { key: "next", label: "Next step", type: "text" },
    ],
    sumKey: "minutes", sumLabel: "minutes sewn",
  },
  kitchen: {
    title: "Kitchen log",
    blurb: "Techniques and recipes you tried.",
    fields: [
      { key: "dish", label: "What I cooked", type: "text" },
      { key: "technique", label: "Technique", type: "text", placeholder: "Roasting, pan sauce…" },
      { key: "rating", label: "How it turned out", type: "select", options: ["Loved it", "Good", "OK", "Needs work"] },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  reading: {
    title: "Reading log",
    blurb: "What you read or listened to.",
    fields: [
      { key: "book", label: "Book", type: "text" },
      { key: "minutes", label: "Minutes", type: "number" },
      { key: "format", label: "Format", type: "select", options: ["Print", "Libby ebook", "Libby audiobook"] },
      { key: "notes", label: "A line I liked or a question", type: "textarea" },
    ],
    sumKey: "minutes", sumLabel: "minutes read or listened",
  },
  movement: {
    title: "Movement log",
    blurb: "Stretching, strength, walking and yoga.",
    fields: [
      { key: "type", label: "Type", type: "select", options: ["Stretch + lymphatic", "Strength (dumbbells)", "Walk", "Yoga", "Other"] },
      { key: "minutes", label: "Minutes", type: "number" },
      { key: "notes", label: "How did it feel?", type: "textarea" },
    ],
    sumKey: "minutes", sumLabel: "minutes moved",
  },
  work: {
    title: "Work hours",
    blurb: "Your two-hour cap. Log laptop work so it stays small.",
    fields: [
      { key: "hours", label: "Hours (0.5 steps are fine)", type: "number" },
      { key: "what", label: "What I worked on", type: "text" },
    ],
    sumKey: "hours", sumLabel: "hours worked",
  },
  thrift: {
    title: "Thrift & spending",
    blurb: "Supplies and thrift finds, so the budget stays honest.",
    fields: [
      { key: "item", label: "Item", type: "text" },
      { key: "store", label: "Store", type: "text" },
      { key: "price", label: "Price ($)", type: "number" },
    ],
    sumKey: "price", sumLabel: "dollars spent",
  },
};
