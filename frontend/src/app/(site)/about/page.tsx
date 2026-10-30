import type { Metadata } from "next";
import { Eye, Target } from "lucide-react";
import { getSettings, getTeam } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import SmartImage from "@/components/site/SmartImage";
import Reveal from "@/components/site/Reveal";
import SectionHeading from "@/components/site/SectionHeading";
import Pillars from "@/components/sections/Pillars";
import PresidentMessage from "@/components/sections/PresidentMessage";
import ThemeSection from "@/components/sections/ThemeSection";
import CtaBand from "@/components/sections/CtaBand";
import { paragraphs } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "About Us",
    description: `${s.siteName}: our story, mission, vision and official club information. ${s.district}.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [s, team] = await Promise.all([getSettings(), getTeam()]);
  return (
    <>
      <PageHeader eyebrow="About us" title={s.siteName} text={s.tagline} />

      <section className="py-20 sm:py-24">
        <div className="container-x grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Who we are</p>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">{s.aboutTitle}</h2>
            <div className="prose-club mt-6">
              {paragraphs(s.aboutIntro).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-line">
              <SmartImage src={s.aboutImage?.url} alt={s.siteName} sizes="(max-width: 1024px) 100vw, 40vw" />
            </div>
          </Reveal>
        </div>
      </section>

      {s.officialInfo?.length > 0 && (
        <section className="pb-20 sm:pb-24">
          <div className="container-x">
            <div className="rounded-[2rem] border border-line bg-cream p-6 sm:p-10">
              <h2 className="h-display text-2xl sm:text-3xl">Official club information</h2>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {s.officialInfo.map((f) => (
                  <div key={f.label} className="rounded-2xl border border-line bg-white p-5">
                    <dt className="text-xs font-bold tracking-wider text-brand uppercase">{f.label}</dt>
                    <dd className="mt-2 font-display text-lg leading-snug font-semibold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      <section className="pb-20 sm:pb-24">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-[2rem] border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm">
                <Target className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="h-display mt-6 text-3xl">Our mission</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{s.mission}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-[2rem] border border-gold-100 bg-gradient-to-br from-gold-50 to-white p-8 sm:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-gold-700 shadow-sm">
                <Eye className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="h-display mt-6 text-3xl">Our vision</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{s.vision}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          <SectionHeading eyebrow="What we do" title="Four ways we grow together" center />
          <Pillars pillars={s.pillars} />
        </div>
      </section>

      <PresidentMessage s={s} full />
      <ThemeSection s={s} />

      {team.leaders.length > 0 && (
        <section className="pb-20 sm:pb-24">
          <div className="container-x">
            <SectionHeading eyebrow="Our leaders" title="Presidents who led the way" link={{ href: "/team#leaders", label: "See all leaders" }} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.leaders.slice(0, 6).map((l) => (
                <li key={l._id} className="card flex items-center gap-4 p-4">
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                    <SmartImage src={l.photo?.url} alt={l.name} sizes="64px" fallback={<span className="font-display text-lg text-brand">{l.name.replace(/^Rtr\.?\s*/i, "")[0]}</span>} />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{l.name}</span>
                    <span className="block text-sm text-muted">
                      {l.role}
                      {l.year ? ` · RY ${l.year}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand s={s} />
    </>
  );
}
