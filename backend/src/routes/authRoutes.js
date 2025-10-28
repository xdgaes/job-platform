// routes/authRoutes.js
import express from "express";
import { register, login, switchRole } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", register);

// ✅ LOGIN
router.post("/login", login);

// ✅ SWITCH ROLE (protected route)
router.post("/switch-role", authenticateToken, switchRole);

export default router;
