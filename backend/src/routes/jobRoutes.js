// backend/routes/jobRoutes.js
import express from "express";
import { getJobs, createJob } from "../controllers/jobController.js";

const router = express.Router();

router.get("/", getJobs);
router.post("/", createJob);

export default router; // <— penting! ini yang bikin "default export"
