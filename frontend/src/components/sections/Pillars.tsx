import { Briefcase, Compass, HeartHandshake, Users } from "lucide-react";
import type { SiteSettings } from "@/lib/defaults";
import Reveal from "@/components/site/Reveal";

const ICONS = [Users, Compass, HeartHandshake, Briefcase];
const TONES = ["bg-brand-50 text-brand", "bg-gold-50 text-gold-700", "bg-azure-50 text-azure", "bg-brand-50 text-brand"];

export default function Pillars({ pillars }: { pillars: SiteSettings["pillars"] }) {
  if (!pillars?.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pillars.map((p, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <Reveal key={p.title + i} delay={i * 80}>
            <div className="card h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${TONES[i % TONES.length]}`}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 leading-7 text-muted">{p.text}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
