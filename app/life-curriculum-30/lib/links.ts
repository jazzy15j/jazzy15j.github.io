// Every link used by the course. Library URLs were taken from the library's own pages.
export type Link = { label: string; href: string; note?: string };

const cok = (p: string) => `https://www.cityofkearney.org/${p}`;
const enc = encodeURIComponent;

export const yt = (q: string, label = "Watch a tutorial"): Link => ({
  label,
  href: `https://www.youtube.com/results?search_query=${enc(q)}`,
  note: "YouTube search",
});
export const bible = (ref: string): Link => ({
  label: `Read ${ref}`,
  href: `https://www.biblegateway.com/passage/?search=${enc(ref)}&version=NIV`,
});
export const catalog = (title: string, label = "Find in the library catalog"): Link => ({
  label,
  href: `https://kear.ent.sirsi.net/client/en_US/default/search/results?qu=${enc(title)}`,
});
export const libbySearch = (title: string, label = "Search in Libby"): Link => ({
  label,
  href: `https://libbyapp.com/search/nebraska/search/query-${enc(title)}/page-1`,
});

export const L = {
  reserve: { label: "Reserve the sewing machine", href: "https://kearney.events.mylibrary.digital/browse-resources?l=109", note: "Library booking page" },
  sewPage: { label: "Sewing machine page", href: cok("2015/Sewing-Machine"), note: "Brother SE625 · free" },
  accu: { label: "AccuQuilt page and die list", href: cok("2067/AccuQuilt") },
  accuLearn: { label: "AccuQuilt: learn to quilt", href: "https://www.accuquilt.com/learntoquilt" },
  maker: { label: "Makerspace rules and hours", href: cok("2010/Makerspace") },
  pricing: { label: "Makerspace pricing and policy", href: cok("2221/Pricing-Policy") },
  tlc: { label: "Technology Learning Center", href: cok("2243/Technology-Learning-Center") },
  ebooks: { label: "Library eBooks and Libby help", href: cok("1709/eBooks") },
  online: { label: "Library online learning", href: cok("1855/Online-Learning") },
  bookmobile: { label: "Bookmobile", href: cok("1497/Bookmobile") },
  news: { label: "Library newsletters and events", href: cok("1777/Newsletters") },
  catalogHome: { label: "Library catalog", href: "https://kear.ent.sirsi.net/client/en_US/default/?" },
  libby: { label: "Open Libby (Nebraska)", href: "https://libbyapp.com/library/nebraska" },
  libbyHelp: { label: "Libby help", href: "https://help.libbyapp.com/" },
  kanopy: { label: "Kanopy film streaming", href: "http://cityofkearney.kanopy.com/" },
  vegas: { label: "Open your Vegas trip planner", href: "/vegas-birthday-30" },
  extension: { label: "Nebraska Extension, Buffalo County", href: "https://extension.unl.edu/statewide/buffalo/" },
  preserve: { label: "Nebraska food preservation", href: "https://food.unl.edu/food-preservation" },
  nchfp: { label: "National Center for Home Food Preservation", href: "https://nchfp.uga.edu/" },
  adriene: { label: "Yoga With Adriene", href: "https://yogawithadriene.com/" },
} satisfies Record<string, Link>;
