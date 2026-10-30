import type { SiteSettings } from "@/lib/defaults";
import { SOCIAL_ICONS } from "./icons";

export default function SocialLinks({ socials, className = "" }: { socials: SiteSettings["socials"]; className?: string }) {
  const items = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter((k) => socials?.[k]);
  if (!items.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((k) => {
        const { Icon, label } = SOCIAL_ICONS[k];
        return (
          <li key={k}>
            <a
              href={socials[k]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand"
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
