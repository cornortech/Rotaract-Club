import "server-only";
import { cache } from "react";
import { backendUrl } from "./backend";
import { DEFAULT_EVENTS, DEFAULT_GALLERY, DEFAULT_HERO_SLIDES, DEFAULT_SETTINGS, DEFAULT_TEAM, type Img, type SiteSettings } from "./defaults";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  date: string | null;
  time: string;
  location: string;
  summary: string;
  content: string;
  coverImage: Img;
  images: Img[];
  collaborators: string;
  featured: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
};
export type TeamItem = {
  _id: string;
  name: string;
  role: string;
  group: "board" | "leader";
  year: string;
  photo: Img;
  bio: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  linkedin: string;
};
export type GalleryEntry = { _id: string; image: Img; caption: string; album: string };
export type PartnerItem = { _id: string; name: string; logo: Img; url: string };
export type HeroSlideItem = { _id: string; image: Img; title: string; caption: string };

type SiteData = {
  settings: SiteSettings;
  slides: HeroSlideItem[];
  events: EventItem[];
  team: TeamItem[];
  gallery: GalleryEntry[];
  partners: PartnerItem[];
};

const fake = (arr: any[], prefix: string) => arr.map((x, i) => ({ _id: `${prefix}-${i}`, ...x }));
const FALLBACK: SiteData = {
  settings: DEFAULT_SETTINGS,
  slides: fake(DEFAULT_HERO_SLIDES, "slide"),
  events: fake(DEFAULT_EVENTS, "event"),
  team: fake(DEFAULT_TEAM, "team"),
  gallery: fake(DEFAULT_GALLERY, "gallery"),
  partners: [],
};

/**
 * All website content comes from the backend in one request.
 * Cached for 5 minutes, and refreshed instantly when the admin saves something.
 * If the backend can't be reached, the starter content is shown instead of an error.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${backendUrl()}/api/public/site`, {
        next: { revalidate: 300, tags: ["site"] },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`Backend responded ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Backend error");
      return json.data as SiteData;
    } catch (e) {
      if (attempt === 1) console.error("[data] backend not reachable, showing starter content:", (e as Error).message);
    }
  }
  return FALLBACK;
});

export const getSettings = async () => (await getSiteData()).settings;
export const getHeroSlides = async () => (await getSiteData()).slides;
export const getAllEvents = async () => (await getSiteData()).events;

export async function getEvents(limit = 0) {
  const events = [...(await getAllEvents())].sort((a, b) => Number(b.featured) - Number(a.featured));
  return limit ? events.slice(0, limit) : events;
}

export async function getEvent(slug: string) {
  return (await getAllEvents()).find((e) => e.slug === slug) ?? null;
}

export async function getTeam() {
  const all = (await getSiteData()).team;
  return {
    board: all.filter((m) => m.group !== "leader"),
    leaders: all.filter((m) => m.group === "leader").sort((a, b) => (b.year || "").localeCompare(a.year || "")),
  };
}

export async function getGallery(limit = 0) {
  const g = (await getSiteData()).gallery;
  return limit ? g.slice(0, limit) : g;
}

export const getPartners = async () => (await getSiteData()).partners;
