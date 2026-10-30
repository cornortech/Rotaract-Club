"use client";

import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/data";
import EventCard, { isUpcoming } from "./EventCard";

export default function EventsBrowser({ events }: { events: EventItem[] }) {
  const cats = useMemo(() => Array.from(new Set(events.map((e) => e.category).filter(Boolean))), [events]);
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? events : events.filter((e) => e.category === cat);
  const upcoming = list.filter((e) => isUpcoming(e.date)).sort((a, b) => +new Date(a.date!) - +new Date(b.date!));
  const past = list.filter((e) => !isUpcoming(e.date));

  return (
    <>
      {cats.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter by type">
          {["All", ...cats].map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cat === c ? "bg-brand text-white shadow-sm" : "border border-line bg-white text-ink hover:border-brand-200 hover:text-brand"}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming" className="mb-16">
          <h2 id="upcoming" className="h-display mb-6 text-2xl sm:text-3xl">Upcoming</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e._id} e={e} />
            ))}
          </div>
        </section>
      )}
      <section aria-labelledby="past">
        {upcoming.length > 0 && <h2 id="past" className="h-display mb-6 text-2xl sm:text-3xl">Past events & projects</h2>}
        {past.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((e, i) => (
              <EventCard key={e._id} e={e} priority={i < 3} />
            ))}
          </div>
        ) : (
          !upcoming.length && <p className="rounded-3xl border border-dashed border-line p-10 text-center text-muted">No events in this category yet.</p>
        )}
      </section>
    </>
  );
}
