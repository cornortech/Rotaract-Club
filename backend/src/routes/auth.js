import { Router } from "express";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/index.js";
import { authConfigured, clearSessionCookie, requireAdmin, setSessionCookie, signSession } from "../middleware/auth.js";
import { clientIp, fail, sameSite, send, wrap } from "../middleware/security.js";
import { clearRateLimit, rateLimit } from "../utils/rateLimit.js";
import { ensureSeed } from "../utils/content.js";
import { loginSchema } from "../utils/validation.js";

const r = Router();
let dummyHash = null; // keeps timing equal when the email is unknown

r.post(
  "/login",
  sameSite,
  wrap(async (req, res) => {
    if (!authConfigured()) return fail(res, "JWT_SECRET is missing on the server. Add it and redeploy.", 500);
    const parsed = loginSchema.safeParse(req.body ?? {});
    if (!parsed.success) return fail(res, "Enter your email and password");
    const { email, password } = parsed.data;

    await connectDB();
    const ipKey = `login:ip:${clientIp(req)}`;
    const emailKey = `login:email:${email}`;
    const [ipOk, emailOk] = await Promise.all([rateLimit(ipKey, 10, 15 * 60), rateLimit(emailKey, 8, 15 * 60)]);
    if (!ipOk || !emailOk) return fail(res, "Too many attempts. Please wait 15 minutes and try again.", 429);

    await ensureSeed();
    let admin = await Admin.findOne({ email });

    // Very first login: create the admin from ADMIN_EMAIL / ADMIN_PASSWORD
    if (!admin && (await Admin.estimatedDocumentCount()) === 0) {
      const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const envPass = process.env.ADMIN_PASSWORD || "";
      if (envEmail && envPass.length >= 8 && email === envEmail && password === envPass) {
        admin = await Admin.create({ email: envEmail, passwordHash: await bcrypt.hash(envPass, 12) });
      }
    }

    dummyHash ??= await bcrypt.hash("not-a-real-password", 12);
    const valid = await bcrypt.compare(password, admin?.passwordHash || dummyHash);
    if (!admin || !valid) return fail(res, "Incorrect email or password", 401);

    admin.lastLoginAt = new Date();
    await admin.save();
    await Promise.all([clearRateLimit(emailKey), clearRateLimit(ipKey)]);
    setSessionCookie(res, await signSession(admin));
    send(res, null);
  })
);

r.post("/logout", sameSite, (req, res) => {
  clearSessionCookie(res);
  send(res, null);
});

r.get("/me", requireAdmin, (req, res) => send(res, { email: req.admin.email, name: req.admin.name }));

export default r;
