import { L, bible, catalog, libbySearch, yt, type Link } from "./links";

// The Winter Semester: Orientation (starts Tue Nov 17) + 16 weeks (Nov 23 – Mar 14).
// Weeks run Monday to Sunday. Library/Libby availability must be checked live.

export type Part = "morning" | "core" | "afternoon" | "evening";
export type LogKind = "sewing" | "kitchen" | "reading" | "movement" | "work" | "thrift";

export type Step = {
  id: string;
  text: string;
  part: Part;
  how?: string[];
  links?: Link[];
  log?: LogKind;
  dyn?: "stretch";
};

export type Lesson = {
  id: string;
  weekN: number;
  dayIdx: number; // 0 = Monday
  date: string; // YYYY-MM-DD
  title: string;
  theme: string;
  why: string;
  soft: boolean;
  steps: Step[];
  logs: LogKind[];
};

export type Week = {
  n: number;
  start: string;
  title: string;
  goal: string;
  kind: "orientation" | "trip" | "soft" | "normal";
  outcomes: string[];
  materials: string[];
  lessons: Lesson[];
};

type DayDef = { title: string; steps: string[]; links?: Link[]; log?: LogKind };

type WeekDef = {
  n: number;
  start: string;
  title: string;
  goal: string;
  kind: Week["kind"];
  outcomes: string[];
  materials: string[];
  days?: DayDef[]; // used by orientation / trip / soft weeks
  home?: string;
  sewTitle?: string;
  sewTue?: string[];
  sewWed?: string[];
  reading?: { book: string; what: string };
  art?: string;
  faith?: { ref: string; prompt: string };
  money?: string[];
  kitchen?: { name: string; how: string[]; q: string };
  sat?: string;
  outing?: string;
};

export const SEMESTER_START = "2026-11-23";
export const COURSE_START = "2026-11-17";
export const COURSE_END = "2027-03-14";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function prettyDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
export function dayName(i: number) { return DAY_NAMES[i]; }
export const TOTAL_WEEKS = 16;
export function weekLabel(n: number): string { return n === 0 ? "Orientation" : `Week ${n}`; }
function weekdayIdx(iso: string): number { return (new Date(`${iso}T12:00:00Z`).getUTCDay() + 6) % 7; }

const STRENGTH = {
  text: "Strength with your two 15 lb dumbbells (about 20 min)",
  how: [
    "Rounds: weeks 1–4 do 2 rounds; from week 5 do 3. Rest 60 seconds between rounds.",
    "10 goblet squats (hold one dumbbell at your chest)",
    "10 Romanian deadlifts (both dumbbells, hinge at the hips, back flat)",
    "8 overhead presses",
    "10 bent-over rows",
    "12 glute bridges (hold one dumbbell on your hips)",
    "Go lighter or skip a move if anything hurts. Sharp pain means stop.",
  ],
  links: [yt("beginner dumbbell workout full body 15 lb at home", "Follow along on YouTube")],
};

const WHY = [
  "A reset day makes the rest of the week easier. A tidy zone and a plan keep town day and sewing day smooth.",
  "Town day is where the library does the heavy lifting: the machine, the books and the groceries all happen in one trip.",
  "Make at home. Small prep today (pressing, measuring, practicing) is what makes the library session worth the drive.",
  "A day for your mind and body: read, make art and walk, with nothing to produce.",
  "Money day keeps income work contained in two hours so it can't take over the week.",
  "Garden, cook and spend a slow day at home with your husband.",
  "Rest. Faith, reading for pleasure and a gentle look ahead.",
];

const THEMES = ["Home reset", "Town day", "Make at home", "Mind & body", "Money day", "Garden & kitchen", "Rest & faith"];

// ---------------------------------------------------------------- week data

