import { timingSafeEqual } from "node:crypto";

export function safeEqual(a, b) {
  const x = Buffer.from(String(a || ""));
  const y = Buffer.from(String(b || ""));
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y);
}

/** True when the request came through our own frontend (it adds a secret header). */
export function fromFrontend(req) {
  return safeEqual(req.get("x-internal-secret"), process.env.INTERNAL_SECRET);
}

/** Real visitor IP. The frontend forwards it; otherwise use the connection IP. */
export function clientIp(req) {
  if (fromFrontend(req) && req.get("x-client-ip")) return req.get("x-client-ip").slice(0, 64);
  return (req.ip || "unknown").slice(0, 64);
}

export function allowedOrigins() {
  return (process.env.FRONTEND_URL || "https://rotaract-xi.vercel.app/")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

/**
 * CSRF protection: write requests must come from our own website.
 * Browsers always send an Origin header on POST/PUT/DELETE.
 */
export function sameSite(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = (req.get("origin") || "").replace(/\/$/, "");
  if (origin && allowedOrigins().includes(origin)) return next();
  return res.status(403).json({ ok: false, error: "Request blocked" });
}

export function send(res, data, status = 200) {
  return res.status(status).json({ ok: true, data });
}
export function fail(res, error, status = 400, extra = {}) {
  return res.status(status).json({ ok: false, error, ...extra });
}

/** Wrap async route handlers so errors reach the error handler. */
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
