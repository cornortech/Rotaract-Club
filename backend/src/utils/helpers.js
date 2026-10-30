export function slugify(input) {
    return input
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120);
}
export function formatDate(d, opts = { day: "numeric", month: "long", year: "numeric" }) {
    if (!d)
        return "";
    const date = new Date(d);
    if (Number.isNaN(date.getTime()))
        return "";
    return date.toLocaleDateString("en-GB", { ...opts, timeZone: "Asia/Kathmandu" });
}
export function paragraphs(text) {
    return (text || "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
}
export function siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
export function initials(name) {
    return name
        .replace(/^(rtr\.?|rtn\.?|pp|ipp)\s+/i, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}