const WEEKS: WeekDef[] = [
  {
    n: 0, start: "2026-11-17", kind: "orientation", title: "Get set up",
    goal: "Get your library card, Libby, machine reservation and supplies ready, starting tomorrow.",
    outcomes: ["Library card works in the catalog and Libby", "First library sewing session is booked", "Thrift-and-supplies list in hand"],
    materials: ["Photo ID for the library", "Phone with the Libby app"],
    days: [
      { title: "Town day: card, tour, first booking", steps: ["Visit the library (2020 1st Avenue) and confirm your card is in good standing", "Ask staff to show you the makerspace and the Brother SE625 sewing machine", "Reserve the machine for next Tuesday, Nov 24 (one business day ahead; max two a week)", "Ask staff to help you add the library to Libby on your phone", "Pick up one book from the sewing shelf to browse"], links: [L.maker, L.sewPage, L.reserve, L.catalogHome], log: "reading" },
      { title: "Set up your course and Libby", steps: ["Open Settings and paste your stretching and lymphatic video link", "Skim the Course map so you know what the weeks look like", "In Libby, borrow or place a hold on My Ántonia (listen on audio while cleaning)", "Add Four Thousand Weeks and Braiding Sweetgrass to your holds or wish list"], links: [L.libby, L.libbyHelp, L.ebooks, libbySearch("My Ántonia"), libbySearch("Four Thousand Weeks")] },
      { title: "Read the machine manual", steps: ["Read the sewing machine page and the pricing and policy page", "Watch one threading tutorial for a Brother machine", "Start listening to My Ántonia"], links: [L.sewPage, L.pricing, yt("brother SE625 threading tutorial"), libbySearch("My Ántonia")] },
      { title: "Money day: semester budget", steps: ["Choose a small fixed budget for fabric and supplies this semester", "Write it on the first page of your journal", "Plan to spend most of it at thrift stores"], log: "thrift" },
      { title: "First thrift run", steps: ["Look for 2 flat cotton or flannel sheets (not fitted), plus 1 thrifted pillow", "Check for stains and smells; skip stretchy fabric", "Wash everything hot and dry it at home", "Log what you bought and what it cost"], links: [yt("how to thrift fabric sheets for sewing beginners")], log: "thrift" },
      { title: "Rest and preview", steps: ["Rest. Slow morning, faith, reading for pleasure", "Look at Week 1 in the Course map (10 minutes)", "Lay out your supplies by the door for Tuesday"] },
    ],
  },
  {
    n: 1, start: "2026-11-23", kind: "normal", title: "Meet the machine",
    goal: "Learn the parts of a sewing machine and sew your first straight lines.",
    outcomes: ["Name the main parts of the machine", "Wind a bobbin and thread the needle", "Sew three practice lines on scrap fabric"],
    materials: ["Scrap fabric or an old pillowcase", "All-purpose thread (white or cream)", "Washable marker or chalk"],
    home: "kitchen",
    sewTitle: "First stitches",
    sewTue: ["Ask staff to show the threading path once", "Wind a bobbin and thread the needle", "Sew three straight lines on a scrap, slowly", "Practice stopping, lifting the foot and cutting thread"],
    sewWed: ["Press the thrifted sheets flat", "Watch a short threading tutorial once more", "Cut four 14-inch squares from the sheet and set them in your sewing bag"],
    reading: { book: "My Ántonia", what: "Book I: The Shimerdas (audiobook while cleaning)" },
    art: "Draw your spools of thread or the machine from memory for 10 minutes. No erasing.",
    faith: { ref: "Psalm 23", prompt: "Where did I feel unrushed this week?" },
    money: ["List your recurring monthly expenses", "Write down what share of income comes from Fiverr (just a number)"],
    kitchen: { name: "Roast a tray of vegetables", how: ["Heat the oven to 425°F", "Cut vegetables to a similar size, toss with oil and salt", "Roast in a single layer for 25–35 minutes, turning once", "Taste. Add acid (lemon or vinegar) at the end"], q: "how to roast vegetables 425 salt fat acid heat" },
    sat: "Wipe down the kitchen and take stock of the pantry (20 minutes)",
    outing: "Coffee and journaling after the library. Thursday is Thanksgiving; the library is closed",
  },
  {
    n: 2, start: "2026-11-30", kind: "normal", title: "Straight lines",
    goal: "Get comfortable sewing straight, even lines.",
    outcomes: ["Thread the machine without help", "Sew straight lines at a steady speed", "Control the start and stop"],
    materials: ["Scrap fabric", "Thread", "Chalk and a ruler"],
    home: "bedroom",
    sewTitle: "Straight lines",
    sewTue: ["Thread the machine yourself, then ask staff to check it", "Sew rows of lines half an inch apart on a scrap", "Check that the lines are straight and even", "Practice starting and stopping slowly"],
    sewWed: ["Press the scraps flat", "Watch a short tutorial on sewing straight lines", "Draw guide lines on a scrap with chalk and a ruler"],
    reading: { book: "My Ántonia", what: "Book II: The Hired Girls" },
    art: "Draw ten straight parallel lines freehand, then ten curved ones.",
    faith: { ref: "Psalm 8", prompt: "What am I noticing about the world around me?" },
    money: ["Keep tracking every thrift buy in the log", "Write down what share of income comes from Fiverr (just a number)"],
    kitchen: { name: "Soup from what's in the fridge", how: ["Sauté an onion and garlic in oil", "Add chopped vegetables, stock or water, and simmer until soft", "Taste and adjust salt and acid"], q: "how to make soup from leftovers" },
    sat: "Wipe down the kitchen and take stock of the pantry (20 minutes)",
    outing: "Coffee and journaling after the library",
  },
  {
    n: 3, start: "2026-12-07", kind: "normal", title: "Backstitch, corners and hems",
    goal: "Learn the three skills every project needs.",
    outcomes: ["Backstitch at both ends of a seam", "Pivot at a square corner", "Sew a plain double-fold hem"],
    materials: ["Scrap fabric", "Thread", "Fabric clips", "Iron"],
    home: "office and desk",
    sewTitle: "Backstitch, corners and a hem",
    sewTue: ["Practice backstitch at the start and end of each seam", "Sew a square, pivoting at each corner with the needle down", "Fold ½ inch twice and sew a hem on one edge"],
    sewWed: ["Press your practice hem flat", "Watch a short hemming tutorial", "Cut four 14-inch squares from the sheet for the napkins"],
    reading: { book: "My Ántonia", what: "Books III–IV" },
    art: "Watercolor: three washes (flat, graded, wet-into-wet) on scrap paper.",
    faith: { ref: "Psalm 100", prompt: "What am I grateful for this week?" },
    money: ["List this year's business income by source (just numbers)", "Note how much of it you want to keep"],
    kitchen: { name: "Cook eggs three ways", how: ["Scramble gently over low heat", "Fry with a lid for set whites and a runny yolk", "Boil for 6–7 minutes for a soft yolk"], q: "how to cook eggs three ways" },
    sat: "One household project (45 minutes)",
    outing: "Library, then a short walk",
  },
  {
    n: 4, start: "2026-12-14", kind: "trip", title: "Las Vegas week",
    goal: "No coursework. Enjoy your trip.",
    outcomes: ["Enjoy the trip", "Log a gratitude each day"],
    materials: ["Your Vegas trip planner"],
    days: [
      { title: "Vegas: arrive", steps: ["Open your trip planner for today's itinerary", "One gratitude line in the log below"], links: [L.vegas] },
      { title: "Vegas day", steps: ["Follow the itinerary", "One gratitude line in the log below"], links: [L.vegas] },
      { title: "Vegas day", steps: ["Follow the itinerary", "One gratitude line in the log below"], links: [L.vegas] },
      { title: "Vegas day", steps: ["Follow the itinerary", "One gratitude line in the log below"], links: [L.vegas] },
      { title: "Vegas: last day", steps: ["Follow the itinerary", "Gratitude line"], links: [L.vegas] },
      { title: "Home and unpack", steps: ["Unpack and do one load of laundry", "Slow evening with your husband"] },
      { title: "Rest", steps: ["Rest. Faith and reading for pleasure", "Preview Week 5 (10 minutes)"], links: [bible("Psalm 8")] },
    ],
  },
  {
    n: 5, start: "2026-12-21", kind: "soft", title: "Holiday week",
    goal: "Keep things light. One optional library session, one tiny task each day.",
    outcomes: ["Sew straight lines evenly", "Rest and enjoy the holiday"],
    materials: ["Scrap fabric", "Thread", "Chalk"],
    days: [
      { title: "Gentle reset", steps: ["Reserve the library machine for Tuesday (one business day ahead)", "Tidy the table and entryway (20 minutes)"], links: [L.reserve] },
      { title: "Town day: practice session", steps: ["Library: review straight lines, backstitch and hems on a scrap", "Ask staff to check one seam", "Treat yourself to coffee"], links: [L.sewPage, yt("sewing straight lines beginner tips")], log: "sewing" },
      { title: "Light day", steps: ["20 minutes of something creative or restful", "Read for pleasure"] },
      { title: "Light day", steps: ["Walk outside (30 minutes)", "Listen to My Ántonia, Book V"], links: [libbySearch("My Ántonia")] },
      { title: "Christmas", steps: ["No lessons today. The library is closed.", "Gratitude line in the log"], links: [bible("Luke 2:1-20")] },
      { title: "Soup from the fridge", steps: ["Make soup from whatever is in the fridge", "Taste and adjust salt and acid"], links: [yt("how to make soup from leftovers")], log: "kitchen" },
      { title: "Rest", steps: ["Rest. Read Matthew 6:25–34", "Preview Week 6"], links: [bible("Matthew 6:25-34")] },
    ],
  },
  {
    n: 6, start: "2026-12-28", kind: "soft", title: "Birthday week",
    goal: "Cut your napkin squares. Your birthday is Wednesday.",
    outcomes: ["Cut accurate squares", "Press fabric flat"],
    materials: ["Scrap fabric", "Thread", "Fabric clips"],
    days: [
      { title: "Gentle reset", steps: ["Reserve the machine for Tuesday", "Reset one small zone (20 minutes)"], links: [L.reserve] },
      { title: "Town day: napkin prep", steps: ["Press the sheet flat and cut four 14-inch squares", "Fold ½ inch twice on one edge and sew a test hem", "Ask staff for one tip"], links: [L.sewPage, yt("sewing hem beginner fold twice")], log: "sewing" },
      { title: "Your birthday", steps: ["Nothing is required. Gratitude line in the log"] },
      { title: "Light day", steps: ["Finish My Ántonia (if you haven't already)", "Walk outside"], links: [libbySearch("My Ántonia")] },
      { title: "Year in review", steps: ["Spend 20 minutes writing three wins from 2026", "Write one hope for 2027"] },
      { title: "Cook a favorite", steps: ["Cook something you love from scratch", "Log what you cooked and how it went"], log: "kitchen" },
      { title: "Rest", steps: ["Rest. Read Ecclesiastes 3", "Preview Week 7 and the napkin project"], links: [bible("Ecclesiastes 3:1-14")] },
    ],
  },
  {
    n: 7, start: "2027-01-04", kind: "normal", title: "Project 1: cloth napkins (part 1)",
    goal: "Cut and begin sewing four cloth napkins.",
    outcomes: ["Cut accurate squares", "Press hems with an iron", "Sew two hemmed edges"],
    materials: ["Flat cotton or flannel sheet", "Thread", "Fabric chalk", "Clear ruler", "Iron"],
    home: "bathroom",
    sewTitle: "Napkins: cut and hem",
    sewTue: ["Cut four 14-inch squares (finished napkins will be 12 inches)", "Fold each edge ½ inch twice and press (or clip) before sewing", "Sew hems on two opposite edges of each napkin"],
    sewWed: ["Press hems on the remaining edges at home", "Iron the sheet flat before the next cut"],
    reading: { book: "Four Thousand Weeks", what: "First third of the book" },
    art: "Watercolor: three washes (flat, graded, wet-into-wet) on scrap paper.",
    faith: { ref: "Ecclesiastes 3:1-14", prompt: "What season am I in right now?" },
    money: ["List ten hands-on trades or skills you could try", "Circle three that appeal most"],
    kitchen: { name: "Make a pan sauce", how: ["Sear chicken or mushrooms, then remove them", "Add a splash of stock or wine and scrape the pan", "Reduce by half, finish with butter and a splash of acid"], q: "how to make a pan sauce beginner" },
    sat: "Wash and iron your fabric stash; sort by project",
    outing: "Thrift stop for pillow fabric",
  },
  {
    n: 8, start: "2027-01-11", kind: "normal", title: "Project 1: finish the napkins",
    goal: "Finish all four napkins and give them a first use.",
    outcomes: ["Finish hems on all edges", "Press crisp corners", "Use your napkins at dinner"],
    materials: ["Napkin squares", "Thread", "Iron"],
    home: "bedroom closet",
    sewTitle: "Napkins: finish and press",
    sewTue: ["Sew the last two edges on each napkin", "Trim threads and press", "Set the table with your napkins at home tonight"],
    sewWed: ["Hand-stitch any skipped spots", "Photograph the napkins for your log"],
    reading: { book: "Four Thousand Weeks", what: "Middle third of the book" },
    art: "Sketch the pattern of one fabric you own, in pencil or ink.",
    faith: { ref: "Micah 6:8", prompt: "How can I act with kindness this week?" },
    money: ["Research your two favorite trades (cost to start, time to learn)", "Note one local resource for each"],
    kitchen: { name: "Make a vinaigrette from scratch", how: ["Whisk 1 part acid (lemon or vinegar) with 3 parts oil", "Add salt, a little mustard and pepper", "Taste on a lettuce leaf and adjust"], q: "how to make vinaigrette from scratch" },
    sat: "One household project (45 minutes)",
    outing: "Library, then a short walk downtown",
  },
  {
    n: 9, start: "2027-01-18", kind: "normal", title: "Project 2: pillow cover",
    goal: "Sew an envelope-back pillow cover.",
    outcomes: ["Cut a front and two back panels", "Make a clean hem on the back panels", "Sew a four-sided seam with corners"],
    materials: ["½ yard cotton or linen (or a thrifted curtain)", "16-inch pillow insert", "Thread", "Pins or clips"],
    home: "living room",
    sewTitle: "Pillow cover: cut and sew",
    sewTue: ["For a 16-inch pillow, cut one front 17 × 17 inches and two back panels 17 × 12 inches", "Hem one long edge of each back panel", "Place front face up, back panels face down overlapping in the middle, and clip", "Sew all four sides with a ½-inch seam, then clip corners"],
    sewWed: ["Press the finished seams open", "Turn the cover right side out and push out corners", "Insert the pillow"],
    reading: { book: "Four Thousand Weeks", what: "Final third of the book" },
    art: "Draw a pillow or cushion from the living room, using only shapes.",
    faith: { ref: "Matthew 6:25-34", prompt: "What am I worrying about that I can set down?" },
    money: ["Talk to one person who does one of your trades (a call, message or visit)", "Write three questions in advance"],
    kitchen: { name: "Cook dry beans from scratch", how: ["Soak overnight, then drain", "Simmer in fresh water, 1–2 hours until tender", "Salt generously near the end and keep the broth"], q: "how to cook dried beans from scratch" },
    sat: "One household project (45 minutes)",
    outing: "Coffee and journaling after the library",
  },
  {
    n: 10, start: "2027-01-25", kind: "normal", title: "Finish pillow, measure for curtains",
    goal: "Finish the pillow cover and plan the curtains.",
    outcomes: ["Finish and use the pillow cover", "Measure windows accurately", "Make a curtain materials list"],
    materials: ["Pillow cover pieces", "Tape measure", "Pencil and notebook"],
    home: "entryway and mudroom",
    sewTitle: "Finish the pillow",
    sewTue: ["Finish any unfinished seams on the pillow cover", "Press everything", "Ask staff to look over a seam and give one tip"],
    sewWed: ["Measure each window width and the drop from rod to sill (or floor)", "For rod-pocket curtains, panel width is about 1.5 times the window width", "Panel length is drop plus 8 inches for hem and pocket"],
    reading: { book: "Braiding Sweetgrass", what: "Planting Sweetgrass" },
    art: "Watercolor: paint a plant in your house in three colors.",
    faith: { ref: "Psalm 19", prompt: "Where did I notice creation this week?" },
    money: ["Price out curtain fabric: thrift versus new", "Update your supply log with what you've spent so far"],
    kitchen: { name: "No-knead bread", how: ["Mix 3 cups flour, 1¼ tsp salt, ¼ tsp yeast and 1⅝ cups water", "Cover and let rise 12–18 hours", "Shape, rest, then bake in a preheated covered pot at 450°F: 30 minutes covered, 15 uncovered"], q: "no knead bread Jim Lahey" },
    sat: "Take a long walk outside with your husband",
    outing: "Visit the Museum of Nebraska Art (check admission and hours first)",
  },
  {
    n: 11, start: "2027-02-01", kind: "normal", title: "Project 3: curtains (cut and prep)",
    goal: "Buy or thrift fabric and cut the curtain panels.",
    outcomes: ["Cut panels to size", "Press and pin side hems", "Plan the rod pocket"],
    materials: ["Fabric or sheets", "Tape measure", "Scissors or rotary cutter", "Pins or clips", "Iron"],
    home: "pantry",
    sewTitle: "Curtain panels: cut and hem",
    sewTue: ["Lay out fabric, mark with chalk and cut each panel", "Press ½-inch folds on the side hems (twice)", "Pin or clip and begin sewing side hems"],
    sewWed: ["Press the top and bottom hems", "Test the rod pocket width on a scrap"],
    reading: { book: "Braiding Sweetgrass", what: "Tending Sweetgrass" },
    art: "Draw a garden bed you'd like to plant, from above.",
    faith: { ref: "Psalm 104:10-24", prompt: "What is beautiful and ordinary around me?" },
    money: ["List three ways to earn that don't depend on Fiverr or local clients", "Pick one to learn more about"],
    kitchen: { name: "Make stock from kitchen scraps", how: ["Save onion ends, carrot peels and herb stems in a bag in the freezer", "Cover with water, simmer 1–2 hours, strain", "Freeze in jars with space at the top"], q: "how to make vegetable stock from scraps" },
    sat: "Start a seed-starting list for the garden",
    outing: "Library: pick up garden books on hold",
  },
  {
    n: 12, start: "2027-02-08", kind: "normal", title: "Curtains: hems and rod pocket",
    goal: "Sew side hems and rod pockets.",
    outcomes: ["Sew long straight hems", "Sew a rod pocket", "Check the length"],
    materials: ["Cut curtain panels", "Thread", "Iron"],
    home: "linen closet",
    sewTitle: "Curtains: hems and rod pocket",
    sewTue: ["Sew side hems", "Fold and sew the top rod pocket (about 3 inches deep)", "Test that your rod fits through the pocket"],
    sewWed: ["Press everything flat", "Hand-hem the bottom if you want the curtains to hang evenly"],
    reading: { book: "Braiding Sweetgrass", what: "Picking Sweetgrass" },
    art: "Sketch your window, the view and a curtain, even if rough.",
    faith: { ref: "Luke 10:38-42", prompt: "What would be 'the better part' this week?" },
    money: ["Draft a one-page 'income experiment' idea with a clear first step", "Decide how much time and money it may use"],
    kitchen: { name: "Braise something cheap and tough", how: ["Brown the meat in a pot", "Add onion, garlic, liquid and herbs, cover", "Cook in a 300°F oven until fork-tender, 2–3 hours"], q: "how to braise a chuck roast" },
    sat: "One household project (45 minutes)",
    outing: "Library and coffee",
  },
  {
    n: 13, start: "2027-02-15", kind: "normal", title: "Finish and hang the curtains",
    goal: "Finish the curtains, hang them and review your sewing skills.",
    outcomes: ["Hang finished curtains", "Compare your first stitches to your last", "Visit the Extension office"],
    materials: ["Finished curtains", "Tension rod or rod", "Step stool"],
    home: "windows (wash and dust)",
    sewTitle: "Finish curtains",
    sewTue: ["Hem the bottoms and sew any final seams", "Press the curtains one last time", "Ask staff about the AccuQuilt for next week"],
    sewWed: ["Hang the curtains with a tension rod or your existing rod", "Stand back and take a photo for your log"],
    reading: { book: "Braiding Sweetgrass", what: "Braiding, Burning and the Epilogue. Also start Meditations, Books 1–3 (a few pages a morning)" },
    art: "Watercolor: paint something from your window view.",
    faith: { ref: "Psalm 46:10", prompt: "Where could I be still this week?" },
    money: ["Look up one low-cost class or apprenticeship near Kearney", "Check the library's newsletter for classes"],
    kitchen: { name: "Quick refrigerator pickles", how: ["Slice cucumbers or onions thin", "Heat equal parts vinegar and water with salt and sugar and pour over", "Chill; eat within a couple of weeks (this is not canning)"], q: "quick refrigerator pickles" },
    sat: "Plan your seeds and garden dates; check last-frost timing with Extension",
    outing: "Visit the Buffalo County Extension office (1400 E 34th St) or call 308-236-1235",
  },
  {
    n: 14, start: "2027-02-22", kind: "normal", title: "Project 4: AccuQuilt cutting",
    goal: "Cut quilt squares with the library's AccuQuilt.",
    outcomes: ["Cut nine 6½-inch squares", "Lay out a nine-patch design", "Plan your quilt top"],
    materials: ["Cotton shirts, sheets or scraps (pressed)", "Chalk", "Camera or phone"],
    home: "sewing area and supplies",
    sewTitle: "AccuQuilt: cut squares",
    sewTue: ["Ask staff for the 6½-inch Square die and matching mat", "Cut nine squares from your fabric", "Lay them out in a 3 × 3 pattern, take a photo, and pick your arrangement"],
    sewWed: ["Press all squares", "Arrange and re-arrange. Number them on masking tape"],
    reading: { book: "Meditations", what: "Books 4–6, a few pages each morning. Start Gilead" },
    art: "Draw your nine-patch layout in colored pencil.",
    faith: { ref: "Psalm 121", prompt: "Where do I need help this week?" },
    money: ["Take step 1 of your income experiment", "Time it. It counts toward your 2 hours"],
    kitchen: { name: "Plan canning from tested recipes", how: ["Read the Nebraska Extension and NCHFP basics before choosing a recipe", "Use only tested recipes; don't invent your own", "Make a list of equipment and jars"], q: "water bath canning basics" },
    sat: "Garden planning: sketch beds and pick vegetables",
    outing: "Library: AccuQuilt session",
  },
  {
    n: 15, start: "2027-03-01", kind: "normal", title: "Project 4: piece the mini quilt",
    goal: "Sew your nine squares into a quilt top.",
    outcomes: ["Sew squares into rows", "Press seams in alternating directions", "Join the rows"],
    materials: ["Cut squares", "Thread", "Iron"],
    home: "bedroom",
    sewTitle: "Mini quilt: piecing",
    sewTue: ["Sew squares into three rows with a ¼-inch seam", "Press seams in alternating directions", "Join the three rows"],
    sewWed: ["Press the finished top flat", "Choose backing and batting (thrifted blanket or flat sheet)"],
    reading: { book: "Gilead", what: "Second third, plus Meditations Books 7–9" },
    art: "Watercolor: three colors from your quilt on paper.",
    faith: { ref: "Philippians 4:4-9", prompt: "What am I grateful for? Name ten." },
    money: ["Take step 2 of your income experiment", "Record hours and money in the work log"],
    kitchen: { name: "Order seeds and sketch the beds", how: ["Pick 4–6 vegetables and 2–3 flowers you'll actually eat or enjoy", "Check seed-starting dates against Extension guidance", "Make an order list and a budget"], q: "how to plan a vegetable garden beginner" },
    sat: "Order seeds (or get them from the library or Extension if offered)",
    outing: "Library: final AccuQuilt or sewing session",
  },
  {
    n: 16, start: "2027-03-08", kind: "normal", title: "Finish and review the semester",
    goal: "Finish a project, photograph your work and review the semester.",
    outcomes: ["Finish the mini quilt top or table runner", "Photograph everything you made", "Decide what to keep for spring"],
    materials: ["Quilt top, backing, batting", "Camera"],
    home: "whole-house mini reset",
    sewTitle: "Finish and celebrate",
    sewTue: ["Layer, pin and quilt the mini quilt (or finish the top)", "Trim threads and bind or fold the edge", "Take photos"],
    sewWed: ["Hand-finish any edges", "Lay out all your projects: napkins, pillow, curtains and quilt"],
    reading: { book: "Gilead", what: "Finish the book, plus Meditations Books 10–12" },
    art: "Draw or paint your favorite thing you made this semester.",
    faith: { ref: "Psalm 90:12", prompt: "What did I learn about how I want to spend my days?" },
    money: ["Review your income experiment: what worked, what didn't", "Decide: keep, change or drop it"],
    kitchen: { name: "Cook your favorite recipe of the semester", how: ["Pick your best result from the 12 kitchen lessons", "Cook it for your husband", "Write what you'd do differently"], q: "comfort dinner scratch cooking" },
    sat: "Semester review prep: gather your logs and photos",
    outing: "Celebrate with coffee after the library",
  },
];

