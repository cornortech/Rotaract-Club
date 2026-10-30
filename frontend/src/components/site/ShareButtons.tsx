"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { FacebookIcon } from "./icons";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const btn = "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand-200 hover:text-brand";
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-muted">Share</span>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
        <FacebookIcon />
      </a>
      <a className={btn} href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
        <MessageCircle className="h-4 w-4" />
      </a>
      <button
        type="button"
        className={btn}
        aria-label="Copy link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {}
        }}
      >
        {copied ? <Check className="h-4 w-4 text-brand" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
