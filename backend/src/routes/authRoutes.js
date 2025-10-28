// routes/authRoutes.js
import express from "express";
import { register, login, switchRole } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", register);

// ✅ LOGIN
router.post("/login", login);

// ✅ SWITCH ROLE (protected route)
router.post("/switch-role", authMiddleware, switchRole);

export default router;
