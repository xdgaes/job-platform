import express from "express";
import { 
  getWallet, 
  addFunds, 
  withdrawFunds, 
  getTransactions 
} from "../controllers/walletController.js";

const router = express.Router();

router.get("/:userId", getWallet);
router.get("/:userId/transactions", getTransactions);
router.post("/:userId/add", addFunds);
router.post("/:userId/withdraw", withdrawFunds);

export default router;
