// Emergency password reset (if you forget the admin password).
// Usage:  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='New-Strong-Pass-123' npm run reset-admin
// It reads MONGODB_URI from the backend .env file.
import "dotenv/config";
import { config } from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const uri = process.env.MONGODB_URI;
const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";

if (!uri || !email || password.length < 10 || !/[a-z]/i.test(password) || !/\d/.test(password)) {
  console.error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD (min 10 characters, letters + a number).");
  process.exit(1);
}

await mongoose.connect(uri);
const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema(
    { email: String, name: String, passwordHash: String, tokenVersion: { type: Number, default: 0 }, lastLoginAt: Date },
    { timestamps: true }
  )
);
const hash = await bcrypt.hash(password, 12);
const existing = await Admin.findOne({}).sort({ createdAt: 1 });
if (existing) {
  existing.email = email;
  existing.passwordHash = hash;
  existing.tokenVersion = (existing.tokenVersion || 0) + 1; // signs out all devices
  await existing.save();
  console.log(`Admin updated. Log in at /adminlogin with ${email}`);
} else {
  await Admin.create({ email, name: "Admin", passwordHash: hash });
  console.log(`Admin created. Log in at /adminlogin with ${email}`);
}
await mongoose.disconnect();
