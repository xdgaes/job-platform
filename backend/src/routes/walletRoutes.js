import express from "express";
import { getWallet, updateWallet } from "../controllers/walletController.js";

const router = express.Router();

router.get("/:userId", getWallet);
router.post("/:userId", updateWallet);

export default router;
