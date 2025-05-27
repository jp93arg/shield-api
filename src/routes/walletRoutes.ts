import { Router } from "express";
import {
  getAllWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet
} from "../controllers/walletController";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.use(authenticateToken); // protects all routes below

router.get("/wallets", getAllWallets);
router.post("/wallets", createWallet);
router.get("/wallets/:id", getWalletById);
router.put("/wallets/:id", updateWallet);
router.delete("/wallets/:id", deleteWallet);

export default router;
