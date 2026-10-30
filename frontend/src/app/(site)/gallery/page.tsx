import type { Metadata } from "next";
import { getGallery, getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import GalleryGrid from "@/components/site/GalleryGrid";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Gallery",
    description: `Photos from the projects, events and fellowship of the ${s.siteName}.`,
    alternates: { canonical: "/gallery" },
  };
}

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Moments that matter" text="Snapshots from our service projects, events and fellowship." />
      <section className="py-16 sm:py-20">
        <div className="container-x">
          {items.length ? <GalleryGrid items={items} /> : <p className="rounded-3xl border border-dashed border-line p-10 text-center text-muted">Photos are coming soon.</p>}
        </div>
      </section>
    </>
  );
}
