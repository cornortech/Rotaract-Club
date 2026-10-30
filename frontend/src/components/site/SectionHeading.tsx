import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  link,
  center,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  link?: { href: string; label: string };
  center?: boolean;
}) {
  return (
    <div className={`mb-10 flex flex-col gap-4 sm:mb-12 ${center ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between"}`}>
      <div className={center ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h-display mt-3 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{title}</h2>
        {text && <p className="mt-4 text-lg leading-8 text-muted">{text}</p>}
      </div>
      {link && (
        <Link href={link.href} className="link-arrow shrink-0">
          {link.label} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
