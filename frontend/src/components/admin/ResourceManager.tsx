"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageIcon, Loader2, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import type { ResourceConfig, ResourceKey, Field } from "@/lib/fields";
import { useSchema } from "./useSchema";
import { formatDate } from "@/lib/utils";
import { api, ApiError, uploadImage } from "./api";
import { PageTitle } from "./AdminShell";
import { FieldInput, Toggle, inputCls } from "./fields";
import { useToast } from "./Toast";

function emptyItem(fields: Field[]) {
  const o: any = {};
  for (const f of fields) {
    if (f.type === "toggle") o[f.name] = ["active", "published"].includes(f.name);
    else if (f.type === "number") o[f.name] = 0;
    else if (f.type === "image") o[f.name] = { url: "", publicId: "" };
    else if (f.type === "images") o[f.name] = [];
    else if (f.type === "select") o[f.name] = f.options?.[0]?.value ?? "";
    else if (f.type === "date") o[f.name] = null;
    else o[f.name] = "";
  }
  return o;
}

export default function ResourceManager({ resource }: { resource: ResourceKey }) {
  const schema = useSchema();
  if (!schema) return <div className="flex h-64 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  return <Manager resource={resource} cfg={schema.resources[resource]} />;
}

function Manager({ resource, cfg }: { resource: ResourceKey; cfg: ResourceConfig }) {
  const toast = useToast();
  const params = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<any[] | null>(null);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string>("all");
  // "?new=1" (from the dashboard quick actions) opens the add form straight away.
  const [editing, setEditing] = useState<any | null>(() => (params.get("new") === "1" ? emptyItem(cfg.fields) : null));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [bulk, setBulk] = useState<string | null>(null);
  const bulkRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => api(`/api/admin/items/${resource}`).then(setItems).catch((e) => toast("error", e.message)), [resource, toast]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (params.get("new") === "1") router.replace(`/admin/${resource}`, { scroll: false });
  }, [params, resource, router]);

  const shown = useMemo(() => {
    let list = items ?? [];
    if (resource === "team" && group !== "all") list = list.filter((i) => i.group === group);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((i) => [i.title, i.name, i.role, i.caption, i.album, i.category].some((v) => String(v || "").toLowerCase().includes(s)));
    }
    return list;
  }, [items, q, group, resource]);

  async function save() {
    setBusy(true);
    setErrors({});
    try {
      if (editing._id) await api(`/api/admin/items/${resource}/${editing._id}`, { method: "PUT", body: editing });
      else await api(`/api/admin/items/${resource}`, { method: "POST", body: editing });
      toast("success", `${cfg.singular[0].toUpperCase() + cfg.singular.slice(1)} saved.`);
      setEditing(null);
      load();
    } catch (e) {
      if (e instanceof ApiError && e.errors) setErrors(e.errors);
      toast("error", (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: any) {
    const name = item.title || item.name || item.caption || `this ${cfg.singular}`;
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/items/${resource}/${item._id}`, { method: "DELETE" });
      toast("success", "Deleted.");
      setItems((v) => v?.filter((x) => x._id !== item._id) ?? null);
      if (editing?._id === item._id) setEditing(null);
    } catch (e) {
      toast("error", (e as Error).message);
    }
  }

  async function quickToggle(item: any, field: string) {
    const next = { ...item, [field]: !item[field] };
    setItems((v) => v?.map((x) => (x._id === item._id ? next : x)) ?? null);
    try {
      await api(`/api/admin/items/${resource}/${item._id}`, { method: "PUT", body: next });
    } catch (e) {
      toast("error", (e as Error).message);
      load();
    }
  }

  async function bulkUpload(files: FileList | null) {
    if (!files?.length) return;
    const album = prompt("Album name for these photos (optional):", "") ?? "";
    const arr = Array.from(files).slice(0, 50);
    const uploaded: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      setBulk(`Uploading ${i + 1} of ${arr.length}…`);
      try {
        const image = await uploadImage(arr[i]);
        uploaded.push({ image, caption: "", album: album.trim().slice(0, 80) || "General", order: 0 });
      } catch (e) {
        toast("error", `${arr[i].name}: ${(e as Error).message}`);
      }
    }
    if (uploaded.length) {
      try {
        await api(`/api/admin/items/${resource}`, { method: "POST", body: { items: uploaded } });
        toast("success", `${uploaded.length} photo(s) added.`);
        load();
      } catch (e) {
        toast("error", (e as Error).message);
      }
    }
    setBulk(null);
    if (bulkRef.current) bulkRef.current.value = "";
  }

  const cell = (item: any, col: (typeof cfg.columns)[number]) => {
    const v = item[col.name];
    if (col.type === "image")
      return (
        <span className="relative block h-14 w-20 overflow-hidden rounded-xl border border-line bg-cream">
          {v?.url ? <img src={v.url} alt="" className="h-full w-full object-cover" loading="lazy" /> : <ImageIcon className="m-auto mt-4 h-5 w-5 text-muted/40" />}
        </span>
      );
    if (col.type === "date") return <span className="text-sm text-muted">{v ? formatDate(v, { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>;
    if (col.type === "toggle") return <Toggle checked={!!v} onChange={() => quickToggle(item, col.name)} label="" />;
    if (col.name === "group") return <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand">{v === "leader" ? "Past leader" : "Current team"}</span>;
    return <span className={col.name === "title" || col.name === "name" ? "font-semibold text-ink" : "text-sm text-muted"}>{v || "—"}</span>;
  };

  return (
    <>
      <PageTitle
        title={cfg.title}
        text={cfg.description}
        action={
          <div className="flex flex-wrap gap-2">
            {cfg.bulkImages && (
              <>
                <button type="button" onClick={() => bulkRef.current?.click()} disabled={!!bulk} className="btn-outline !py-2.5">
                  {bulk ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {bulk || "Upload many photos"}
                </button>
                <input ref={bulkRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple className="hidden" onChange={(e) => bulkUpload(e.target.files)} />
              </>
            )}
            {cfg.canCreate && (
              <button type="button" onClick={() => { setErrors({}); setEditing(emptyItem(cfg.fields)); }} className="btn-primary !py-2.5">
                <Plus className="h-4 w-4" /> Add {cfg.singular}
              </button>
            )}
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className={`${inputCls} pl-10`} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        </label>
        {resource === "team" && (
          <div className="flex gap-1 rounded-xl border border-line bg-white p-1">
            {[["all", "All"], ["board", "Current team"], ["leader", "Past leaders"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setGroup(v)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${group === v ? "bg-brand text-white" : "text-muted hover:text-ink"}`}>{l}</button>
            ))}
          </div>
        )}
      </div>

      {!items ? (
        <div className="flex h-48 items-center justify-center text-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : shown.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center text-muted">Nothing here yet.</div>
      ) : resource === "gallery" ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((it) => (
            <li key={it._id} className="group overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <div className="relative aspect-[4/3] bg-cream">
                {it.image?.url && <img src={it.image.url} alt={it.caption} className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="flex items-center gap-2 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-brand uppercase">{it.album}</p>
                  <p className="truncate text-sm text-muted">{it.caption || "No caption"}</p>
                </div>
                <button type="button" onClick={() => { setErrors({}); setEditing(it); }} className="rounded-lg p-2 text-muted hover:bg-brand-50 hover:text-brand" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                <button type="button" onClick={() => remove(it)} className="rounded-lg p-2 text-muted hover:bg-brand-50 hover:text-brand" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
          <ul className="divide-y divide-line">
            {shown.map((it) => (
              <li key={it._id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-5">
                {cfg.columns.map((col, i) => (
                  <div key={col.name} className={i === 1 ? "min-w-0 flex-1" : col.type === "image" ? "shrink-0" : "hidden shrink-0 md:block"}>
                    {cell(it, col)}
                  </div>
                ))}
                <div className="ml-auto flex shrink-0 gap-1">
                  <button type="button" onClick={() => { setErrors({}); setEditing(it); }} className="rounded-lg p-2 text-muted hover:bg-brand-50 hover:text-brand" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button type="button" onClick={() => remove(it)} className="rounded-lg p-2 text-muted hover:bg-brand-50 hover:text-brand" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={editing._id ? `Edit ${cfg.singular}` : `Add ${cfg.singular}`}>
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={() => !busy && setEditing(null)} />
          <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-xl font-semibold">{editing._id ? `Edit ${cfg.singular}` : `Add ${cfg.singular}`}</h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-muted hover:text-brand" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {cfg.fields.map((f) => (
                  <div key={f.name} className={f.full || f.type === "toggle" ? "sm:col-span-2" : ""}>
                    <FieldInput f={f} value={editing[f.name]} error={errors[f.name]} onChange={(v) => setEditing((e: any) => ({ ...e, [f.name]: v }))} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
              {editing._id ? (
                <button type="button" onClick={() => remove(editing)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-brand-50 hover:text-brand">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              ) : <span />}
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(null)} className="btn-outline !py-2.5">Cancel</button>
                <button type="button" onClick={save} disabled={busy} className="btn-primary !py-2.5">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
