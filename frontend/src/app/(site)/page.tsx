import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";
import { getEvents, getGallery, getHeroSlides, getPartners, getSettings, getTeam } from "@/lib/data";
import HeroSlider from "@/components/site/HeroSlider";
import SmartImage from "@/components/site/SmartImage";
import Reveal from "@/components/site/Reveal";
import Rings from "@/components/site/Rings";
import SectionHeading from "@/components/site/SectionHeading";
import EventCard from "@/components/site/EventCard";
import TeamCard from "@/components/site/TeamCard";
import GalleryGrid from "@/components/site/GalleryGrid";
import Pillars from "@/components/sections/Pillars";
import PresidentMessage from "@/components/sections/PresidentMessage";
import ThemeSection from "@/components/sections/ThemeSection";
import CtaBand from "@/components/sections/CtaBand";

export const revalidate = 3600;

export default async function HomePage() {
  const [s, slides, events, team, gallery, partners] = await Promise.all([
    getSettings(),
    getHeroSlides(),
    getEvents(3),
    getTeam(),
    getGallery(6),
    getPartners(),
  ]);
  const heroSlides = slides.length ? slides : [{ _id: "main", image: s.heroImage, title: s.motto, caption: s.siteName }];
  const stats = (s.stats || []).filter((x) => x.value?.trim());
  const facts = (s.officialInfo || []).slice(0, 2);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
        <Rings className="absolute -top-32 -left-32 h-[28rem] w-[28rem] opacity-70" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#f2d6e2_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pt-16 lg:pb-24">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-1.5 text-xs font-bold tracking-wide text-brand shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden />
              {s.heroEyebrow}
            </p>
            <h1 className="h-display mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem]">
              {s.heroTitle} <span className="relative whitespace-nowrap text-brand italic">
                {s.heroHighlight}
                <svg viewBox="0 0 300 16" className="absolute -bottom-2 left-0 h-3 w-full text-gold" aria-hidden preserveAspectRatio="none">
                  <path d="M2 12 C 80 2, 200 2, 298 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{s.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {s.heroPrimaryLabel && (
                <Link href={s.heroPrimaryLink || "/about"} className="btn-primary !px-7 !py-3.5">
                  {s.heroPrimaryLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              {s.heroSecondaryLabel && (
                <Link href={s.heroSecondaryLink || "/events"} className="btn-outline !px-7 !py-3.5">
                  {s.heroSecondaryLabel}
                </Link>
              )}
            </div>
            {facts.length > 0 && (
              <dl className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-2xl border border-line bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                    <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{f.label}</dt>
                    <dd className="mt-0.5 text-sm font-bold text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto max-w-xl lg:mr-0">
              <HeroSlider slides={heroSlides} alt={s.siteName} />
              <div className="float-slow absolute -top-5 -left-3 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-line sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                  <BadgeCheck className="h-5 w-5" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-[11px] font-semibold tracking-wide text-muted uppercase">Our motto</span>
                  <span className="block font-display text-base font-semibold text-ink">{s.motto}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Pillars ---------- */}
      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          <Pillars pillars={s.pillars} />
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      {s.show.stats && stats.length > 0 && (
        <section className="pb-20 sm:pb-24">
          <div className="container-x">
            <dl className={`grid gap-4 rounded-[2rem] border border-line bg-cream p-6 sm:p-10 ${stats.length >= 4 ? "sm:grid-cols-4" : stats.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {stats.map((x, i) => (
                <Reveal key={x.label} delay={i * 80} className="text-center">
                  <dd className="font-display text-5xl font-semibold text-brand sm:text-6xl">{x.value}</dd>
                  <dt className="mt-2 text-sm font-semibold tracking-wide text-muted uppercase">{x.label}</dt>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ---------- About preview ---------- */}
      <section className="pb-20 sm:pb-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-line">
                <SmartImage src={s.aboutImage?.url} alt={`${s.siteName} members`} sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -right-2 -bottom-8 max-w-[15rem] rounded-3xl bg-white p-5 shadow-lift ring-1 ring-line sm:-right-6">
                <p className="text-xs font-bold tracking-wider text-brand uppercase">Our vision</p>
                <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted">{s.vision}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="pt-6 lg:pt-0">
            <p className="eyebrow">About us</p>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{s.aboutTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{s.aboutIntro}</p>
            <div className="mt-7 rounded-3xl border border-gold-100 bg-gold-50 p-6">
              <p className="text-xs font-bold tracking-wider text-gold-700 uppercase">Our mission</p>
              <p className="mt-2 leading-7 text-ink/80">{s.mission}</p>
            </div>
            <Link href="/about" className="btn-outline mt-8">
              More about the club <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {s.show.president && <PresidentMessage s={s} />}
      {s.show.theme && <ThemeSection s={s} />}

      {/* ---------- Events ---------- */}
      {s.show.events && events.length > 0 && (
        <section className="bg-cream py-20 sm:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="Events & projects" title={<>What we have been <span className="text-brand italic">up to</span></>} link={{ href: "/events", label: "All events" }} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <Reveal key={e._id} delay={i * 80}>
                  <EventCard e={e} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Team ---------- */}
      {s.show.team && team.board.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="Our team" title={<>The people behind <span className="text-brand italic">the service</span></>} link={{ href: "/team", label: "Meet the full team" }} />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {team.board.slice(0, 8).map((m, i) => (
                <Reveal key={m._id} delay={i * 60}>
                  <TeamCard m={m} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Gallery ---------- */}
      {s.show.gallery && gallery.length > 0 && (
        <section className="bg-gradient-to-b from-white to-brand-50/50 py-20 sm:py-28">
          <div className="container-x">
            <SectionHeading eyebrow="Gallery" title={<>Moments of <span className="text-brand italic">fellowship</span></>} link={{ href: "/gallery", label: "Open gallery" }} />
            <GalleryGrid items={gallery} filters={false} />
          </div>
        </section>
      )}

      {/* ---------- Partners ---------- */}
      {s.show.partners && partners.length > 0 && (
        <section className="py-16">
          <div className="container-x">
            <p className="text-center text-sm font-bold tracking-[0.18em] text-muted uppercase">In partnership with</p>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {partners.map((p) => {
                const inner = (
                  <span className="flex h-20 w-44 items-center justify-center rounded-2xl border border-line bg-white px-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                    {p.logo?.url ? (
                      <span className="relative h-12 w-full">
                        <SmartImage src={p.logo.url} alt={p.name} fit="contain" sizes="176px" />
                      </span>
                    ) : (
                      <span className="text-center text-sm font-semibold text-ink">{p.name}</span>
                    )}
                  </span>
                );
                return (
                  <li key={p._id} title={p.name}>
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <CtaBand s={s} />
    </>
  );
}
