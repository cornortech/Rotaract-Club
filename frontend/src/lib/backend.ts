import "server-only";
import { cookies } from "next/headers";

/** Address of the backend API (no trailing slash). */
export function backendUrl() {
  return (process.env.BACKEND_URL || "https://rotaract-club-rwb4.onrender.com").replace(/\/$/, "");
}

export const SESSION_COOKIE = "rbs_admin";

/** The logged-in admin (asks the backend), or null. */
export async function getCurrentAdmin(): Promise<{ email: string; name: string } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${backendUrl()}/api/auth/me`, {
      headers: { cookie: `${SESSION_COOKIE}=${token}`, "x-internal-secret": process.env.INTERNAL_SECRET || "" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.ok ? json.data : null;
  } catch {
    return null;
  }
}
