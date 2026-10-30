import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Handshake, MapPin, Tag } from "lucide-react";
import { getAllEvents, getEvent, getSettings } from "@/lib/data";
import SmartImage from "@/components/site/SmartImage";
import ShareButtons from "@/components/site/ShareButtons";
import EventPhotos from "@/components/site/EventPhotos";
import EventCard from "@/components/site/EventCard";
import JsonLd from "@/components/site/JsonLd";
import { formatDate, paragraphs, siteUrl } from "@/lib/utils";

export const revalidate = 3600;
type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await getEvent((await params).slug);
  if (!e) return { title: "Event not found", robots: { index: false } };
  const img = e.coverImage?.url;
  return {
    title: e.title,
    description: e.summary?.slice(0, 160),
    alternates: { canonical: `/events/${e.slug}` },
    openGraph: { type: "article", title: e.title, description: e.summary, url: `/events/${e.slug}`, images: img ? [{ url: img }] : undefined },
    twitter: { card: "summary_large_image", title: e.title, description: e.summary, images: img ? [img] : undefined },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const [e, s, all] = await Promise.all([getEvent(slug), getSettings(), getAllEvents()]);
  if (!e) notFound();
  const url = `${siteUrl()}/events/${e.slug}`;
  const related = all.filter((x) => x.slug !== e.slug).slice(0, 3);
  const photos = (e.images || []).filter((i) => i?.url);

  const meta = [
    e.date && { Icon: CalendarDays, label: "Date", value: formatDate(e.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    e.time && { Icon: Clock, label: "Time", value: e.time },
    e.location && { Icon: MapPin, label: "Location", value: e.location },
    e.category && { Icon: Tag, label: "Type", value: e.category },
  ].filter(Boolean) as { Icon: typeof Clock; label: string; value: string }[];

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50/70 via-white to-white">
        <div className="container-x py-10 sm:py-14">
          <Link href="/events" className="link-arrow !text-muted hover:!text-brand">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All events
          </Link>
          <div className="mt-6 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">{e.category}</p>
              <h1 className="h-display mt-3 text-4xl leading-tight sm:text-5xl">{e.title}</h1>
              {e.summary && <p className="mt-5 text-lg leading-8 text-muted">{e.summary}</p>}
            </div>
            <dl className="grid gap-3 sm:grid-cols-2 lg:col-span-5">
              {meta.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                  <div>
                    <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</dt>
                    <dd className="font-semibold text-ink">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="container-x py-12 sm:py-16">
        {e.coverImage?.url && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-line">
            <SmartImage src={e.coverImage.url} alt={e.title} priority sizes="(max-width: 1280px) 100vw, 1200px" />
          </div>
        )}
        <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="prose-club">
              {paragraphs(e.content || e.summary).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {photos.length > 0 && (
              <section className="mt-10" aria-labelledby="photos">
                <h2 id="photos" className="h-display mb-5 text-2xl">Photos</h2>
                <EventPhotos images={photos} title={e.title} />
              </section>
            )}
          </div>
          <aside className="space-y-4 lg:col-span-4">
            {e.collaborators && (
              <div className="rounded-3xl border border-gold-100 bg-gold-50 p-6">
                <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-gold-700 uppercase">
                  <Handshake className="h-4 w-4" aria-hidden /> In collaboration with
                </p>
                <ul className="mt-3 space-y-1.5">
                  {e.collaborators.split(",").map((c) => (
                    <li key={c} className="font-semibold text-ink">{c.trim()}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-3xl border border-line bg-white p-6">
              <ShareButtons url={url} title={e.title} />
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-cream py-16 sm:py-20">
          <div className="container-x">
            <h2 className="h-display mb-8 text-3xl">More from the club</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <EventCard key={r._id} e={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          description: e.summary,
          image: e.coverImage?.url ? [e.coverImage.url] : undefined,
          startDate: e.date || undefined,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: e.location ? { "@type": "Place", name: e.location, address: e.location } : undefined,
          organizer: { "@type": "Organization", name: s.siteName, url: siteUrl() },
          url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
            { "@type": "ListItem", position: 2, name: "Events", item: `${siteUrl()}/events` },
            { "@type": "ListItem", position: 3, name: e.title, item: url },
          ],
        }}
      />
    </article>
  );
}
