import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import connectedAccountRoutes from "./routes/connectedAccountRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/connected-accounts", connectedAccountRoutes);

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

export default app;