import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import publicRoutes from "./routes/public.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import { allowedOrigins } from "./middleware/security.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
app.use(
  cors({
    origin: (origin, cb) => cb(null, !origin || allowedOrigins().includes(origin.replace(/\/$/, ""))),
    credentials: true,
  })
);
if (process.env.NODE_ENV !== "test") app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

app.get("/", (req, res) => res.json({ ok: true, message: "Rotaract Club of Butwal Synergy API is running." }));
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ ok: false, error: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.type === "entity.too.large") return res.status(413).json({ ok: false, error: "Data is too large" });
  if (err?.type === "entity.parse.failed") return res.status(400).json({ ok: false, error: "Invalid data" });
  console.error("[error]", err?.message || err);
  const dbDown = /MONGODB_URI|ECONNREFUSED|Server selection/i.test(err?.message || "");
  res.status(500).json({ ok: false, error: dbDown ? "Database is not connected. Check MONGODB_URI." : "Something went wrong. Please try again." });
});

export default app;
