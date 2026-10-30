import type { MetadataRoute } from "next";
import { getAllEvents } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const events = await getAllEvents();
  const pages = ["", "/about", "/team", "/events", "/gallery", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: (p === "" || p === "/events" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: e.updatedAt ? new Date(e.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
