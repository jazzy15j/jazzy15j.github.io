// Content for "My Life Curriculum — Age 30". Facts come from Jasmine's own
// document; anything marked `draft` is a suggestion for her to edit.

export const vision = [
  "A slow, intentional, creative, spiritually grounded, financially resourceful life.",
  "Healthy, active, well-read, thoughtful, well-spoken, at peace, close to nature, able to make and repair things.",
  "Enjoy everyday life instead of constantly chasing work or productivity.",
];

export const philosophy = "Build a life worth living first. Then build an income that fits inside it.";

export const idealDay = [
  "Wake up and make coffee",
  "Feed and care for the animals",
  "Stretch, yoga, breakfast",
  "Room for walking, reading, journaling, writing, drawing, painting, learning",
  "Laptop work: two hours maximum",
  "Homemaking, cleaning, gardening or a creative project",
  "Cook dinner, relax with my husband, evening shows",
  "No rushing, no overbooking, no unnecessary obligations",
];

export const values = [
  "Freedom & independence",
  "Faith, spiritual exploration, connection with the universe",
  "Nature, mindfulness, gratitude",
  "Thoughtfulness for other perspectives",
  "Humor, laughter, wit",
  "Creativity & lifelong learning",
  "Financial resourcefulness",
  "Health, strength, inner peace",
  "Time with my husband",
  "Finishing meaningful hands-on projects",
];

export type Pillar = { n: number; name: string; blurb: string; focus: string[] };

export const pillars: Pillar[] = [
  { n: 1, name: "The Art of Slow Mornings", blurb: "Gentle routines, coffee, movement, animal care, and reflection.", focus: ["Coffee", "Animals", "Stretch & yoga", "Reflection"] },
  { n: 2, name: "The Handmade Home", blurb: "Sewing, quilting, woodworking, home improvements, and practical skills.", focus: ["Sewing", "Woodworking", "Renter-friendly DIY"] },
  { n: 3, name: "The Cottage Garden & Pantry", blurb: "Gardening, growing food, flowers, and preservation.", focus: ["Vegetables, flowers, pumpkins", "Safe preserving"] },
  { n: 4, name: "The Resourceful Kitchen", blurb: "Cooking, budgeting, meal planning, and food skills.", focus: ["Scratch cooking", "Meal planning", "Less food waste"] },
  { n: 5, name: "The Strong & Grounded Woman", blurb: "Physical health, strength, yoga, walking, and nature.", focus: ["Yoga", "Walking", "Strength", "Outdoors"] },
  { n: 6, name: "The Creative Mind", blurb: "Art, writing, journaling, and curiosity.", focus: ["Watercolor", "Drawing", "Writing", "Journaling"] },
  { n: 7, name: "The Well-Read Woman", blurb: "Reading, learning, communication, and different perspectives.", focus: ["Fiction", "History", "Philosophy", "Nature"] },
  { n: 8, name: "Faith, Spirituality & Inner Peace", blurb: "Prayer, reflection, gratitude, and spiritual exploration.", focus: ["Prayer", "Meditation", "Gratitude", "Nature reflection"] },
  { n: 9, name: "The Curious Explorer", blurb: "Intentional outings, new experiences, museums, libraries, thrifting, and travel.", focus: ["Library", "Museums", "Thrifting", "Travel"] },
  { n: 10, name: "The Freedom-Funded Life", blurb: "Personal finance, sustainable earnings, and hands-on income experiments.", focus: ["Budgeting", "Income", "Trade experiments"] },
];

export type Day = { day: string; theme: string; ideas: string[] };

// Proposed, not confirmed. The page lets her edit nothing here on purpose:
// the real week is whatever she actually does, tracked in the Journal.
export const week: Day[] = [
  { day: "Monday", theme: "Home reset", ideas: ["Deep clean one zone", "Laundry", "Meal planning", "Budgeting"] },
  { day: "Tuesday", theme: "Town day", ideas: ["Grocery pickup", "Library", "Thrifting or museum", "Coffee & journaling"] },
  { day: "Wednesday", theme: "Make something", ideas: ["Sewing", "Woodworking", "Renovation project"] },
  { day: "Thursday", theme: "Mind & body", ideas: ["Reading", "Spiritual study", "Art", "Nature", "Learning"] },
  { day: "Friday", theme: "Money day", ideas: ["Financial review", "Income experiments", "Business upkeep"] },
  { day: "Saturday", theme: "Garden & home", ideas: ["Gardening", "Household projects", "Cooking", "Time with my husband"] },
  { day: "Sunday", theme: "Rest", ideas: ["Faith", "Reflection", "Reading", "Gentle weekly planning"] },
];

