import { Router } from "express";
import multer from "multer";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "../config/db.js";
import { cloudinaryReady, destroyImage, sniffImage, uploadBuffer, uploadFromUrl } from "../config/cloudinary.js";
import { Admin, Event, GalleryItem, HeroSlide, Message, Partner, Settings, TeamMember } from "../models/index.js";
import { RESOURCES, SETTINGS_SECTIONS } from "../data/fields.js";
import { requireAdmin, setSessionCookie, signSession } from "../middleware/auth.js";
import { fail, sameSite, send, wrap } from "../middleware/security.js";
import { collectPublicIds, deepMerge, ensureSeed, externalImageCount, loadSettings, plain, uniqueSlug } from "../utils/content.js";
import { rateLimit } from "../utils/rateLimit.js";
import { refreshSite } from "../utils/revalidate.js";
import { passwordSchema, validateFields } from "../utils/validation.js";

const r = Router();
r.use(sameSite, requireAdmin, (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const MODELS = { hero: HeroSlide, events: Event, team: TeamMember, gallery: GalleryItem, partners: Partner, messages: Message };
const ALL_SETTINGS_FIELDS = SETTINGS_SECTIONS.flatMap((s) => s.fields);

async function cleanupImages(before, after) {
  const keep = new Set(after);
  await Promise.all(before.filter((id) => !keep.has(id)).map((id) => destroyImage(id)));
}
const imageFieldsOf = (cfg, doc) => Object.fromEntries(cfg.fields.filter((f) => f.type === "image" || f.type === "images").map((f) => [f.name, doc?.[f.name]]));

/* ---------- Form definitions (the admin panel builds its forms from these) ---------- */
r.get("/schema", (req, res) => send(res, { settings: SETTINGS_SECTIONS, resources: RESOURCES }));

/* ---------- Dashboard ---------- */
r.get(
  "/overview",
  wrap(async (req, res) => {
    await connectDB();
    await ensureSeed();
    const [events, team, gallery, partners, slides, unread, messages, recent, settings, ev, tm, gl, sl, pt] = await Promise.all([
      Event.countDocuments(),
      TeamMember.countDocuments(),
      GalleryItem.countDocuments(),
      Partner.countDocuments(),
      HeroSlide.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.countDocuments(),
      Message.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      Settings.findById("site").lean(),
      Event.find({}, { coverImage: 1, images: 1 }).lean(),
      TeamMember.find({}, { photo: 1 }).lean(),
      GalleryItem.find({}, { image: 1 }).lean(),
      HeroSlide.find({}, { image: 1 }).lean(),
      Partner.find({}, { logo: 1 }).lean(),
    ]);
    send(res, {
      counts: { events, team, gallery, partners, slides, unread, messages },
      recent: plain(recent),
      cloudinary: cloudinaryReady(),
      externalImages: externalImageCount([settings?.data, ev, tm, gl, sl, pt]),
      admin: { email: req.admin.email, name: req.admin.name },
    });
  })
);

/* ---------- Site settings ---------- */
r.get("/settings", wrap(async (req, res) => send(res, await loadSettings())));

r.put(
  "/settings",
  wrap(async (req, res) => {
    const { data, errors, ok } = validateFields(ALL_SETTINGS_FIELDS, req.body ?? {}, { partial: true });
    if (!ok) return fail(res, "Please fix the highlighted fields", 422, { errors });
    const current = await loadSettings();
    const next = deepMerge(current, data);
    await Settings.updateOne({ _id: "site" }, { $set: { data: next } }, { upsert: true });
    await cleanupImages(collectPublicIds(current), collectPublicIds(next));
    await refreshSite();
    send(res, next);
  })
);

/* ---------- Image upload (Cloudinary) ---------- */
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1 } });
r.post(
  "/upload",
  (req, res, next) =>
    upload.single("file")(req, res, (err) => (err ? fail(res, err.code === "LIMIT_FILE_SIZE" ? "Image is too large (max 8 MB)" : "Upload failed") : next())),
  wrap(async (req, res) => {
    if (!req.file) return fail(res, "No file received");
    if (!sniffImage(req.file.buffer)) return fail(res, "Only JPG, PNG, WEBP, GIF or AVIF images are allowed");
    if (!cloudinaryReady()) return fail(res, "Cloudinary is not set up. Add the CLOUDINARY_* settings to the backend.", 500);
    if (!(await rateLimit(`upload:${req.admin._id}`, 120, 10 * 60))) return fail(res, "Too many uploads, please wait a few minutes.", 429);
    try {
      send(res, await uploadBuffer(req.file.buffer));
    } catch (e) {
      console.error("[upload]", e.message);
      fail(res, "Upload failed. Check your Cloudinary keys.", 500);
    }
  })
);

/* ---------- Copy starter images into your Cloudinary ---------- */
r.post(
  "/migrate-images",
  wrap(async (req, res) => {
    if (!cloudinaryReady()) return fail(res, "Cloudinary is not set up yet.", 500);
    await connectDB();
    const cache = new Map();
    let moved = 0;
    let failed = 0;
    const started = Date.now();
    async function fix(obj) {
      let changed = false;
      if (!obj || typeof obj !== "object") return false;
      if (Array.isArray(obj)) {
        for (const x of obj) changed = (await fix(x)) || changed;
        return changed;
      }
      if (typeof obj.url === "string" && /^https?:\/\//.test(obj.url) && !obj.url.includes("res.cloudinary.com") && Date.now() - started < 45000) {
        try {
          const up = cache.get(obj.url) ?? (await uploadFromUrl(obj.url));
          cache.set(obj.url, up);
          obj.url = up.url;
          obj.publicId = up.publicId;
          moved++;
          changed = true;
        } catch {
          failed++;
        }
      }
      for (const v of Object.values(obj)) if (v && typeof v === "object") changed = (await fix(v)) || changed;
      return changed;
    }
    const settings = await Settings.findById("site").lean();
    if (settings?.data && (await fix(settings.data))) await Settings.updateOne({ _id: "site" }, { $set: { data: settings.data } });
    for (const model of [HeroSlide, Event, TeamMember, GalleryItem, Partner]) {
      for (const d of await model.find({}).lean()) {
        const { _id, ...rest } = d;
        if (await fix(rest)) await model.updateOne({ _id }, { $set: rest });
      }
    }
    await refreshSite();
    send(res, { moved, failed });
  })
);

