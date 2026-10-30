"use client";

import { useMemo, useState } from "react";
import { Expand } from "lucide-react";
import SmartImage from "./SmartImage";
import Lightbox from "./Lightbox";

type Item = { _id: string; image: { url: string }; caption: string; album: string };

export default function GalleryGrid({ items, filters = true }: { items: Item[]; filters?: boolean }) {
  const albums = useMemo(() => Array.from(new Set(items.map((i) => i.album).filter(Boolean))), [items]);
  const [album, setAlbum] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = album === "All" ? items : items.filter((i) => i.album === album);

  return (
    <>
      {filters && albums.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Albums">
          {["All", ...albums].map((a) => (
            <button
              key={a}
              type="button"
              role="tab"
              aria-selected={album === a}
              onClick={() => setAlbum(a)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${album === a ? "bg-brand text-white shadow-sm" : "border border-line bg-white text-ink hover:border-brand-200 hover:text-brand"}`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {shown.map((it, idx) => (
          <li key={it._id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(idx)}
              className="group relative block w-full overflow-hidden rounded-3xl border border-line bg-white text-left shadow-soft"
              aria-label={`Open photo${it.caption ? `: ${it.caption}` : ""}`}
            >
              <div className={`relative ${idx % 3 === 1 ? "aspect-[4/5]" : idx % 3 === 2 ? "aspect-square" : "aspect-[4/3]"}`}>
                <SmartImage src={it.image?.url} alt={it.caption || "Gallery photo"} sizes="(max-width: 640px) 100vw, 33vw" className="transition duration-700 group-hover:scale-105" />
                <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition group-hover:opacity-100">
                  <Expand className="h-4 w-4" aria-hidden />
                </span>
              </div>
              {(it.caption || it.album) && (
                <div className="px-4 py-3">
                  {it.album && <p className="text-[11px] font-bold tracking-wider text-brand uppercase">{it.album}</p>}
                  {it.caption && <p className="mt-0.5 line-clamp-2 text-sm text-muted">{it.caption}</p>}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={shown.map((s) => ({ url: s.image?.url, caption: s.caption }))} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
