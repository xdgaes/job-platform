import express from "express";
import {
  getAllCampaigns,
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaignAnalytics,
  addClip,
  createCampaignFeedback,
} from "../controllers/campaignController.js";
import { uploadCampaignImage } from "../middleware/uploadMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCampaigns);
router.get("/user/:userId", getCampaigns);
router.get("/:campaignId", getCampaignById);
router.post("/", uploadCampaignImage, createCampaign);
router.post("/:campaignId/analytics", updateCampaignAnalytics);
router.post("/clips", addClip);
router.post("/:campaignId/feedback", authenticateToken, createCampaignFeedback);

export default router;
