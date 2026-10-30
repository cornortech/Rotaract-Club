import type { Metadata } from "next";
import { CalendarClock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import ContactForm from "@/components/site/ContactForm";
import SocialLinks from "@/components/site/SocialLinks";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Contact Us",
    description: `Get in touch with the ${s.siteName} — partnerships, projects and questions.`,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const s = await getSettings();
  const c = s.contact;
  const items = [
    c.email && { Icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && { Icon: Phone, label: "Phone", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
    c.address && { Icon: MapPin, label: "Address", value: c.address },
    c.meetingInfo && { Icon: CalendarClock, label: "Meetings", value: c.meetingInfo },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHeader eyebrow="Contact" title="Let’s talk" text="Have a question, a project idea or want to partner with us? Send us a message and our team will reply." />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {items.map(({ Icon, label, value, href }) => (
              <div key={label} className="card flex items-start gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-wider text-muted uppercase">{label}</p>
                  {href ? (
                    <a href={href} className="mt-1 block font-semibold break-words text-ink hover:text-brand">{value}</a>
                  ) : (
                    <p className="mt-1 font-semibold text-ink">{value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="card p-5">
              <p className="text-xs font-bold tracking-wider text-muted uppercase">{s.district}</p>
              <p className="mt-1 font-display text-lg text-brand italic">{s.motto}</p>
              <SocialLinks socials={s.socials} className="mt-4" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
        {c.mapUrl && (
          <div className="container-x mt-12">
            <div className="overflow-hidden rounded-[2rem] border border-line shadow-soft">
              <iframe
                src={c.mapUrl}
                title={`Map: ${c.address || s.siteName}`}
                className="h-[380px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
