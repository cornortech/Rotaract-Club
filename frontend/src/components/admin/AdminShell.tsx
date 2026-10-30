"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ExternalLink,
  Handshake,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MonitorPlay,
  Settings,
  Users,
  X,
} from "lucide-react";
import { ToastProvider } from "./Toast";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site settings", Icon: Settings },
  { href: "/admin/hero", label: "Hero slides", Icon: MonitorPlay },
  { href: "/admin/events", label: "Events & projects", Icon: CalendarDays },
  { href: "/admin/team", label: "Team & leaders", Icon: Users },
  { href: "/admin/gallery", label: "Gallery", Icon: Images },
  { href: "/admin/partners", label: "Partners", Icon: Handshake },
  { href: "/admin/messages", label: "Messages", Icon: Inbox },
  { href: "/admin/account", label: "Account & password", Icon: KeyRound },
];

export default function AdminShell({ email, siteName, logo, children }: { email: string; siteName: string; logo?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetch("/api/admin/overview", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => j.ok && setUnread(j.data.counts.unread))
      .catch(() => {});
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/adminlogin");
    router.refresh();
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="h-10 w-10 shrink-0 rounded-xl object-contain ring-1 ring-line" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-display text-lg font-semibold text-white">R</span>
        )}
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-bold text-ink">{siteName}</span>
          <span className="block text-xs text-muted">Admin panel</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Admin">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active(href) ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active(href) ? "bg-brand text-white shadow-[0_8px_20px_-10px_rgb(212_19_103/0.8)]" : "text-ink/75 hover:bg-brand-50 hover:text-brand"
            }`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
            <span className="flex-1">{label}</span>
            {href === "/admin/messages" && unread > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active(href) ? "bg-white text-brand" : "bg-brand text-white"}`}>{unread}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <p className="truncate px-3 pb-2 text-xs text-muted" title={email}>{email}</p>
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/75 hover:bg-brand-50 hover:text-brand">
          <ExternalLink className="h-4.5 w-4.5" aria-hidden /> View website
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/75 hover:bg-brand-50 hover:text-brand">
          <LogOut className="h-4.5 w-4.5" aria-hidden /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#fbf8fa]">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-white lg:block">{sidebar}</aside>
        {/* Mobile */}
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
          <button type="button" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-line" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-ink">Admin panel</span>
          <a href="/" target="_blank" className="flex h-10 w-10 items-center justify-center rounded-xl border border-line" aria-label="View website">
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
              <button type="button" onClick={() => setOpen(false)} className="absolute top-4 right-3 rounded-lg p-2 text-muted" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        )}
        <main className="lg:pl-64">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}

export function PageTitle({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        {text && <p className="mt-1 text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}
