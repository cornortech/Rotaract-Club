"use client";

import { useEffect, useState } from "react";
import SmartImage from "./SmartImage";

type Slide = { _id: string; image: { url: string }; title: string; caption: string };

export default function HeroSlider({ slides, alt }: { slides: Slide[]; alt: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % count), 5500);
    return () => clearInterval(t);
  }, [count, paused]);

  const current = slides[i];
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-50 shadow-lift ring-1 ring-line sm:aspect-[5/4] lg:aspect-[4/5]">
        {slides.map((s, idx) => (
          <div key={s._id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`} aria-hidden={idx !== i}>
            <SmartImage src={s.image?.url} alt={s.title || alt} priority={idx === 0} sizes="(max-width: 1024px) 100vw, 45vw" className={idx === i ? "scale-100 transition-transform duration-[6000ms]" : "scale-105"} />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
        {(current?.title || current?.caption) && (
          <div className="absolute right-4 bottom-4 left-4 rounded-2xl bg-white/90 p-4 shadow-soft backdrop-blur sm:right-auto sm:max-w-xs">
            {current.title && <p className="font-display text-lg leading-tight font-semibold text-ink">{current.title}</p>}
            {current.caption && <p className="mt-0.5 text-sm text-muted">{current.caption}</p>}
          </div>
        )}
      </div>
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Hero slides">
          {slides.map((s, idx) => (
            <button
              key={s._id}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={`Show slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2.5 rounded-full transition-all ${idx === i ? "w-8 bg-brand" : "w-2.5 bg-brand-200 hover:bg-brand/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
