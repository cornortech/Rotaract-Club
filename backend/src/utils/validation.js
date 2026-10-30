import { z } from "zod";
import { getPath, setPath } from "../data/fields.js";
const str = (max = 500) => z.string().trim().max(max);
/** Safe link: site path, anchor, mailto, tel or http(s). Blocks javascript: etc. */
export function isSafeLink(v) {
    if (!v)
        return true;
    if (v.startsWith("/") && !v.startsWith("//"))
        return true;
    if (v.startsWith("#"))
        return true;
    if (/^mailto:[^\s]+$/i.test(v) || /^tel:[0-9+()\-\s]+$/i.test(v))
        return true;
    return isHttpUrl(v);
}
export function isHttpUrl(v) {
    try {
        const u = new URL(v);
        return u.protocol === "https:" || u.protocol === "http:";
    }
    catch {
        return false;
    }
}
function isImageUrl(v) {
    if (!v)
        return true;
    if (v.startsWith("/") && !v.startsWith("//"))
        return true;
    try {
        return new URL(v).protocol === "https:";
    }
    catch {
        return false;
    }
}
/** Accept a Google Maps embed URL, or the full <iframe> HTML, and return only a safe src. */
export function cleanMapUrl(input) {
    let v = input.trim();
    if (!v)
        return "";
    const m = v.match(/src=["']([^"']+)["']/i);
    if (m)
        v = m[1];
    v = v.replace(/&amp;/g, "&");
    try {
        const u = new URL(v);
        const okHost = ["www.google.com", "google.com", "maps.google.com"].includes(u.hostname);
        if (u.protocol !== "https:" || !okHost || !u.pathname.startsWith("/maps"))
            return null;
        return u.toString();
    }
    catch {
        return null;
    }
}
const imageSchema = z
    .object({ url: str(1000).refine(isImageUrl, "Image must be an https link"), publicId: str(300).optional().default("") })
    .default({ url: "", publicId: "" });
function fieldSchema(f) {
    switch (f.type) {
        case "text":
        case "textarea":
        case "longtext": {
            let s = str(f.max ?? (f.type === "longtext" ? 20000 : 500));
            if (f.required)
                s = s.min(1, `${f.label} is required`);
            return s;
        }
        case "email":
            return str(f.max ?? 120).refine((v) => !v || z.email().safeParse(v).success, "Enter a valid email");
        case "tel":
            return str(f.max ?? 40).refine((v) => /^[0-9+()\-\s]*$/.test(v), "Enter a valid phone number");
        case "link":
            return str(f.max ?? 500).refine(isSafeLink, "Use a link like /about or https://…");
        case "url":
            return str(f.max ?? 500).refine((v) => !v || isHttpUrl(v), "Use a full link starting with https://");
        case "number":
            return z.coerce.number().int().min(-100000).max(100000).catch(0);
        case "date":
            return z
                .union([z.null(), z.literal(""), z.string().max(40)])
                .transform((v, ctx) => {
                if (!v)
                    return null;
                const d = new Date(v);
                if (Number.isNaN(d.getTime())) {
                    ctx.addIssue({ code: "custom", message: "Invalid date" });
                    return z.NEVER;
                }
                return d;
            });
        case "image":
            return f.required
                ? imageSchema.refine((v) => Boolean(v.url), `${f.label} is required`)
                : imageSchema;
        case "images":
            return z.array(imageSchema).max(40).default([]);
        case "toggle":
            return z.coerce.boolean().default(false);
        case "select": {
            const values = (f.options ?? []).map((o) => o.value);
            return z.string().refine((v) => values.includes(v), "Choose a valid option");
        }
        case "pairs":
            return z.array(z.object({ label: str(80), value: str(200) })).max(20).default([]);
        case "cards":
            return z.array(z.object({ title: str(80), text: str(300) })).max(12).default([]);
        case "map":
            return str(f.max ?? 1500).transform((v, ctx) => {
                const clean = cleanMapUrl(v);
                if (clean === null) {
                    ctx.addIssue({ code: "custom", message: "Paste a Google Maps embed link" });
                    return z.NEVER;
                }
                return clean;
            });
    }
}
/** Validate input against a list of fields. Unknown keys are dropped. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateFields(fields, input, opts = {}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data = {};
    const errors = {};
    for (const f of fields) {
        const raw = getPath(input, f.name);
        if (opts.partial && raw === undefined)
            continue;
        const r = fieldSchema(f).safeParse(raw === undefined ? defaultFor(f) : raw);
        if (r.success)
            data = setPath(data, f.name, r.data);
        else
            errors[f.name] = r.error.issues[0]?.message || "Invalid value";
    }
    return { data, errors, ok: Object.keys(errors).length === 0 };
}
function defaultFor(f) {
    switch (f.type) {
        case "toggle":
            return false;
        case "number":
            return 0;
        case "date":
            return null;
        case "image":
            return { url: "", publicId: "" };
        case "images":
        case "pairs":
        case "cards":
            return [];
        case "select":
            return f.options?.[0]?.value ?? "";
        default:
            return "";
    }
}
export const contactSchema = z.object({
    name: str(100).min(2, "Please enter your name"),
    email: z.email("Please enter a valid email").max(120),
    phone: str(40).refine((v) => /^[0-9+()\-\s]*$/.test(v), "Enter a valid phone number").optional().default(""),
    subject: str(150).optional().default(""),
    message: str(3000).min(10, "Message should be at least 10 characters"),
    website: z.string().max(0).optional().default(""), // honeypot: must stay empty
});
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().max(120),
    password: z.string().min(1).max(200),
});
export const passwordSchema = z
    .string()
    .min(10, "Use at least 10 characters")
    .max(128)
    .refine((v) => /[a-z]/i.test(v) && /\d/.test(v), "Use letters and at least one number");
