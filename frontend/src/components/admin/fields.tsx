"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Link2, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import type { Field } from "@/lib/fields";
import { uploadImage } from "./api";
import { useToast } from "./Toast";

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/50 transition focus:border-brand focus:ring-4 focus:ring-brand-100 focus:outline-none";

type Img = { url: string; publicId?: string };

/* eslint-disable-next-line @next/next/no-img-element */
const Thumb = ({ src, className = "" }: { src: string; className?: string }) => <img src={src} alt="" className={`h-full w-full object-cover ${className}`} />;

export function ImageField({ value, onChange }: { value: Img; onChange: (v: Img) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const toast = useToast();

  async function pick(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    setBusy(0);
    try {
      const img = await uploadImage(f, setBusy);
      onChange(img);
    } catch (e) {
      toast("error", (e as Error).message);
    } finally {
      setBusy(null);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-2xl border border-dashed border-line bg-cream sm:w-44">
        {value?.url ? <Thumb src={value.url} /> : <div className="flex h-full items-center justify-center text-muted/50"><ImagePlus className="h-8 w-8" /></div>}
        {busy !== null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/85 text-sm font-semibold text-brand">
            <Loader2 className="h-5 w-5 animate-spin" /> {busy}%
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => ref.current?.click()} disabled={busy !== null} className="inline-flex items-center gap-2 rounded-xl bg-brand-50 px-3.5 py-2 text-sm font-semibold text-brand hover:bg-brand-100 disabled:opacity-60">
            <Upload className="h-4 w-4" /> {value?.url ? "Replace" : "Upload"}
          </button>
          {value?.url && (
            <button type="button" onClick={() => onChange({ url: "", publicId: "" })} className="inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-muted hover:text-brand">
              <Trash2 className="h-4 w-4" /> Remove
            </button>
          )}
          <button type="button" onClick={() => setShowUrl((v) => !v)} className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold text-muted hover:text-brand">
            <Link2 className="h-3.5 w-3.5" /> Use a link
          </button>
        </div>
        {showUrl && (
          <input className={inputCls} placeholder="https://…" value={value?.url || ""} onChange={(e) => onChange({ url: e.target.value.trim(), publicId: "" })} />
        )}
        <p className="text-xs text-muted">JPG, PNG, WEBP or GIF · big photos are resized automatically (max 4 MB).</p>
        <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => pick(e.target.files)} />
      </div>
    </div>
  );
}

export function ImagesField({ value, onChange }: { value: Img[]; onChange: (v: Img[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const toast = useToast();
  const list = Array.isArray(value) ? value : [];

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    const out = [...list];
    const arr = Array.from(files).slice(0, 30);
    for (let i = 0; i < arr.length; i++) {
      setProgress(`Uploading ${i + 1} of ${arr.length}…`);
      try {
        out.push(await uploadImage(arr[i]));
        onChange([...out]);
      } catch (e) {
        toast("error", `${arr[i].name}: ${(e as Error).message}`);
      }
    }
    setProgress(null);
    if (ref.current) ref.current.value = "";
  }
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const n = [...list];
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  return (
    <div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {list.map((img, i) => (
          <li key={img.url + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-cream">
            <Thumb src={img.url} />
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded-lg bg-white/95 p-1 text-ink shadow" aria-label="Move left"><ChevronLeft className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => move(i, 1)} className="rounded-lg bg-white/95 p-1 text-ink shadow" aria-label="Move right"><ChevronRight className="h-3.5 w-3.5" /></button>
              </span>
              <button type="button" onClick={() => onChange(list.filter((_, k) => k !== i))} className="rounded-lg bg-white/95 p-1 text-brand shadow" aria-label="Remove"><X className="h-3.5 w-3.5" /></button>
            </div>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => ref.current?.click()} disabled={!!progress} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-brand-200 bg-brand-50/50 text-xs font-semibold text-brand hover:bg-brand-50">
            {progress ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
            Add photos
          </button>
        </li>
      </ul>
      {progress && <p className="mt-2 text-xs font-semibold text-brand">{progress}</p>}
      <input ref={ref} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(e) => pick(e.target.files)} />
    </div>
  );
}

function ListEditor({ value, onChange, keys, labels, addLabel }: { value: any[]; onChange: (v: any[]) => void; keys: [string, string]; labels: [string, string]; addLabel: string }) {
  const list = Array.isArray(value) ? value : [];
  const set = (i: number, k: string, v: string) => onChange(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div className="space-y-2">
      {list.map((row, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-2xl border border-line bg-cream/60 p-3 sm:flex-row sm:items-start">
          <input className={`${inputCls} sm:w-56`} placeholder={labels[0]} value={row[keys[0]] ?? ""} onChange={(e) => set(i, keys[0], e.target.value)} aria-label={labels[0]} />
          {keys[1] === "text" ? (
            <textarea className={`${inputCls} min-h-[44px] flex-1`} rows={2} placeholder={labels[1]} value={row[keys[1]] ?? ""} onChange={(e) => set(i, keys[1], e.target.value)} aria-label={labels[1]} />
          ) : (
            <input className={`${inputCls} flex-1`} placeholder={labels[1]} value={row[keys[1]] ?? ""} onChange={(e) => set(i, keys[1], e.target.value)} aria-label={labels[1]} />
          )}
          <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))} className="self-end rounded-xl p-2.5 text-muted hover:bg-brand-50 hover:text-brand sm:self-auto" aria-label="Remove row">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...list, { [keys[0]]: "", [keys[1]]: "" }])} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-200 px-3.5 py-2 text-sm font-semibold text-brand hover:bg-brand-50">
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-3 text-sm font-semibold text-ink">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function FieldInput({ f, value, onChange, error }: { f: Field; value: any; onChange: (v: any) => void; error?: string }) {
  const id = useId();
  const common = { id, "aria-invalid": !!error || undefined, "aria-describedby": error ? `${id}-err` : undefined };
  let control: React.ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea {...common} className={inputCls} rows={3} maxLength={f.max} value={value ?? ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "longtext":
      control = <textarea {...common} className={inputCls} rows={8} maxLength={f.max} value={value ?? ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "number":
      control = <input {...common} type="number" className={`${inputCls} max-w-[10rem]`} value={value ?? 0} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />;
      break;
    case "date":
      control = <input {...common} type="date" className={`${inputCls} max-w-[14rem]`} value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value || null)} />;
      break;
    case "select":
      control = (
        <select {...common} className={inputCls} value={value ?? f.options?.[0]?.value} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case "toggle":
      return <Toggle checked={!!value} onChange={onChange} label={f.label} />;
    case "image":
      control = <ImageField value={value || { url: "" }} onChange={onChange} />;
      break;
    case "images":
      control = <ImagesField value={value || []} onChange={onChange} />;
      break;
    case "pairs":
      control = <ListEditor value={value} onChange={onChange} keys={["label", "value"]} labels={["Label", "Value"]} addLabel="Add row" />;
      break;
    case "cards":
      control = <ListEditor value={value} onChange={onChange} keys={["title", "text"]} labels={["Title", "Text"]} addLabel="Add item" />;
      break;
    default: {
      const type = f.type === "email" ? "email" : f.type === "tel" ? "tel" : f.type === "url" ? "url" : "text";
      const list = f.suggestions ? `${id}-list` : undefined;
      control = (
        <>
          <input {...common} type={type} list={list} className={inputCls} maxLength={f.type === "map" ? 1500 : f.max} value={value ?? ""} placeholder={f.placeholder || (f.type === "url" ? "https://" : "")} onChange={(e) => onChange(e.target.value)} />
          {list && <datalist id={list}>{f.suggestions!.map((s) => <option key={s} value={s} />)}</datalist>}
        </>
      );
    }
  }
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {f.label} {f.required && <span className="text-brand">*</span>}
      </label>
      {control}
      {f.help && !error && <p className="mt-1.5 text-xs text-muted">{f.help}</p>}
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs font-semibold text-brand-700">{error}</p>}
    </div>
  );
}
