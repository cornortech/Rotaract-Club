import { Router } from "express";
import { connectDB } from "../config/db.js";
import { Event, GalleryItem, HeroSlide, Message, Partner, TeamMember } from "../models/index.js";
import { ensureSeed, loadSettings, plain } from "../utils/content.js";
import { rateLimit } from "../utils/rateLimit.js";
import { contactSchema } from "../utils/validation.js";
import { clientIp, fail, sameSite, send, wrap } from "../middleware/security.js";

const r = Router();

// Small cache hint for browsers/CDNs (the frontend has its own cache too)
r.use((req, res, next) => {
  if (req.method === "GET") res.set("Cache-Control", "public, max-age=30, s-maxage=60");
  next();
});

/** Everything the public website needs in one request. */
r.get(
  "/site",
  wrap(async (req, res) => {
    await connectDB();
    await ensureSeed();
    const [settings, slides, events, team, gallery, partners] = await Promise.all([
      loadSettings(),
      HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 }).limit(10).lean(),
      Event.find({ published: true }).sort({ date: -1, createdAt: -1 }).lean(),
      TeamMember.find({ active: true }).sort({ order: 1, name: 1 }).lean(),
      GalleryItem.find({}).sort({ order: 1, createdAt: -1 }).lean(),
      Partner.find({}).sort({ order: 1, name: 1 }).lean(),
    ]);
    send(res, plain({ settings, slides, events, team, gallery, partners }));
  })
);

r.post(
  "/contact",
  sameSite,
  wrap(async (req, res) => {
    const parsed = contactSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue?.path[0] === "website") return send(res, null); // honeypot: pretend it worked
      return fail(res, issue?.message || "Please check the form");
    }
    await connectDB();
    if (!(await rateLimit(`contact:${clientIp(req)}`, 5, 30 * 60))) {
      return fail(res, "You have sent several messages already. Please try again later.", 429);
    }
    const { name, email, phone, subject, message } = parsed.data;
    await Message.create({ name, email, phone, subject, message });
    send(res, null);
  })
);

export default r;
