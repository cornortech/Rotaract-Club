import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

/** The backend calls this after any admin change, so the website updates instantly. */
export async function POST(req: Request) {
  const given = Buffer.from(req.headers.get("x-internal-secret") || "");
  const secret = Buffer.from(process.env.INTERNAL_SECRET || "");
  if (!secret.length || given.length !== secret.length || !timingSafeEqual(given, secret)) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag("site", { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
