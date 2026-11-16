import { L, bible, catalog, libbySearch, yt, type Link } from "./links";

export type ResGroup = { id: string; title: string; blurb: string; items: Link[]; facts?: string[] };

export const resourceGroups: ResGroup[] = [
  {
    id: "library", title: "Kearney Public Library", blurb: "2020 1st Avenue · main desk 308-233-3282 · tech librarian 308-233-3612",
    facts: ["Hours: Mon–Thu 9–9, Fri–Sat 9–5, Sun 1–5. Closed public holidays.", "Makerspace: reserve at least one business day ahead; two reservations a week per device; slots held 15 minutes; closed Saturday afternoons, Sundays and holidays.", "Sewing machine and AccuQuilt are free. Bring your own fabric, thread and project."],
    items: [L.reserve, L.sewPage, L.maker, L.pricing, L.accu, L.tlc, L.catalogHome, L.news, L.bookmobile, L.online, L.kanopy],
  },
  {
    id: "reading", title: "Reading & listening", blurb: "Free ebooks and audiobooks with your library card.",
    facts: ["Audiobooks: 7 or 14 days. Ebooks: 7, 14 or 21 days. No fines; loans return themselves."],
    items: [L.libby, L.libbyHelp, L.ebooks, libbySearch("My Ántonia", "My Ántonia in Libby"), libbySearch("Four Thousand Weeks", "Four Thousand Weeks in Libby"), libbySearch("Braiding Sweetgrass", "Braiding Sweetgrass in Libby"), libbySearch("Meditations Gregory Hays", "Meditations in Libby"), libbySearch("Gilead", "Gilead in Libby")],
  },
  {
    id: "sewing", title: "Sewing school", blurb: "One tutorial per lesson. These are YouTube searches so you can choose a teacher you like.",
    items: [
      yt("brother SE625 threading tutorial", "Threading a Brother machine"),
      yt("how to wind a bobbin brother sewing machine", "Winding a bobbin"),
      yt("sewing straight lines beginner tips", "Sewing straight lines"),
      yt("sewing hem beginner fold twice", "Hemming"),
      yt("how to sew cloth napkins mitered corners", "Cloth napkins with mitered corners"),
      yt("envelope pillow cover tutorial beginner", "Envelope pillow cover"),
      yt("rod pocket curtains tutorial beginner", "Rod-pocket curtains"),
      yt("nine patch quilt beginner tutorial", "Nine-patch quilt"),
      yt("accuquilt go big tutorial", "Using an AccuQuilt cutter"),
      L.accuLearn,
      catalog("The Sewing Book Alison Smith", "The Sewing Book (catalog)"),
      catalog("Martha Stewart's Encyclopedia of Sewing", "Martha Stewart's Encyclopedia of Sewing (catalog)"),
    ],
  },
  {
    id: "kitchen", title: "The resourceful kitchen", blurb: "A technique a week, plus safe preserving.",
    items: [
      catalog("Salt Fat Acid Heat", "Salt, Fat, Acid, Heat (catalog)"),
      libbySearch("Salt Fat Acid Heat", "Salt, Fat, Acid, Heat (Libby)"),
      yt("how to roast vegetables 425", "Roasting vegetables"),
      yt("how to make a pan sauce beginner", "Pan sauce"),
      yt("how to cook dried beans from scratch", "Cooking dried beans"),
      yt("no knead bread Jim Lahey", "No-knead bread"),
      yt("how to make vegetable stock from scraps", "Stock from scraps"),
      L.preserve, L.nchfp,
    ],
    facts: ["Preserving: use only tested recipes from Nebraska Extension or the National Center for Home Food Preservation."],
  },
  {
    id: "movement", title: "Movement", blurb: "Stretching and lymphatic drainage daily, strength Mon/Wed/Fri, walks.",
    items: [yt("lymphatic drainage stretching routine", "Lymphatic stretching videos"), yt("beginner dumbbell workout full body 15 lb at home", "Dumbbell workouts"), L.adriene],
  },
  {
    id: "garden", title: "Garden & Extension", blurb: "For planning summer 2027.",
    facts: ["Buffalo County Extension: 1400 E 34th St, Kearney · 308-236-1235"],
    items: [L.extension, L.preserve, yt("how to plan a vegetable garden beginner", "Garden planning basics"), catalog("Vegetable Gardener's Bible", "The Vegetable Gardener's Bible (catalog)")],
  },
  {
    id: "art", title: "Art", blurb: "Thirty minutes on Thursdays.",
    items: [yt("beginner watercolor basics", "Watercolor basics"), yt("contour drawing exercise beginner", "Contour drawing")],
  },
  {
    id: "faith", title: "Faith & reflection", blurb: "A short passage each Sunday. Adjust to your tradition.",
    items: ["Psalm 23", "Ecclesiastes 3:1-14", "Micah 6:8", "Matthew 6:25-34", "Psalm 19", "Psalm 104:10-24", "Luke 10:38-42", "Psalm 46:10", "Psalm 121", "Philippians 4:4-9", "Psalm 90:12"].map((r) => bible(r)),
  },
];

export type Supply = { group: string; items: string[] };

export const supplies: Supply[] = [
  { group: "Bring to every library sewing session", items: ["Fabric for that day's project (pre-washed and pressed)", "All-purpose thread: one neutral plus one that matches", "Fabric chalk or washable marker", "Measuring tape and a clear 6-inch ruler", "Sewing clips", "Small fabric scissors or thread snips", "A tote bag to carry it all", "The library provides scissors, pins, seam ripper, presser feet, needles and bobbins"] },
  { group: "Thrift: napkins (weeks 7–8)", items: ["Flat cotton or flannel sheet, any pattern", "Or 100% cotton or linen napkins"] },
  { group: "Thrift: pillow cover (weeks 9–10)", items: ["16-inch pillow insert", "½ yard cotton or linen, or a thrifted curtain or shirt"] },
  { group: "Thrift: curtains (weeks 11–13)", items: ["Flat sheets or ready-made curtain panels", "Tension rod or a rod you can hang without drilling"] },
  { group: "Thrift: mini quilt (weeks 14–16)", items: ["Cotton shirts, sheets or scraps for nine 6½-inch squares", "A small thrifted blanket or cotton batting", "A flat sheet for backing"] },
  { group: "At home", items: ["Iron and pressing towel or board", "Hand-sewing needles", "A box for scraps", "Two 15 lb dumbbells and a mat"] },
  { group: "Thrift smart", items: ["Choose cotton, linen or flannel. Skip stretchy or slippery fabric at first", "Flat sheets, not fitted", "Check for stains, holes and smells; wash hot before cutting"] },
];
