import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Rings from "./Rings";

export default function PageHeader({ eyebrow, title, text, crumbs = [] }: { eyebrow?: string; title: string; text?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50/70 via-white to-white">
      <Rings className="absolute -top-20 -right-16 h-72 w-72 sm:h-96 sm:w-96" />
      <div className="container-x relative py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-brand">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                <Link href={c.href} className="hover:text-brand">{c.label}</Link>
              </li>
            ))}
            <li className="flex items-center gap-1" aria-current="page">
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <span className="font-medium text-ink">{title.length > 40 ? title.slice(0, 40) + "…" : title}</span>
            </li>
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="h-display mt-3 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{text}</p>}
      </div>
    </section>
  );
}
