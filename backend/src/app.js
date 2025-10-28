import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import connectedAccountRoutes from "./routes/connectedAccountRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

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