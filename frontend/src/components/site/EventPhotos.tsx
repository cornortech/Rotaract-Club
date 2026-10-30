"use client";

import { useState } from "react";
import SmartImage from "./SmartImage";
import Lightbox from "./Lightbox";

export default function EventPhotos({ images, title }: { images: { url: string }[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.url + i}>
            <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-line" aria-label={`Open photo ${i + 1}`}>
              <SmartImage src={img.url} alt={`${title} — photo ${i + 1}`} sizes="(max-width: 640px) 50vw, 25vw" className="transition duration-700 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox items={images.map((i) => ({ url: i.url, caption: title }))} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
