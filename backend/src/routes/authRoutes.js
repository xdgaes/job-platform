import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧾 Register user baru
router.post("/register", register);

// 🔐 Login user (mengembalikan token JWT)
router.post("/login", login);

// 👤 Route contoh untuk verifikasi token (opsional)
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Authenticated user", user: req.user });
});

export default router;
