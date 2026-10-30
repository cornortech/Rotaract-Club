import type { SiteSettings } from "@/lib/defaults";
import SmartImage from "@/components/site/SmartImage";
import Reveal from "@/components/site/Reveal";
import Rings from "@/components/site/Rings";

export default function ThemeSection({ s }: { s: SiteSettings }) {
  const t = s.theme;
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t.title}</p>
          <h2 className="h-display mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Guided by <span className="text-brand italic">purpose</span>, driven by people.
          </h2>
          {t.text && <p className="mt-4 text-lg leading-8 text-muted">{t.text}</p>}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {t.districtTheme && (
              <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
                <p className="text-xs font-bold tracking-wider text-brand uppercase">District theme</p>
                <p className="mt-2 font-display text-2xl leading-snug font-semibold text-ink">{t.districtTheme}</p>
              </div>
            )}
            {t.riTheme && (
              <div className="rounded-3xl border border-gold-100 bg-gold-50 p-6">
                <p className="text-xs font-bold tracking-wider text-gold-700 uppercase">Rotary International theme</p>
                <p className="mt-2 font-display text-2xl leading-snug font-semibold text-ink">{t.riTheme}</p>
              </div>
            )}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <Rings className="absolute inset-0 h-full w-full float-slow" />
            <div className="absolute inset-[12%] overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-line">
              <SmartImage src={t.image?.url} alt={`${t.title}: ${t.riTheme}`} fit="contain" sizes="(max-width: 1024px) 80vw, 35vw" className="p-6" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
