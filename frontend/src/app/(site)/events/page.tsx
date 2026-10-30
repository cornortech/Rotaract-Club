import type { Metadata } from "next";
import { getAllEvents, getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import EventsBrowser from "@/components/site/EventsBrowser";
import CtaBand from "@/components/sections/CtaBand";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Events & Projects",
    description: `Service projects, events and activities of the ${s.siteName} in Butwal, Nepal.`,
    alternates: { canonical: "/events" },
  };
}

export default async function EventsPage() {
  const [s, events] = await Promise.all([getSettings(), getAllEvents()]);
  return (
    <>
      <PageHeader eyebrow="Events & projects" title="Service in action" text="From community projects to skill-building sessions — here is what our club has been doing." />
      <section className="py-16 sm:py-20">
        <div className="container-x">
          {events.length ? <EventsBrowser events={events} /> : <p className="rounded-3xl border border-dashed border-line p-10 text-center text-muted">Events will appear here soon.</p>}
        </div>
      </section>
      <CtaBand s={s} />
    </>
  );
}
