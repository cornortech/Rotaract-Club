"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, LogOut, Save } from "lucide-react";
import { api } from "./api";
import { PageTitle } from "./AdminShell";
import { inputCls } from "./fields";
import { useToast } from "./Toast";

function strength(p: string) {
  let s = 0;
  if (p.length >= 10) s++;
  if (p.length >= 14) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}
const LABELS = ["Too weak", "Weak", "Okay", "Good", "Strong"];
const COLORS = ["bg-brand", "bg-brand", "bg-gold", "bg-emerald-500", "bg-emerald-600"];

export default function AccountForm() {
  const toast = useToast();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [current, setCurrent] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState<"" | "profile" | "password" | "logout">("");

  useEffect(() => {
    api("/api/admin/account").then((d) => setProfile({ name: d.name || "", email: d.email })).catch(() => {});
  }, []);

  async function submit(kind: "profile" | "password" | "logout") {
    if (!current) return toast("error", "Enter your current password first.");
    if (kind === "password") {
      if (pw !== pw2) return toast("error", "The new passwords do not match.");
      if (strength(pw) < 2 || pw.length < 10 || !/\d/.test(pw)) return toast("error", "Use at least 10 characters with letters and a number.");
    }
    setBusy(kind);
    try {
      const body =
        kind === "profile" ? { currentPassword: current, name: profile.name, email: profile.email } : kind === "password" ? { currentPassword: current, newPassword: pw } : { currentPassword: current, logoutOthers: true };
      const d = await api("/api/admin/account", { method: "PUT", body });
      setProfile({ name: d.name || "", email: d.email });
      setCurrent("");
      setPw("");
      setPw2("");
      toast("success", kind === "password" ? "Password changed. Other devices have been signed out." : kind === "logout" ? "All other devices signed out." : "Account details saved.");
    } catch (e) {
      toast("error", (e as Error).message);
    } finally {
      setBusy("");
    }
  }

  const st = strength(pw);
  const type = show ? "text" : "password";
  return (
    <>
      <PageTitle title="Account & password" text="Change your login email and password. Your current password is needed for any change." />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8 lg:col-span-2">
          <label className="block max-w-md text-sm font-semibold text-ink">
            Current password <span className="text-brand">*</span>
            <span className="relative mt-1.5 block">
              <input type={type} className={`${inputCls} pr-11`} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
              <button type="button" onClick={() => setShow((v) => !v)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:text-brand" aria-label={show ? "Hide passwords" : "Show passwords"}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-xl font-semibold">Login details</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-ink">Your name<input className={`${inputCls} mt-1.5`} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} maxLength={80} /></label>
            <label className="block text-sm font-semibold text-ink">Login email<input type="email" className={`${inputCls} mt-1.5`} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} maxLength={120} autoComplete="username" /></label>
          </div>
          <button type="button" onClick={() => submit("profile")} disabled={!!busy} className="btn-primary mt-6 !py-2.5">
            {busy === "profile" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save details
          </button>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-xl font-semibold">Change password</h2>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-ink">New password<input type={type} className={`${inputCls} mt-1.5`} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" maxLength={128} /></label>
            {pw && (
              <div>
                <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i < st ? COLORS[st] : "bg-line"}`} />)}</div>
                <p className="mt-1 text-xs font-semibold text-muted">{LABELS[st]} · at least 10 characters, letters and a number</p>
              </div>
            )}
            <label className="block text-sm font-semibold text-ink">Repeat new password<input type={type} className={`${inputCls} mt-1.5`} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" maxLength={128} /></label>
          </div>
          <button type="button" onClick={() => submit("password")} disabled={!!busy || !pw} className="btn-primary mt-6 !py-2.5">
            {busy === "password" ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Change password
          </button>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">Sign out other devices</h2>
          <p className="mt-1 text-sm text-muted">If you logged in on a shared computer, this signs out everywhere except here.</p>
          <button type="button" onClick={() => submit("logout")} disabled={!!busy} className="btn-outline mt-5 !py-2.5">
            {busy === "logout" ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />} Sign out other devices
          </button>
        </section>
      </div>
    </>
  );
}
