"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import SmartImage from "./SmartImage";
import { NAV } from "@/lib/nav";


export default function Navbar({ siteName, shortName, logo }: { siteName: string; shortName: string; logo?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const [first, ...rest] = siteName.split(" of ");
  const nameTop = rest.length ? `${first} of` : "";
  const nameMain = rest.length ? rest.join(" of ") : siteName;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line bg-white/85 shadow-[0_8px_30px_-20px_rgb(29_26_43/0.25)] backdrop-blur-xl" : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3" onClick={() => setOpen(false)} aria-label={`${siteName} — home`}>
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line">
            <SmartImage src={logo} alt="" sizes="44px" fit="contain" className="p-1" fallback={<span className="text-sm font-bold text-brand">R</span>} />
          </span>
          <span className="min-w-0 leading-tight">
            {nameTop && <span className="block truncate text-[11px] font-semibold tracking-wide text-muted uppercase">{nameTop}</span>}
            <span className="block truncate font-display text-lg font-semibold text-ink sm:text-xl">
              <span className="sm:hidden">{nameMain || shortName}</span>
              <span className="hidden sm:inline">{nameMain}</span>
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(n.href) ? "bg-brand-50 text-brand" : "text-ink/75 hover:bg-brand-50/60 hover:text-brand"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Get involved <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[72px] bottom-0 z-40 bg-white transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex h-full flex-col gap-1 overflow-y-auto pt-6 pb-10">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`flex items-center justify-between rounded-2xl px-4 py-4 font-display text-2xl transition ${
                isActive(n.href) ? "bg-brand-50 text-brand" : "text-ink hover:bg-brand-50/60"
              } ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
              style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
            >
              {n.label}
              <ArrowUpRight className="h-5 w-5 opacity-40" aria-hidden />
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-6 !py-4 text-base">
            Get involved
          </Link>
        </nav>
      </div>
    </header>
  );
}
