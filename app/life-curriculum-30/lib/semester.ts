// Winter Semester, Dec 7 2026 – Mar 14 2027. Built for Kearney, NE.
// Book titles are real; whether a given title is available in Libby right now
// must be checked in the app (availability and wait times change daily).

export const SEMESTER_START = "2026-12-07"; // Monday of week 1

export type Week = {
  n: number;
  label: string;
  soft?: string; // why this is a light week
  sewing: string;
  reading: string;
  kitchen: string;
  outing: string;
};

export const weeks: Week[] = [
  { n: 1, label: "Dec 7", sewing: "Read parts of a machine. Reserve the library machine for Tue (needs 1 day notice). Practice threading + bobbin on scrap.", reading: "My Ántonia, bk I (audiobook while cleaning)", kitchen: "Roast a tray of vegetables, salted well", outing: "Get/confirm library card; set up Libby; ask staff about the machine" },
  { n: 2, label: "Dec 14", soft: "Vegas week — no coursework", sewing: "Rest", reading: "Whatever you want on the plane", kitchen: "Rest", outing: "Las Vegas, Dec 14–18" },
  { n: 3, label: "Dec 21", soft: "Holiday week — one tiny task a day", sewing: "Sew straight lines on scrap fabric (rows ½ inch apart)", reading: "My Ántonia, bk II–III", kitchen: "Soup from what's in the fridge", outing: "Optional thrift stop for sheets/fabric" },
  { n: 4, label: "Dec 28", soft: "Birthday week (Dec 30)", sewing: "Practice backstitch, corners, and a hem on scrap", reading: "Finish My Ántonia", kitchen: "A dish you love, from scratch", outing: "Birthday day = nothing scheduled" },
  { n: 5, label: "Jan 4", sewing: "PROJECT 1 start: 4 cloth napkins (thrifted sheet or flannel)", reading: "Start Four Thousand Weeks", kitchen: "Pan sauce for eggs or chicken", outing: "Tue: library sewing session" },
  { n: 6, label: "Jan 11", sewing: "Finish napkins; press, mitered corners", reading: "Four Thousand Weeks", kitchen: "Vinaigrette from scratch + salad", outing: "Tue: library sewing; thrift for pillow fabric" },
  { n: 7, label: "Jan 18", sewing: "PROJECT 2: envelope-back pillow cover", reading: "Finish Four Thousand Weeks", kitchen: "Cook dry beans from scratch", outing: "Tue: sewing + coffee-shop journaling" },
  { n: 8, label: "Jan 25", sewing: "Finish pillow cover. Measure windows for curtains; write a materials list", reading: "Start Braiding Sweetgrass", kitchen: "No-knead bread", outing: "Tue: sewing; visit Museum of Nebraska Art (check admission)" },
  { n: 9, label: "Feb 1", sewing: "PROJECT 3: curtains — buy/thrift fabric, cut panels", reading: "Braiding Sweetgrass", kitchen: "Make stock from scraps", outing: "Tue: sewing (cut + hem)" },
  { n: 10, label: "Feb 8", sewing: "Curtains: sew side hems and rod pocket", reading: "Braiding Sweetgrass", kitchen: "Braise something cheap and tough", outing: "Tue: sewing" },
  { n: 11, label: "Feb 15", sewing: "Finish and hang curtains (renter-friendly tension rod or command hooks)", reading: "Finish Braiding Sweetgrass; start Meditations (a few pages a day)", kitchen: "Quick pickles", outing: "Tue: sewing; Extension office — ask about preserving classes" },
  { n: 12, label: "Feb 22", sewing: "Ask about AccuQuilt: cut blocks for a table runner or mini quilt", reading: "Meditations; start Gilead", kitchen: "Plan canning recipes from tested sources", outing: "Tue: AccuQuilt session" },
  { n: 13, label: "Mar 1", sewing: "Piece the mini quilt / table runner", reading: "Gilead", kitchen: "Order seeds; sketch garden beds", outing: "Tue: sewing" },
  { n: 14, label: "Mar 8", sewing: "Finish a project; photograph everything you made", reading: "Finish Gilead", kitchen: "Cook your favorite recipe of the semester", outing: "Semester review over coffee (Sun Mar 14)" },
];

