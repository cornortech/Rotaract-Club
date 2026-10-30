import { SignJWT, jwtVerify } from "jose";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/index.js";
import { fail } from "./security.js";

export const SESSION_COOKIE = "rbs_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function authConfigured() {
  return process.env.NODE_ENV !== "production" || (process.env.JWT_SECRET || "").length >= 32;
}

function key() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be at least 32 characters");
    return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret-change-me");
  }
  return new TextEncoder().encode(s);
}

export async function signSession(admin) {
  return new SignJWT({ v: admin.tokenVersion ?? 0 })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin._id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setAudience("rbs-admin")
    .sign(key());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], audience: "rbs-admin" });
    return payload.sub ? { sub: payload.sub, v: Number(payload.v ?? 0) } : null;
  } catch {
    return null;
  }
}

const cookieOpts = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, { ...cookieOpts(), maxAge: SESSION_MAX_AGE * 1000 });
}
export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, cookieOpts());
}

/** Protects admin routes: valid login + password not changed since. */
export async function requireAdmin(req, res, next) {
  try {
    const p = await verifySession(req.cookies?.[SESSION_COOKIE]);
    if (!p) return fail(res, "Please log in again", 401);
    await connectDB();
    const admin = await Admin.findById(p.sub).select("email name tokenVersion").lean();
    if (!admin || (admin.tokenVersion ?? 0) !== p.v) return fail(res, "Please log in again", 401);
    req.admin = { _id: String(admin._id), email: admin.email, name: admin.name, tokenVersion: admin.tokenVersion ?? 0 };
    next();
  } catch (e) {
    next(e);
  }
}
