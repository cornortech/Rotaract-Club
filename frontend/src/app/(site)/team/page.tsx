import type { Metadata } from "next";
import { getSettings, getTeam } from "@/lib/data";
import PageHeader from "@/components/site/PageHeader";
import TeamCard from "@/components/site/TeamCard";
import Reveal from "@/components/site/Reveal";
import SmartImage from "@/components/site/SmartImage";
import SectionHeading from "@/components/site/SectionHeading";
import CtaBand from "@/components/sections/CtaBand";
import { initials } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Our Team",
    description: `Meet the board members and past presidents of the ${s.siteName}.`,
    alternates: { canonical: "/team" },
  };
}

export default async function TeamPage() {
  const [s, team] = await Promise.all([getSettings(), getTeam()]);
  const years = Array.from(new Set(team.board.map((m) => m.year).filter(Boolean)));
  return (
    <>
      <PageHeader eyebrow="Our team" title="Meet the team" text={`The Rotaractors leading ${s.siteName}${years[0] ? ` in RY ${years[0]}` : ""}.`} />
      <section className="py-20 sm:py-24">
        <div className="container-x">
          {team.board.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {team.board.map((m, i) => (
                <Reveal key={m._id} delay={(i % 4) * 60}>
                  <TeamCard m={m} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="rounded-3xl border border-dashed border-line p-10 text-center text-muted">Team details are coming soon.</p>
          )}
        </div>
      </section>

      {team.leaders.length > 0 && (
        <section id="leaders" className="scroll-mt-24 bg-cream py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading eyebrow="Our leaders" title="Past presidents" text="Every Rotaract year is shaped by a leader who gave their time to serve. Thank you." />
            <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.leaders.map((l, i) => (
                <Reveal as="li" key={l._id} delay={(i % 3) * 60}>
                  <div className="card flex h-full items-center gap-4 p-5">
                    <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                      <SmartImage src={l.photo?.url} alt={l.name} sizes="80px" fallback={<span className="font-display text-xl text-brand">{initials(l.name)}</span>} />
                    </span>
                    <span className="min-w-0">
                      {l.year && <span className="inline-block rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-bold text-gold-700">RY {l.year}</span>}
                      <span className="mt-1.5 block font-display text-lg leading-snug font-semibold text-ink">{l.name}</span>
                      <span className="block text-sm text-muted">{l.role}</span>
                    </span>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}
      <div className="pt-20 sm:pt-28">
        <CtaBand s={s} />
      </div>
    </>
  );
}
