import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import SmartImage from "./SmartImage";

export function isUpcoming(date?: string | null) {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

export default function EventCard({ e, priority }: { e: EventItem; priority?: boolean }) {
  const upcoming = isUpcoming(e.date);
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage src={e.coverImage?.url} alt={e.title} sizes="(max-width: 768px) 100vw, 33vw" priority={priority} className="transition duration-700 group-hover:scale-105" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand shadow-sm">{e.category}</span>
          {upcoming && <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow-sm">Upcoming</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {e.date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-brand" aria-hidden />
              {formatDate(e.date)}
            </span>
          )}
          {e.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand" aria-hidden />
              {e.location}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-ink">
          <Link href={`/events/${e.slug}`} className="after:absolute after:inset-0 focus:outline-none">
            {e.title}
          </Link>
        </h3>
        {e.summary && <p className="mt-3 line-clamp-3 leading-7 text-muted">{e.summary}</p>}
        <span className="link-arrow mt-auto pt-5">
          Read more <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </article>
  );
}
