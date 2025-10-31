import express from "express";
import {
  getAllCampaigns,
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaignAnalytics,
  addClip,
} from "../controllers/campaignController.js";
import { uploadCampaignImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllCampaigns);
router.get("/user/:userId", getCampaigns);
router.get("/:campaignId", getCampaignById);
router.post("/", uploadCampaignImage, createCampaign);
router.post("/:campaignId/analytics", updateCampaignAnalytics);
router.post("/clips", addClip);

export default router;
