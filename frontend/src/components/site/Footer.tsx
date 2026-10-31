import Link from "next/link";
import { Mail, MapPin, Phone, CalendarClock } from "lucide-react";
import type { SiteSettings } from "@/lib/defaults";
import SmartImage from "./SmartImage";
import SocialLinks from "./SocialLinks";
import Rings from "./Rings";
import { NAV } from "@/lib/nav";

export default function Footer({ s }: { s: SiteSettings }) {
  const year = new Date().getFullYear();
  const sponsor = s.officialInfo?.find((i) => /sponsor/i.test(i.label))?.value;
  return (
    <footer className="relative overflow-hidden border-t border-line bg-cream">
      <Rings className="absolute -top-24 -right-24 h-80 w-80" opacity={0.7} />
      <div className="container-x relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-line">
              <SmartImage src={s.logo?.url} alt="" sizes="56px" fit="contain" className="p-1.5" />
            </span>
            <span className="font-display text-xl leading-tight font-semibold text-ink">{s.siteName}</span>
          </Link>
          <p className="mt-5 max-w-md leading-7 text-muted">{s.footerText}</p>
          <SocialLinks socials={s.socials} className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold tracking-wider text-ink uppercase">Quick links</h2>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted transition hover:text-brand">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-sm font-bold tracking-wider text-ink uppercase">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-muted">
            {s.contact.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <a href={`mailto:${s.contact.email}`} className="break-all hover:text-brand">{s.contact.email}</a>
              </li>
            )}
            {s.contact.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <a href={`tel:${s.contact.phone.replace(/\s/g, "")}`} className="hover:text-brand">{s.contact.phone}</a>
              </li>
            )}
            {s.contact.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <span>{s.contact.address}</span>
              </li>
            )}
            {s.contact.meetingInfo && (
              <li className="flex gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                <span>{s.contact.meetingInfo}</span>
              </li>
            )}
          </ul>
          <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-sm leading-6 text-muted">
            <p className="font-semibold text-ink">{s.district}</p>            
            {sponsor && <p>Sponsored by {sponsor}</p>}
            <p className="mt-2 border-t border-line pt-2"></p>
            <p>Technical support:</p>
            <a
              href="https://cornortech.com/"
              target="_blank"
              rel="noopener"
              className="block font-semibold text-brand hover:underline"
            >
              Cornor Tech Pvt. Ltd
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted sm:flex-row">
          <p>© {year} {s.siteName}. All rights reserved.</p>
          <p className="font-display text-base text-brand italic">{s.motto}</p>
        </div>
      </div>
    </footer>
  );
}
