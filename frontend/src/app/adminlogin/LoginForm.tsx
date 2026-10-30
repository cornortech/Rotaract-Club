"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Login failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  const input = "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink transition focus:border-brand focus:ring-4 focus:ring-brand-100 focus:outline-none";
  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-white/90 p-6 shadow-lift backdrop-blur sm:p-8">
      <label className="block text-sm font-semibold text-ink">
        Email
        <input name="email" type="email" required autoComplete="username" className={input} autoFocus />
      </label>
      <label className="mt-4 block text-sm font-semibold text-ink">
        Password
        <span className="relative block">
          <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" className={`${input} pr-12`} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute top-1/2 right-2 mt-0.5 -translate-y-1/2 rounded-lg p-2 text-muted hover:text-brand" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
      </label>
      {error && <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full !py-3.5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-5 text-center text-xs text-muted">Protected area. Too many wrong attempts will lock sign-in for 15 minutes.</p>
    </form>
  );
}
