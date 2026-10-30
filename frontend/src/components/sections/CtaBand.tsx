import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/defaults";
import Rings from "@/components/site/Rings";

export default function CtaBand({ s }: { s: SiteSettings }) {
  return (
    <section className="pb-20 sm:pb-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-gold-50 px-6 py-14 text-center sm:px-12 sm:py-20">
          <Rings className="absolute -top-16 -left-16 h-64 w-64" />
          <Rings className="absolute -right-20 -bottom-20 h-72 w-72" />
          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow">{s.motto}</p>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl">{s.ctaTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{s.ctaText}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Contact us <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/events" className="btn-outline">
                See what we do
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
