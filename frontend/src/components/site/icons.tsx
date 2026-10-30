import { Music2 } from "lucide-react";

type P = { className?: string };
const base = (cls?: string) => ({ className: cls || "h-4 w-4", "aria-hidden": true as const, fill: "currentColor", viewBox: "0 0 24 24" });

export const FacebookIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.6V21h2.9Z" />
  </svg>
);
export const InstagramIcon = ({ className }: P) => (
  <svg {...base(className)} fill="none" stroke="currentColor" strokeWidth="1.9">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
export const LinkedinIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M6.9 8.8H3.8V20h3.1V8.8ZM5.4 4a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.2 13.6c0-3-1.6-4.9-4.3-4.9-1.3 0-2.3.6-2.8 1.4V8.8H10V20h3.1v-5.8c0-1.5.6-2.6 2-2.6s1.9 1 1.9 2.6V20h3.1v-6.4Z" />
  </svg>
);
export const YoutubeIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);
export const XIcon = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M17.7 3.5h3l-6.6 7.6 7.8 9.4h-6.1l-4.8-5.9-5.5 5.9h-3l7.1-8.1L2.1 3.5h6.2l4.3 5.4 5.1-5.4Zm-1 15.3h1.7L7.4 5.1H5.6l11.1 13.7Z" />
  </svg>
);
export const TiktokIcon = ({ className }: P) => <Music2 className={className || "h-4 w-4"} aria-hidden />;

export const SOCIAL_ICONS = {
  facebook: { Icon: FacebookIcon, label: "Facebook" },
  instagram: { Icon: InstagramIcon, label: "Instagram" },
  linkedin: { Icon: LinkedinIcon, label: "LinkedIn" },
  youtube: { Icon: YoutubeIcon, label: "YouTube" },
  tiktok: { Icon: TiktokIcon, label: "TikTok" },
  x: { Icon: XIcon, label: "X" },
} as const;
