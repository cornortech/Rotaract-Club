"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { getPath, setPath, type SettingsSection } from "@/lib/fields";
import { useSchema } from "./useSchema";
import { api, ApiError } from "./api";
import { PageTitle } from "./AdminShell";
import { FieldInput } from "./fields";
import { useToast } from "./Toast";

export default function SettingsEditor() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const schema = useSchema();
  const sections: SettingsSection[] = schema?.settings ?? [];
  const key = params.get("s") || sections[0]?.key;
  const section = sections.find((s) => s.key === key) ?? sections[0];
  const [data, setData] = useState<any>(null);
  const [saved, setSaved] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/api/admin/settings").then((d) => {
      setData(d);
      setSaved(d);
    }).catch((e) => toast("error", e.message));
  }, [toast]);

  const dirty = useMemo(
    () => !!data && !!saved && !!section && section.fields.some((f) => JSON.stringify(getPath(data, f.name)) !== JSON.stringify(getPath(saved, f.name))),
    [data, saved, section]
  );

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  async function save() {
    if (!section) return;
    setBusy(true);
    setErrors({});
    let body: any = {};
    for (const f of section.fields) body = setPath(body, f.name, getPath(data, f.name));
    try {
      const next = await api("/api/admin/settings", { method: "PUT", body });
      setData(next);
      setSaved(next);
      toast("success", "Saved. The website is updated.");
    } catch (e) {
      if (e instanceof ApiError && e.errors) setErrors(e.errors);
      toast("error", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function go(k: string) {
    if (dirty && !confirm("You have unsaved changes. Leave this section?")) return;
    if (dirty) setData(saved);
    setErrors({});
    router.replace(`/admin/settings?s=${k}`, { scroll: false });
  }

  return (
    <>
      <PageTitle title="Site settings" text="Edit the text, images and contact details shown on the website." />
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Settings sections">
          {sections.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => go(s.key)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${s.key === section?.key ? "bg-white text-brand shadow-soft ring-1 ring-line" : "text-muted hover:bg-white hover:text-ink"}`}
            >
              {s.title}
            </button>
          ))}
        </nav>
        <section className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">{section?.title ?? "Loading…"}</h2>
          <p className="mt-1 text-sm text-muted">{section?.description}</p>
          {!data || !section ? (
            <div className="flex h-40 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.name} className={f.full || ["image", "images", "longtext", "pairs", "cards"].includes(f.type) ? "md:col-span-2" : ""}>
                  <FieldInput f={f} value={getPath(data, f.name)} error={errors[f.name]} onChange={(v) => setData((d: any) => setPath(d, f.name, v))} />
                </div>
              ))}
            </div>
          )}
          <div className="sticky bottom-4 mt-8 flex items-center justify-end gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-lift backdrop-blur">
            {dirty && <span className="text-sm font-semibold text-gold-700">Unsaved changes</span>}
            <button type="button" onClick={save} disabled={busy || !data || !dirty} className="btn-primary !py-2.5">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
