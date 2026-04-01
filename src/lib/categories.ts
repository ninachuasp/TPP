export const CATEGORIES = [
  "Theatre & Drama",
  "Music & Concerts",
  "Dance",
  "Visual Arts",
  "Film & Media",
  "Literary Arts",
  "Heritage & Culture",
  "Festivals",
  "Workshops & Classes",
  "Comedy",
  "Photography",
  "Craft & Design",
] as const;

export type Category = (typeof CATEGORIES)[number];