// ----------------------------------------------------------------- builders

function stretchStep(id: string): Step {
  return { id: `${id}:m3`, part: "morning", text: "Stretching + lymphatic drainage (about 20–30 min)", dyn: "stretch", links: [yt("lymphatic drainage stretching routine", "Find another routine")] };
}

function baseMorning(id: string): Step[] {
  return [
    { id: `${id}:m1`, part: "morning", text: "Wake up (8:00) and make coffee" },
    { id: `${id}:m2`, part: "morning", text: "Feed and care for the animals" },
    stretchStep(id),
    { id: `${id}:m4`, part: "morning", text: "Breakfast. Read today's lesson below" },
  ];
}

function baseEvening(id: string): Step[] {
  return [
    { id: `${id}:e1`, part: "evening", text: "Cook dinner" },
    { id: `${id}:e2`, part: "evening", text: "Evening show with your husband (protected time)" },
    { id: `${id}:e3`, part: "evening", text: "Log the day below (3 minutes), then close the laptop" },
  ];
}

type StepDef = Omit<Step, "id"> & { key: string };

function readStep(w: WeekDef): StepDef {
  const r = w.reading;
  return {
    key: "read", part: "afternoon", log: "reading",
    text: r ? `Read or listen for 30 minutes: ${r.book}` : "Read or listen for 30 minutes",
    how: r ? [r.what] : undefined,
    links: r ? [libbySearch(r.book, "Open in Libby"), catalog(r.book, "Find it at the library")] : [L.libby],
  };
}

