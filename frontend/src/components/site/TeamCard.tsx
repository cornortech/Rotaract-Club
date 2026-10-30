import { Mail, Phone } from "lucide-react";
import type { TeamItem } from "@/lib/data";
import { initials } from "@/lib/utils";
import SmartImage from "./SmartImage";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "./icons";

export default function TeamCard({ m }: { m: TeamItem }) {
  const links = [
    m.email && { href: `mailto:${m.email}`, Icon: Mail, label: "Email" },
    m.phone && { href: `tel:${m.phone.replace(/\s/g, "")}`, Icon: Phone, label: "Phone" },
    m.facebook && { href: m.facebook, Icon: FacebookIcon, label: "Facebook" },
    m.instagram && { href: m.instagram, Icon: InstagramIcon, label: "Instagram" },
    m.linkedin && { href: m.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
  ].filter(Boolean) as { href: string; Icon: React.ComponentType<{ className?: string }>; label: string }[];

  return (
    <article className="group card overflow-hidden p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
        <SmartImage
          src={m.photo?.url}
          alt={m.name}
          sizes="(max-width: 640px) 50vw, 25vw"
          className="transition duration-700 group-hover:scale-105"
          fallback={
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white font-display text-2xl font-semibold text-brand shadow-soft">
              {initials(m.name)}
            </span>
          }
        />
      </div>
      <div className="px-2 pt-4 pb-2">
        <p className="text-xs font-bold tracking-wider text-brand uppercase">{m.role}</p>
        <h3 className="mt-1 font-display text-lg leading-snug font-semibold text-ink">{m.name}</h3>
        {m.year && <p className="mt-0.5 text-sm text-muted">RY {m.year}</p>}
        {m.bio && <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{m.bio}</p>}
        {links.length > 0 && (
          <ul className="mt-3 flex gap-1.5">
            {links.map(({ href, Icon, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on ${label}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand transition hover:bg-brand hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
