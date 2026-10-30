"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CircleAlert, CloudUpload, Handshake, Images, Inbox, Loader2, MonitorPlay, Plus, Settings, Users } from "lucide-react";
import { api } from "./api";
import { PageTitle } from "./AdminShell";
import { useToast } from "./Toast";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const [d, setD] = useState<any>(null);
  const [moving, setMoving] = useState(false);
  const toast = useToast();
  const load = useCallback(() => api("/api/admin/overview").then(setD).catch((e) => toast("error", e.message)), [toast]);
  useEffect(() => {
    load();
  }, [load]);

  async function migrate() {
    setMoving(true);
    try {
      const r = await api("/api/admin/migrate-images", { method: "POST" });
      toast(r.failed ? "error" : "success", `${r.moved} image(s) copied to Cloudinary${r.failed ? `, ${r.failed} failed` : ""}.`);
      load();
    } catch (e) {
      toast("error", (e as Error).message);
    } finally {
      setMoving(false);
    }
  }

  if (!d) return <div className="flex h-64 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  const c = d.counts;
  const cards = [
    { href: "/admin/events", label: "Events & projects", n: c.events, Icon: CalendarDays },
    { href: "/admin/team", label: "Team & leaders", n: c.team, Icon: Users },
    { href: "/admin/gallery", label: "Gallery photos", n: c.gallery, Icon: Images },
    { href: "/admin/hero", label: "Hero slides", n: c.slides, Icon: MonitorPlay },
    { href: "/admin/partners", label: "Partners", n: c.partners, Icon: Handshake },
    { href: "/admin/messages", label: "Unread messages", n: c.unread, Icon: Inbox },
  ];

  return (
    <>
      <PageTitle title={`Namaste${d.admin?.name && d.admin.name !== "Admin" ? `, ${d.admin.name}` : ""} 👋`} text="Manage everything on your website from here." />

      {!d.cloudinary && (
        <div className="mb-6 flex gap-3 rounded-2xl border border-gold-100 bg-gold-50 p-4 text-sm text-ink">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" />
          <p><b>Image uploads are off.</b> Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your hosting environment variables, then redeploy.</p>
        </div>
      )}
      {d.cloudinary && d.externalImages > 0 && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-ink sm:flex-row sm:items-center">
          <CloudUpload className="h-5 w-5 shrink-0 text-brand" />
          <p className="flex-1">
            <b>{d.externalImages} starter image(s)</b> still load from the old website. Copy them into your own Cloudinary so the site never depends on it.
          </p>
          <button type="button" onClick={migrate} disabled={moving} className="btn-primary !py-2">
            {moving && <Loader2 className="h-4 w-4 animate-spin" />} Copy to Cloudinary
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map(({ href, label, n, Icon }) => (
          <Link key={href} href={href} className="group rounded-3xl border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand"><Icon className="h-5 w-5" /></span>
            <p className="mt-4 font-display text-3xl font-semibold text-ink">{n}</p>
            <p className="text-sm font-semibold text-muted group-hover:text-brand">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Latest messages</h2>
            <Link href="/admin/messages" className="link-arrow">All <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {d.recent.length ? (
            <ul className="divide-y divide-line">
              {d.recent.map((m: any) => (
                <li key={m._id} className="flex items-start gap-3 py-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-line" : "bg-brand"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{m.name} <span className="font-normal text-muted">· {m.subject || "No subject"}</span></p>
                    <p className="truncate text-sm text-muted">{m.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{formatDate(m.createdAt, { day: "numeric", month: "short" })}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-muted">No messages yet.</p>
          )}
        </section>
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-semibold">Quick actions</h2>
          <div className="grid gap-2">
            {[
              { href: "/admin/events?new=1", label: "Add an event or project", Icon: Plus },
              { href: "/admin/team?new=1", label: "Add a team member", Icon: Plus },
              { href: "/admin/gallery", label: "Upload gallery photos", Icon: Images },
              { href: "/admin/settings?s=contact", label: "Edit contact & social links", Icon: Settings },
              { href: "/admin/settings?s=president", label: "Edit president’s message", Icon: Settings },
            ].map(({ href, label, Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand">
                <Icon className="h-4 w-4 text-brand" /> {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
