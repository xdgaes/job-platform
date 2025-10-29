// routes/authRoutes.js
import express from "express";
import { register, login, switchRole, updateProfilePicture, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", register);

// ✅ LOGIN
router.post("/login", login);

// ✅ GET PROFILE (protected route)
router.get("/profile", authenticateToken, getProfile);

// ✅ SWITCH ROLE (protected route)
router.post("/switch-role", authenticateToken, switchRole);

// ✅ UPDATE PROFILE PICTURE (protected route)
router.post("/profile-picture", authenticateToken, uploadProfileImage, updateProfilePicture);

export default router;
