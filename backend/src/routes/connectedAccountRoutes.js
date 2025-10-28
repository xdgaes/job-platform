import express from "express";
import {
  getConnectedAccounts,
  connectAccount,
  disconnectAccount,
  getAvailablePlatforms,
} from "../controllers/connectedAccountController.js";

const router = express.Router();

router.get("/user/:userId", getConnectedAccounts);
router.get("/user/:userId/available", getAvailablePlatforms);
router.post("/", connectAccount);
router.delete("/:accountId", disconnectAccount);

export default router;