function workStep(): StepDef {
  return { key: "work", part: "afternoon", log: "work", text: "Laptop work: two hours maximum", how: ["Set a timer, work, then close the laptop"] };
}

function normalDay(w: WeekDef, d: number): Lesson {
  const id = `w${w.n}d${d}`;
  const date = addDays(w.start, d);
  const steps: Step[] = [...baseMorning(id)];
  let title = "";
  const logs: LogKind[] = [];
  const add = (s: StepDef) => {
    steps.push({ ...s, id: `${id}:${s.key}` });
    if (s.log && !logs.includes(s.log)) logs.push(s.log);
  };
  const strength = { ...STRENGTH, key: "str", part: "afternoon" as Part, log: "movement" as LogKind };

  if (d === 0) {
    title = `Reset the ${w.home ?? "house"} and plan the week`;
    add({ key: "reserve", part: "core", text: "Reserve the library sewing machine for Tuesday", how: ["Reservations need a business day's notice, max two a week; holds are kept 15 minutes", "If the library is closed today for a holiday, reserve from the booking page or pick another day"], links: [L.reserve, L.sewPage, L.maker] });
    add({ key: "home", part: "core", text: `Home reset: ${w.home ?? "one zone"} (45-minute timer)`, how: ["Declutter, then wipe, then sweep or vacuum", "Stop when the timer ends"] });
    add({ key: "laundry", part: "core", text: "Laundry: start a load and fold one" });
    add({ key: "plan", part: "core", text: "Plan the week's meals and the town-day list", how: ["Pencil in Saturday's kitchen lesson", "Put groceries and errands on one list for Tuesday", "Note anything needed for sewing day"] });
    add({ ...strength });
    add(workStep());
  } else if (d === 1) {
    title = `Town day: ${w.sewTitle ?? "library sewing"}`;
    add({ key: "pack", part: "morning", text: "Pack the sewing bag and check the town list", how: ["Fabric, thread, chalk, tape measure, ruler, clips, a snack and water", "Your reservation confirmation", "Libby holds are ready to pick up"] });
    add({ key: "errands", part: "core", text: "Groceries and errands first (one loop only)", how: ["Do the pickup and errands in order around the route, so you drive the loop once"] });
    add({ key: "sew", part: "core", text: "Library sewing session (reserved)", how: w.sewTue, links: [L.sewPage, L.maker, yt(`${w.sewTitle ?? "sewing"} tutorial beginner`)], log: "sewing" });
    add({ key: "books", part: "afternoon", text: "Pick up holds, return books and browse", links: [L.catalogHome, L.libby, L.news] });
    add({ key: "outing", part: "afternoon", text: w.outing ?? "Treat yourself: coffee and journaling" });
    add({ key: "home", part: "afternoon", text: "Drive home and put groceries away" });
  } else if (d === 2) {
    title = `Make at home: ${w.sewTitle ?? "sewing"}`;
    add({ key: "make", part: "core", text: `Sewing prep: ${w.sewTitle ?? "today's project"}`, how: w.sewWed, links: [yt(`${w.sewTitle ?? "sewing"} tutorial beginner`)], log: "sewing" });
    add({ key: "diy", part: "core", text: "One small mending or home improvement job (30 minutes)" });
    add({ ...strength });
    add(workStep());
  } else if (d === 3) {
    title = "Reading, art and a long walk";
    add(readStep(w));
    add({ key: "art", part: "core", text: `Art for 30 minutes: ${w.art ?? "draw something"}`, links: [yt("beginner watercolor basics")] });
    add({ key: "walk", part: "afternoon", text: "Walk outside for 30–45 minutes", log: "movement", how: ["No weights today. Notice one thing in nature"] });
    add(workStep());
  } else if (d === 4) {
    title = "Money day (two hours)";
    add({ key: "money", part: "core", text: "Money tasks for this week", how: w.money, log: "work" });
    add({ key: "review", part: "core", text: "Review this week's spending and update the thrift log", log: "thrift" });
    add({ ...strength });
    add(readStep(w));
  } else if (d === 5) {
    title = `Kitchen lab: ${w.kitchen?.name ?? "scratch cooking"}`;
    add({ key: "kitchen", part: "core", text: w.kitchen ? `Cook: ${w.kitchen.name}` : "Cook something from scratch", how: w.kitchen?.how, links: w.kitchen ? [yt(w.kitchen.q)] : [], log: "kitchen" });
    add({ key: "sat", part: "afternoon", text: w.sat ?? "One household project (45 minutes)" });
    add({ key: "walk", part: "afternoon", text: "Walk or garden time outdoors with your husband", log: "movement" });
  } else {
    title = "Rest and faith";
    add({ key: "faith", part: "core", text: w.faith ? `Faith reading: ${w.faith.ref}` : "Faith reading", how: w.faith ? [w.faith.prompt] : [], links: w.faith ? [bible(w.faith.ref)] : [] });
    add({ key: "pleasure", part: "afternoon", text: "Read something for pleasure (no assignment)", links: [L.libby] });
    add({ key: "review", part: "afternoon", text: "Weekly review: 10 minutes", how: ["Open the week page and write a few lines", "Look ahead at next week"] });
  }
  steps.push(...baseEvening(id));
  const lg: LogKind[] = logs.length ? logs : [];
  return { id, weekN: w.n, dayIdx: d, date, title, theme: THEMES[d], why: WHY[d], soft: false, steps, logs: lg };
}

