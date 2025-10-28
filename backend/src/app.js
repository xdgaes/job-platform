import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

dotenv.config();
const app = express();

// CORS with preflight caching
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400 // 24h preflight cache
}));

// Gzip/deflate compression
app.use(compression());

// Static asset caching (if serving assets)
app.use(express.static("public", { maxAge: "7d", etag: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/wallet", walletRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

export default app;