export const townTripRules = [
  "One town day a week (Tuesday) — no extra trips unless something is genuinely needed.",
  "Plan the route before leaving: pickup and errands first, then the enjoyable stop.",
  "Pair the trip with one treat: library, thrift store, coffee shop, museum, or a walk.",
  "Keep a running errands list on the fridge so nothing triggers a second trip.",
  "Bring a book and journal; a laptop only if it's a focused-work coffee shop day.",
];

export type Task = { id: string; text: string };
export type Phase = { id: string; month: string; title: string; tasks: Task[] };

export const first90: Phase[] = [
  {
    id: "dec",
    month: "December 2026",
    title: "Foundation",
    tasks: [
      { id: "dec-1", text: "Establish an enjoyable morning routine" },
      { id: "dec-2", text: "Begin a manageable movement practice" },
      { id: "dec-3", text: "Start a personal curriculum journal" },
      { id: "dec-4", text: "Inventory sewing supplies and choose a beginner project" },
    ],
  },
  {
    id: "jan",
    month: "January 2027",
    title: "Learning",
    tasks: [
      { id: "jan-1", text: "Learn basic sewing machine skills" },
      { id: "jan-2", text: "Complete one handmade household item" },
      { id: "jan-3", text: "Explore one new cooking technique each week" },
      { id: "jan-4", text: "Establish consistent reading and reflection" },
    ],
  },
  {
    id: "feb",
    month: "February 2027",
    title: "Independence",
    tasks: [
      { id: "feb-1", text: "Plan the 2027 vegetable and flower garden" },
      { id: "feb-2", text: "Finish one renter-friendly home improvement" },
      { id: "feb-3", text: "Explore one hands-on earning opportunity" },
      { id: "feb-4", text: "Review which routines, experiences and hobbies truly improved my life" },
    ],
  },
];

// DRAFT: one suggested shape for the rest of the year. Planting dates depend on
// her local frost dates, so those lines are deliberately loose.
export const seasons: { months: string; season: string; lean: string; draft: string[] }[] = [
  { months: "Dec 2026 – Feb 2027", season: "Winter", lean: "Indoor making & learning", draft: ["Sewing basics → first household item", "Garden planning on paper", "Cooking technique a week", "Library & reading rhythm"] },
  { months: "Mar – May 2027", season: "Spring", lean: "Start growing", draft: ["Start seeds indoors (check local last-frost date)", "Build something simple: a shelf or a garden bed", "First hands-on trade experiment finished and reviewed", "More walking, more outside"] },
  { months: "Jun – Aug 2027", season: "Summer", lean: "Garden & preserve", draft: ["Tend the vegetable garden", "Learn safe water-bath canning with tested recipes", "Early-morning outdoor movement", "Light evenings with my husband"] },
  { months: "Sep – Nov 2027", season: "Autumn", lean: "Harvest & settle in", draft: ["Pumpkins and fall harvest", "Preserve what's left", "Quilt or larger sewing project", "Review the year; decide what to keep"] },
  { months: "Dec 2027", season: "Winter", lean: "Reflect", draft: ["Year-end review against the success measures", "Write next year's curriculum"] },
];

export const successMeasures = [
  "Quality of life",
  "Skills learned",
  "Relationships",
  "Health",
  "Experiences",
  "Financial stability",
];

export const principles = [
  "My life comes first; work fits around it.",
  "Don't confuse constant productivity with fulfillment.",
  "Leave unscheduled time for rest, spontaneity and enjoyment.",
  "Rotate interests instead of practicing everything daily.",
  "Shift seasonally: garden and preserve when warm, make and learn when cold.",
  "Protect time for my marriage and evenings at home.",
  "Don't turn every enjoyable thing into an income opportunity.",
  "Try a trade before buying equipment or training.",
];

export type Decision = { id: string; question: string; options?: string[] };

export const decisions: Decision[] = [
  { id: "structure", question: "How much daily structure do I want?", options: ["Loose (a few anchors)", "Medium (morning + one focus)", "Full schedule"] },
  { id: "skill", question: "Which hands-on skill first?", options: ["Sewing", "Woodworking", "Home improvement", "Gardening", "Preserving"] },
  { id: "learning", question: "How do I like to learn?", options: ["Books", "Video tutorials", "Classes", "Trial and error", "A mix"] },
  { id: "exercise", question: "Favorite exercise?" },
  { id: "income", question: "What should generate income?", options: ["Handmade products", "Skilled services", "Existing business only", "Something else"] },
  { id: "target", question: "Is $2,500 gross, net, or additional?", options: ["Gross revenue", "Take-home after tax", "Additional to current income"] },
  { id: "existing", question: "How much must the existing business keep producing?" },
  { id: "budget", question: "Learning & project budget per month?" },
  { id: "balance", question: "How do I avoid overscheduling my interests?" },
];

export const dailyPrompts = [
  "What made today feel like mine?",
  "What did I make, fix, grow, read or learn?",
  "What am I grateful for?",
  "Where did I rush, and what would slow it down?",
];
