"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, Phone, Reply, Trash2 } from "lucide-react";
import { api } from "./api";
import { PageTitle } from "./AdminShell";
import { useToast } from "./Toast";
import { formatDate } from "@/lib/utils";

export default function MessagesInbox() {
  const [items, setItems] = useState<any[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const toast = useToast();
  const load = useCallback(() => api("/api/admin/items/messages").then(setItems).catch((e) => toast("error", e.message)), [toast]);
  useEffect(() => {
    load();
  }, [load]);

  async function setRead(m: any, read: boolean) {
    setItems((v) => v?.map((x) => (x._id === m._id ? { ...x, read } : x)) ?? null);
    await api(`/api/admin/items/messages/${m._id}`, { method: "PUT", body: { read } }).catch((e) => toast("error", e.message));
  }
  async function remove(m: any) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    try {
      await api(`/api/admin/items/messages/${m._id}`, { method: "DELETE" });
      setItems((v) => v?.filter((x) => x._id !== m._id) ?? null);
      toast("success", "Message deleted.");
    } catch (e) {
      toast("error", (e as Error).message);
    }
  }
  function toggle(m: any) {
    setOpenId(openId === m._id ? null : m._id);
    if (!m.read) setRead(m, true);
  }

  const list = (items ?? []).filter((m) => filter === "all" || !m.read);
  return (
    <>
      <PageTitle
        title="Messages"
        text="Messages sent from the website contact form."
        action={
          <div className="flex gap-1 rounded-xl border border-line bg-white p-1">
            {(["all", "unread"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold capitalize ${filter === f ? "bg-brand text-white" : "text-muted hover:text-ink"}`}>{f}</button>
            ))}
          </div>
        }
      />
      {!items ? (
        <div className="flex h-48 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center text-muted">No messages{filter === "unread" ? " to read" : " yet"}.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((m) => (
            <li key={m._id} className={`overflow-hidden rounded-2xl border bg-white shadow-soft ${m.read ? "border-line" : "border-brand-200"}`}>
              <button type="button" onClick={() => toggle(m)} className="flex w-full items-start gap-3 px-5 py-4 text-left" aria-expanded={openId === m._id}>
                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-line" : "bg-brand"}`} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className={`truncate ${m.read ? "font-semibold" : "font-bold"} text-ink`}>{m.name}</span>
                    <span className="truncate text-sm text-muted">{m.email}</span>
                  </span>
                  <span className="block truncate text-sm text-ink/80">{m.subject || "No subject"}</span>
                  {openId !== m._id && <span className="block truncate text-sm text-muted">{m.message}</span>}
                </span>
                <span className="shrink-0 text-xs text-muted">{formatDate(m.createdAt, { day: "numeric", month: "short", year: "numeric" })}</span>
              </button>
              {openId === m._id && (
                <div className="border-t border-line px-5 py-4">
                  <p className="text-[15px] leading-7 whitespace-pre-wrap text-ink">{m.message}</p>
                  {m.phone && <p className="mt-3 flex items-center gap-2 text-sm text-muted"><Phone className="h-4 w-4" /> {m.phone}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message"))}`} className="btn-primary !py-2"><Reply className="h-4 w-4" /> Reply by email</a>
                    <button type="button" onClick={() => setRead(m, !m.read)} className="btn-outline !py-2">{m.read ? <><Mail className="h-4 w-4" /> Mark unread</> : <><MailOpen className="h-4 w-4" /> Mark read</>}</button>
                    <button type="button" onClick={() => remove(m)} className="btn-outline !py-2"><Trash2 className="h-4 w-4" /> Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