export type Book = { title: string; author: string; why: string; kind: string };

export const books: Book[] = [
  { title: "My Ántonia", author: "Willa Cather", kind: "Fiction (Nebraska)", why: "Prairie life, set in Nebraska; lovely on audio." },
  { title: "Four Thousand Weeks", author: "Oliver Burkeman", kind: "Philosophy", why: "A kind argument against constant productivity." },
  { title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", kind: "Nature & perspectives", why: "Gardening, gratitude and Indigenous ways of seeing." },
  { title: "Meditations", author: "Marcus Aurelius (Gregory Hays translation)", kind: "Philosophy", why: "Read a few pages a day, slowly." },
  { title: "Gilead", author: "Marilynne Robinson", kind: "Fiction (faith)", why: "Quiet, spiritual, beautifully written." },
  { title: "The Sewing Book", author: "Alison Smith (DK)", kind: "Sewing reference", why: "Illustrated basics; use as a reference, not cover to cover." },
  { title: "Salt, Fat, Acid, Heat", author: "Samin Nosrat", kind: "Cooking", why: "Learn why food works, so you can cook without recipes." },
  { title: "The Vegetable Gardener's Bible", author: "Edward C. Smith", kind: "Gardening", why: "For the February garden-planning weeks." },
];

export const morning = ["Coffee", "Feed and care for the animals", "15 min stretch or yoga", "Breakfast", "Write today's one intention"];
export const evening = ["Cook dinner", "Evening show with my husband", "Three lines in the journal (one gratitude)", "Set out tomorrow's sewing or book"];

export type Theme = { day: string; focus: string; do: string[] };

export const dayThemes: Theme[] = [
  { day: "Sunday", focus: "Rest & faith", do: ["Prayer or reflection", "Read for pleasure", "Look at next week (10 min)"] },
  { day: "Monday", focus: "Home reset", do: ["Clean one zone", "Laundry", "Plan meals", "Reserve library machine for tomorrow"] },
  { day: "Tuesday", focus: "Town day: sewing lab", do: ["Pick up holds and groceries", "Library sewing session", "Coffee + journal", "One errand loop only"] },
  { day: "Wednesday", focus: "Make at home", do: ["Prep next project: press, cut, pin", "Hand-sew or mend", "Home improvement task"] },
  { day: "Thursday", focus: "Mind & body", do: ["30 min reading", "Art: draw or watercolor", "A longer walk outside"] },
  { day: "Friday", focus: "Money day (2 hours max)", do: ["Review spending", "Business upkeep", "One income experiment step"] },
  { day: "Saturday", focus: "Garden & kitchen", do: ["Weekly kitchen technique", "Household project", "Time with my husband"] },
];

export type Resource = { name: string; what: string; confidence: string; contact?: string };

export const resources: Resource[] = [
  { name: "Kearney Public Library Technology Learning Center", what: "Sewing/embroidery machines, an AccuQuilt cutter, Cricut Makers and more. In-library use, free with your own supplies; reserve at least a day ahead (walk-ins when open). Needs a KPL card in good standing.", confidence: "Search results only; the city site was not reachable from here. An older handout listed $1 per session and the state makerspace listing says fees may vary. Confirm.", contact: "308-233-3282" },
  { name: "Libby (Nebraska OverDrive Libraries)", what: "Free ebooks and audiobooks through the statewide consortium with your library card. Loans of 7/14 days (audio) and 7/14/21 days (ebooks).", confidence: "Confirmed by the Nebraska Library Commission; check Kearney's card requirements.", contact: "Libby app or libraries.ne.gov" },
  { name: "Nebraska Extension, Buffalo County", what: "Local horticulture and food help; statewide free Food Preservation Virtual Learning Series (2026 ran Apr 23–Sep 15).", confidence: "Past-year schedules; I could not confirm 2027 classes or a seed library.", contact: "308-236-1235, 1400 E 34th St" },
  { name: "Museum of Nebraska Art (Kearney)", what: "Art museum for the Tuesday outings.", confidence: "Hours and admission not verified; check before going." },
];
