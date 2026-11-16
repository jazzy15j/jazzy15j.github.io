export type Book = { id: string; title: string; author: string; kind: string; why: string; when: string };

export const books: Book[] = [
  { id: "antonia", title: "My Ántonia", author: "Willa Cather", kind: "Fiction (Nebraska)", why: "Prairie life, set in Nebraska. Lovely on audio while you clean.", when: "Weeks 1–4" },
  { id: "weeks", title: "Four Thousand Weeks", author: "Oliver Burkeman", kind: "Philosophy", why: "A kind argument against constant productivity.", when: "Weeks 5–7" },
  { id: "sweetgrass", title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", kind: "Nature and perspectives", why: "Gardening, gratitude and Indigenous ways of seeing.", when: "Weeks 8–11" },
  { id: "meditations", title: "Meditations (Gregory Hays translation)", author: "Marcus Aurelius", kind: "Philosophy", why: "A few pages each morning, slowly.", when: "Weeks 11–14" },
  { id: "gilead", title: "Gilead", author: "Marilynne Robinson", kind: "Fiction (faith)", why: "Quiet, spiritual, beautifully written.", when: "Weeks 12–14" },
  { id: "sewingbook", title: "The Sewing Book", author: "Alison Smith", kind: "Sewing reference", why: "Illustrated basics. The library's makerspace page lists it. Use it as a reference.", when: "All semester" },
  { id: "sfah", title: "Salt, Fat, Acid, Heat", author: "Samin Nosrat", kind: "Cooking", why: "Learn why food works so you can cook without recipes.", when: "Saturdays" },
  { id: "vgb", title: "The Vegetable Gardener's Bible", author: "Edward C. Smith", kind: "Gardening", why: "For the February garden-planning weeks.", when: "Weeks 9–13" },
  { id: "msencyc", title: "Martha Stewart's Encyclopedia of Sewing", author: "Martha Stewart Living", kind: "Sewing reference (library list)", why: "Listed on the library's makerspace page.", when: "Optional" },
  { id: "cmos", title: "The Complete Manual of Sewing", author: "", kind: "Sewing reference (library list)", why: "Listed on the library's makerspace page.", when: "Optional" },
];
