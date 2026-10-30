/**
 * Tells the frontend to refresh its cached pages after content changes.
 * Runs in the background; a failure only means the site refreshes a few minutes later.
 */
export function refreshSite() {
  const urls = (process.env.FRONTEND_URL || "").split(",").map((s) => s.trim().replace(/\/$/, "")).filter(Boolean);
  const secret = process.env.INTERNAL_SECRET;
  if (!urls.length || !secret) return Promise.resolve();
  return Promise.allSettled(
    urls.map((u) =>
      fetch(`${u}/api/revalidate`, { method: "POST", headers: { "x-internal-secret": secret }, signal: AbortSignal.timeout(5000) })
    )
  );
}
