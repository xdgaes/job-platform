import express from "express";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";
import { getPosts, createPost, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Semua user yang login bisa akses
router.get("/", authenticateToken, getPosts);

// Hanya admin yang boleh create/delete
router.post("/", authenticateToken, authorizeAdmin, createPost);
router.delete("/:id", authenticateToken, authorizeAdmin, deletePost);

export default router;
