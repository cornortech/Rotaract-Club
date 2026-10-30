"use client";

import { useState } from "react";
import { CircleCheck, Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/public/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError((err as Error).message);
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-line bg-white p-10 text-center shadow-soft" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand">
          <CircleCheck className="h-8 w-8" aria-hidden />
        </span>
        <h3 className="h-display mt-5 text-2xl">Thank you!</h3>
        <p className="mt-2 max-w-sm text-muted">Your message has reached our team. We will get back to you soon.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-soft mt-6">
          Send another message
        </button>
      </div>
    );
  }

  const input =
    "mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/60 transition focus:border-brand focus:ring-4 focus:ring-brand-100 focus:outline-none";
  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Full name <span className="text-brand">*</span>
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} placeholder="Your name" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Email <span className="text-brand">*</span>
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={input} placeholder="you@example.com" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Phone
          <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={input} placeholder="98XXXXXXXX" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Subject
          <input name="subject" maxLength={150} className={input} placeholder="Partnership, project idea…" />
        </label>
        <label className="block text-sm font-semibold text-ink sm:col-span-2">
          Message <span className="text-brand">*</span>
          <textarea name="message" required minLength={10} maxLength={3000} rows={6} className={`${input} resize-y`} placeholder="How can we help?" />
        </label>
        {/* Honeypot: hidden from people, bots fill it in */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Website <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>
      {error && (
        <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="btn-primary mt-6 w-full sm:w-auto">
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
