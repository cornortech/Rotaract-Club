import { connectDB } from "../config/db.js";
import { Event, GalleryItem, HeroSlide, Settings, TeamMember } from "../models/index.js";
import { DEFAULT_EVENTS, DEFAULT_GALLERY, DEFAULT_HERO_SLIDES, DEFAULT_SETTINGS, DEFAULT_TEAM } from "../data/defaults.js";
import { slugify } from "./helpers.js";

const isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);

/** Merge saved settings over defaults, so new fields always have a value. */
export function deepMerge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined || over === null ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = isObj(base[k]) ? deepMerge(base[k], over[k]) : over[k] ?? base[k];
  return out;
}

export const plain = (v) => JSON.parse(JSON.stringify(v));

/** First run: create the settings and starter content (exactly once). */
let seeded = false;
export async function ensureSeed() {
  if (seeded) return;
  await connectDB();
  const res = await Settings.updateOne({ _id: "site" }, { $setOnInsert: { data: DEFAULT_SETTINGS } }, { upsert: true });
  if (res.upsertedCount) {
    await Promise.all([
      HeroSlide.insertMany(DEFAULT_HERO_SLIDES),
      Event.insertMany(DEFAULT_EVENTS),
      TeamMember.insertMany(DEFAULT_TEAM),
      GalleryItem.insertMany(DEFAULT_GALLERY),
    ]);
  }
  seeded = true;
}

export async function loadSettings() {
  await ensureSeed();
  const doc = await Settings.findById("site").lean();
  return deepMerge(DEFAULT_SETTINGS, plain(doc?.data ?? {}));
}

export async function uniqueSlug(model, wanted, excludeId) {
  const base = slugify(wanted) || "event";
  let slug = base;
  for (let i = 2; await model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); i++) slug = `${base}-${i}`;
  return slug;
}

/** All Cloudinary ids inside a value (to delete images that were removed). */
export function collectPublicIds(value) {
  const ids = [];
  const walk = (v) => {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      if (typeof v.publicId === "string" && v.publicId) ids.push(v.publicId);
      Object.values(v).forEach(walk);
    }
  };
  walk(value);
  return ids;
}

export function externalImageCount(values) {
  let n = 0;
  const walk = (v) => {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      if (typeof v.url === "string" && /^https?:\/\//.test(v.url) && !v.url.includes("res.cloudinary.com")) n++;
      Object.values(v).forEach(walk);
    }
  };
  values.forEach(walk);
  return n;
}