function softDay(w: WeekDef, d: number): Lesson {
  const id = `w${w.n}d${d}`;
  const def = w.days![d];
  const steps: Step[] = [];
  const logs: LogKind[] = [];
  if (w.kind !== "trip") steps.push(...baseMorning(id));
  else steps.push({ id: `${id}:m1`, part: "morning", text: "Coffee and a slow morning" });
  def.steps.forEach((s, i) => {
    steps.push({ id: `${id}:c${i}`, part: "core", text: s, links: i === 0 ? def.links : undefined, log: i === 0 ? def.log : undefined });
  });
  if (def.log) logs.push(def.log);
  if (w.kind !== "trip") steps.push(...baseEvening(id).filter((s) => s.id.endsWith("e2") || s.id.endsWith("e3")));
  const date = addDays(w.start, d);
  return {
    id, weekN: w.n, dayIdx: weekdayIdx(date), date, title: def.title,
    theme: w.kind === "orientation" ? "Orientation" : w.kind === "trip" ? "Vegas" : "Light day",
    why: w.kind === "orientation" ? "Small setup steps now make every later day easier." : w.kind === "trip" ? "No coursework this week. Be present." : "A lighter day so the holidays stay restful.",
    soft: true, steps, logs,
  };
}

export const course: Week[] = WEEKS.map((w) => {
  const lessons = w.days ? w.days.map((_, d) => softDay(w, d)) : Array.from({ length: 7 }, (_, d) => normalDay(w, d));
  return { n: w.n, start: w.start, title: w.title, goal: w.goal, kind: w.kind, outcomes: w.outcomes, materials: w.materials, lessons };
});

export const lessons: Lesson[] = course.flatMap((w) => w.lessons);
export const lessonById = new Map(lessons.map((l) => [l.id, l]));
export function lessonIndex(id: string) { return lessons.findIndex((l) => l.id === id); }

export function lessonForDate(iso: string): Lesson {
  if (!iso) return lessons[0];
  if (iso < COURSE_START) return lessons[0];
  return lessons.find((l) => l.date === iso) ?? lessons[lessons.length - 1];
}
