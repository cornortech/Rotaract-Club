import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { SiteSettings } from "@/lib/defaults";
import { paragraphs } from "@/lib/utils";
import SmartImage from "@/components/site/SmartImage";
import Reveal from "@/components/site/Reveal";

export default function PresidentMessage({ s, full = false }: { s: SiteSettings; full?: boolean }) {
  const p = s.president;
  const paras = paragraphs(p.message);
  const shown = full ? paras : paras.slice(0, 2);
  return (
    <section id="president" className="scroll-mt-24 overflow-hidden bg-gradient-to-b from-white via-brand-50/60 to-white py-20 sm:py-28">
      <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-3 -rotate-3 rounded-[2.25rem] bg-gold-100" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-line">
              <SmartImage src={p.photo?.url} alt={`${p.name}, ${p.role}`} sizes="(max-width: 1024px) 90vw, 40vw" />
            </div>
            <div className="absolute -right-3 -bottom-5 rounded-2xl bg-white px-5 py-3 shadow-lift ring-1 ring-line sm:-right-6">
              <p className="font-display text-lg leading-tight font-semibold text-ink">{p.name}</p>
              <p className="text-sm text-brand">
                {p.role}
                {p.year ? ` · ${p.year}` : ""}
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={120}>
          <p className="eyebrow">Message from the President</p>
          <Quote className="mt-6 h-10 w-10 text-gold" aria-hidden />
          <h2 className="h-display mt-3 text-3xl leading-tight sm:text-4xl">{p.greeting}</h2>
          <div className="prose-club mt-6">
            {shown.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <div className="mt-2 border-l-4 border-brand pl-4">
            <p className="font-semibold text-ink">{p.name}</p>
            <p className="text-sm text-muted">
              {p.role}
              {p.year ? `, ${p.year}` : ""}
            </p>
            {p.signoff && <p className="text-sm text-muted">{p.signoff}</p>}
          </div>
          {!full && paras.length > 2 && (
            <Link href="/about#president" className="link-arrow mt-6">
              Read the full message <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
