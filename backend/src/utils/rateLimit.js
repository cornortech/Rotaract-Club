import { connectDB } from "../config/db.js";
import { RateLimit } from "../models/index.js";

/** Database-backed rate limit (works on serverless). Returns true when allowed. */
export async function rateLimit(key, limit, windowSeconds) {
  await connectDB();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowSeconds * 1000);
  await RateLimit.deleteOne({ key, expiresAt: { $lte: now } });
  const bump = () => RateLimit.findOneAndUpdate({ key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, new: true }).lean();
  let doc;
  try {
    doc = await bump();
  } catch {
    doc = await bump(); // two requests raced to create the same key
  }
  return (doc?.count ?? 0) <= limit;
}

export async function clearRateLimit(key) {
  await connectDB();
  await RateLimit.deleteOne({ key });
}
