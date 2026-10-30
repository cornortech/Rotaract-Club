import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    name: s.siteName,
    short_name: s.shortName || s.siteName,
    description: s.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d41367",
    icons: s.logo?.url ? [{ src: s.logo.url, sizes: "any", type: "image/png" }] : [],
  };
}