/* ---------- Account & password ---------- */
const accountSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password").max(200),
  name: z.string().trim().max(80).optional(),
  email: z.email("Enter a valid email").max(120).optional().or(z.literal("")),
  newPassword: z.string().max(128).optional().or(z.literal("")),
  logoutOthers: z.boolean().optional(),
});

r.get("/account", (req, res) => send(res, { email: req.admin.email, name: req.admin.name }));

r.put(
  "/account",
  wrap(async (req, res) => {
    const parsed = accountSchema.safeParse(req.body ?? {});
    if (!parsed.success) return fail(res, parsed.error.issues[0]?.message || "Invalid data");
    const { currentPassword, name, email, newPassword, logoutOthers } = parsed.data;
    if (!(await rateLimit(`account:${req.admin._id}`, 10, 15 * 60))) return fail(res, "Too many attempts. Try again later.", 429);
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return fail(res, "Please log in again", 401);
    if (!(await bcrypt.compare(currentPassword, admin.passwordHash))) return fail(res, "Current password is incorrect", 401);
    if (newPassword) {
      const p = passwordSchema.safeParse(newPassword);
      if (!p.success) return fail(res, p.error.issues[0]?.message || "Password is too weak");
      admin.passwordHash = await bcrypt.hash(newPassword, 12);
    }
    if (email && email.toLowerCase() !== admin.email) {
      if (await Admin.exists({ email: email.toLowerCase(), _id: { $ne: admin._id } })) return fail(res, "That email is already used");
      admin.email = email.toLowerCase();
    }
    if (name !== undefined) admin.name = name || "Admin";
    if (newPassword || logoutOthers) admin.tokenVersion = (admin.tokenVersion ?? 0) + 1; // signs out other devices
    await admin.save();
    setSessionCookie(res, await signSession(admin));
    send(res, { email: admin.email, name: admin.name });
  })
);

/* ---------- Events, team, gallery, hero, partners, messages ---------- */
function resource(req, res) {
  const cfg = RESOURCES[req.params.resource];
  if (!cfg || !Object.hasOwn(MODELS, req.params.resource)) {
    fail(res, "Not found", 404);
    return null;
  }
  return { cfg, model: MODELS[req.params.resource] };
}

r.get(
  "/items/:resource",
  wrap(async (req, res) => {
    const x = resource(req, res);
    if (!x) return;
    await ensureSeed();
    send(res, plain(await x.model.find({}).sort(x.cfg.sort).limit(1000).lean()));
  })
);

r.post(
  "/items/:resource",
  wrap(async (req, res) => {
    const x = resource(req, res);
    if (!x) return;
    if (!x.cfg.canCreate) return fail(res, "Not found", 404);
    const body = req.body ?? {};
    if (x.cfg.bulkImages && Array.isArray(body.items)) {
      const docs = [];
      for (const it of body.items.slice(0, 50)) {
        const v = validateFields(x.cfg.fields, it);
        if (!v.ok) return fail(res, "Please fix the highlighted fields", 422, { errors: v.errors });
        docs.push(v.data);
      }
      const created = await x.model.insertMany(docs);
      await refreshSite();
      return send(res, plain(created));
    }
    const { data, errors, ok } = validateFields(x.cfg.fields, body);
    if (!ok) return fail(res, "Please fix the highlighted fields", 422, { errors });
    if (x.cfg.key === "events") data.slug = await uniqueSlug(x.model, data.slug || data.title);
    const created = await x.model.create(data);
    await refreshSite();
    send(res, plain(created));
  })
);

r.put(
  "/items/:resource/:id",
  wrap(async (req, res) => {
    const x = resource(req, res);
    if (!x) return;
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, "Not found", 404);
    const { data, errors, ok } = validateFields(x.cfg.fields, req.body ?? {}, { partial: x.cfg.key === "messages" });
    if (!ok) return fail(res, "Please fix the highlighted fields", 422, { errors });
    const before = await x.model.findById(req.params.id).lean();
    if (!before) return fail(res, "Not found", 404);
    if (x.cfg.key === "events") data.slug = await uniqueSlug(x.model, data.slug || data.title, req.params.id);
    const updated = await x.model.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true }).lean();
    await cleanupImages(collectPublicIds(imageFieldsOf(x.cfg, before)), collectPublicIds(imageFieldsOf(x.cfg, updated)));
    if (x.cfg.key !== "messages") await refreshSite();
    send(res, plain(updated));
  })
);

r.delete(
  "/items/:resource/:id",
  wrap(async (req, res) => {
    const x = resource(req, res);
    if (!x) return;
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, "Not found", 404);
    const doc = await x.model.findByIdAndDelete(req.params.id).lean();
    if (!doc) return fail(res, "Not found", 404);
    await cleanupImages(collectPublicIds(imageFieldsOf(x.cfg, doc)), []);
    if (x.cfg.key !== "messages") await refreshSite();
    send(res, null);
  })
);

export default r;
