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
  { n: 1, label: "Dec 7", sewing: "Read parts of a machine. Reserve the library machine for Tue (needs 1 day notice). Practice threading + bobbin on scrap.", reading: "My Ántonia, bk I (audiobook while cleaning)", kitchen: "Roast a tray of vegetables, salted well", outing: "Get or confirm library card; set up Libby; reserve the Brother SE625 online" },
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
  { n: 12, label: "Feb 22", sewing: "AccuQuilt: cut 6.5-inch squares (or an oven mitt or bowl cozy die) for a table runner or mini quilt", reading: "Meditations; start Gilead", kitchen: "Plan canning recipes from tested sources", outing: "Tue: AccuQuilt session" },
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

export const morning = ["8:00 Wake up, coffee", "8:15 Feed and care for the animals", "8:45 Stretching + lymphatic drainage video (your YouTube routine)", "9:30 Breakfast"];
export const evening = ["Cook dinner", "Evening show with my husband", "Three lines in the journal (one gratitude)", "Set out tomorrow's sewing or book"];

export type Theme = { day: string; focus: string; do: string[] };

export const dayThemes: Theme[] = [
  { day: "Sunday", focus: "Rest & faith", do: ["Prayer or reflection", "Read for pleasure", "Look at next week (10 min)"] },
  { day: "Monday", focus: "Home reset", do: ["Strength: 20 min with the 15 lb dumbbells", "Clean one zone", "Laundry", "Plan meals", "Reserve library machine for tomorrow (one business day ahead)"] },
  { day: "Tuesday", focus: "Town day: sewing lab", do: ["Pick up holds and groceries", "Library sewing session", "Coffee + journal", "One errand loop only"] },
  { day: "Wednesday", focus: "Make at home", do: ["Strength: 20 min with the 15 lb dumbbells", "Prep next project: press, cut, pin", "Hand-sew or mend", "Home improvement task"] },
  { day: "Thursday", focus: "Mind & body", do: ["30 min reading", "Art: draw or watercolor", "A longer walk outside (no weights today)"] },
  { day: "Friday", focus: "Money day (2 hours max)", do: ["Strength: 20 min with the 15 lb dumbbells", "Review spending", "Business upkeep", "One income experiment step"] },
  { day: "Saturday", focus: "Garden & kitchen", do: ["Weekly kitchen technique", "Household project", "Time with my husband"] },
];

export type Resource = { name: string; what: string; confidence: string; contact?: string };

export const resources: Resource[] = [
  { name: "Library sewing machine (Kearney Public Library)", what: "Brother SE625 sewing/embroidery machines, free to use. Library provides scissors, pins, seam ripper, presser feet, needles and empty bobbins; you bring fabric, thread and projects. Embroidery area is 4\" x 4\" (white and black bobbin thread provided), rated difficult to learn.", confidence: "From the library's own Sewing Machine and Pricing pages. The older $1 handout is outdated.", contact: "2020 1st Ave · 308-233-3282 · Tech librarian 308-233-3612" },
  { name: "Makerspace rules", what: "Reserve at least one business day ahead online, in person or by phone; the spot is held 15 minutes; limit two reservations per week per device. Walk-ins welcome if the machine is free. Makerspace is closed Saturday afternoons, Sundays and public holidays. Needs a library card in good standing.", confidence: "From the library's Technology Learning Center and Makerspace pages.", contact: "Hours: Mon–Thu 9–9, Fri–Sat 9–5, Sun 1–5" },
  { name: "AccuQuilt GO! Big cutter", what: "Free, bring your own fabric. Library provides dies, mats, iron, ironing board and extra table space. Dies include 6.5\" squares, flying geese, oven mitt, bowl cozy, burp cloth, strips and more.", confidence: "From the library's AccuQuilt page; rated simple to learn." },
  { name: "Libby and the library catalog", what: "Free ebooks, audiobooks and magazines with your card (audiobooks 7 or 14 days, ebooks 7, 14 or 21 days, no fines). Also a Bookmobile and film streaming. The library's makerspace page links sewing books in its catalog: The Sewing Book (Alison Smith), Martha Stewart's Encyclopedia of Sewing, The Complete Manual of Sewing, My Sewing Workshop.", confidence: "From the library's eBooks and Makerspace pages. Whether each title is on a shelf or in Libby today must be checked in the catalog.", contact: "Main desk 308-233-3282" },
  { name: "Nebraska Extension, Buffalo County", what: "Local horticulture and food help; statewide free online Food Preservation series (2026 ran Apr 23–Sep 15).", confidence: "Past-year schedules; I could not confirm 2027 classes or a seed library.", contact: "308-236-1235, 1400 E 34th St" },
  { name: "Museum of Nebraska Art (Kearney)", what: "Art museum for Tuesday outings.", confidence: "Hours and admission not verified; check before going." },
];

export type Supply = { group: string; items: string[] };

export const supplies: Supply[] = [
  { group: "Bring to every library sewing session", items: ["Fabric for that day's project (pre-washed and pressed)", "All-purpose thread: one neutral (white/cream/grey) plus a match for the project", "Fabric chalk or a washable marker", "Measuring tape and a clear 6\" ruler", "Sewing clips (kinder to thick fabric than pins)", "Small fabric scissors or thread snips (library has scissors, bring your own for comfort)", "A tote bag to carry it all"] },
  { group: "Thrift list: napkins (Weeks 5–6)", items: ["Flat cotton or flannel sheet, any pattern you like (one sheet makes dozens)", "Or 100% cotton or linen cloth napkins to reuse"] },
  { group: "Thrift list: pillow cover (Weeks 7–8)", items: ["Pillow to use as the insert (about 16–18\")", "Cotton or linen fabric: half a yard, or a thrifted curtain or shirt"] },
  { group: "Thrift list: curtains (Weeks 9–11)", items: ["Flat sheets or ready-made curtain panels (your windows' measurements first)", "Tension rod, or a rod you can hang without drilling", "Curtain clip rings if you skip the rod pocket"] },
  { group: "Thrift list: mini quilt (Weeks 12–14)", items: ["Cotton shirts, sheets or scraps for blocks (6.5\" squares fit the library die)", "A small thrifted blanket or cotton batting", "Backing: one more flat sheet"] },
  { group: "At home (iron before every session)", items: ["Iron and a towel or pressing board", "A hand-sewing kit for finishing: needle, thimble if you like", "A small box to keep scraps"] },
  { group: "Thrift smart", items: ["Pick cotton, linen or flannel; skip stretchy or slippery fabric for your first projects", "Flat sheets, not fitted; look for tight, soft weave", "Check for stains, holes and smells; wash everything hot before cutting"] },
  { group: "Strength days (Mon, Wed, Fri)", items: ["Your two 15 lb dumbbells", "A mat or towel", "Beginner moves to start: goblet squat, Romanian deadlift, overhead press, bent-over row, glute bridge (go lighter on the first week)"] },
];
