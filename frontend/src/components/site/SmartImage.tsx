"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type Props = {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fallback?: React.ReactNode;
  fit?: "cover" | "contain";
};

/** Image that fills its (relative) parent and shows a soft placeholder if missing or broken. */
export default function SmartImage({ src, alt, sizes = "100vw", className = "", priority, fallback, fit = "cover" }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-gold-50 text-brand/40 ${className}`}>
        {fallback ?? <ImageIcon className="h-8 w-8" aria-hidden />}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={`${fit === "cover" ? "object-cover" : "object-contain"} ${className}`}
    />
  );
}
