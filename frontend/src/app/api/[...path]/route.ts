import { type NextRequest } from "next/server";
import { backendUrl } from "@/lib/backend";

/**
 * Passes browser requests for /api/* on to the backend.
 * The browser only ever talks to this website, so the admin login cookie
 * stays first-party and secure. The real visitor IP is forwarded so the
 * backend can rate-limit per person.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const FORWARD_REQ = ["content-type", "cookie", "origin", "user-agent", "accept"];
const FORWARD_RES = ["content-type", "cache-control"];

async function handle(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const target = `${backendUrl()}/api/${path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  for (const h of FORWARD_REQ) {
    const v = req.headers.get(h);
    if (v) headers.set(h, v);
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  headers.set("x-client-ip", ip);
  headers.set("x-internal-secret", process.env.INTERNAL_SECRET || "");

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(55000),
    });
  } catch {
    return Response.json({ ok: false, error: "The server is not reachable right now. Please try again in a minute." }, { status: 502 });
  }

  const out = new Headers();
  for (const h of FORWARD_RES) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }
  for (const c of upstream.headers.getSetCookie()) out.append("set-cookie", c);
  return new Response(upstream.body, { status: upstream.status, headers: out });
}

export { handle as GET, handle as POST, handle as PUT, handle as DELETE, handle as PATCH };
