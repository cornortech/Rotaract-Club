import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.error("MongoDB connection failed:", e.message));
