"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SmartImage from "./SmartImage";

export type LightboxItem = { url: string; caption?: string };

export default function Lightbox({ items, index, onClose, onIndex }: { items: LightboxItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const open = index !== null;
  const go = useCallback((d: number) => index !== null && onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, onClose]);

  if (index === null) return null;
  const item = items[index];
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white/95 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm font-semibold text-muted">
          {index + 1} / {items.length}
        </p>
        <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink hover:text-brand" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="relative flex-1" onClick={onClose}>
        <div className="absolute inset-4 sm:inset-x-20 sm:inset-y-2" onClick={(e) => e.stopPropagation()}>
          <SmartImage src={item.url} alt={item.caption || "Photo"} fit="contain" sizes="100vw" />
        </div>
        {items.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute top-1/2 left-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft hover:text-brand sm:left-6" aria-label="Previous photo">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute top-1/2 right-2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft hover:text-brand sm:right-6" aria-label="Next photo">
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {item.caption && <p className="px-6 py-4 text-center text-muted">{item.caption}</p>}
    </div>
  );
}
