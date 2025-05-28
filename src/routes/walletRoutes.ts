import { Router } from "express";
import {
  getAllWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet
} from "../controllers/walletController";
import { authenticateToken } from "../middlewares/auth";
import { createWalletSchema, updateWalletSchema } from "../schemas/walletSchemas";
import { validateRequest } from "../middlewares/validateRequest";
import { idParamSchema } from "../schemas/commonSchemas";

const router = Router();

router.use(authenticateToken); // protects all routes below

router.get("/wallets", getAllWallets);

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Create a wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chain:
 *                 type: string
 *               address:
 *                 type: string
 *               tag:
 *                 type: string
 *             required:
 *               - chain
 *               - address
 *     responses:
 *       201:
 *         description: Wallet created successfully
 */
router.post("/wallets", validateRequest({body: createWalletSchema}), createWallet);

/**
 * @swagger
 * /wallets/{id}:
 *   get:
 *     summary: Get a wallet by ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet ID
 *     responses:
 *       200:
 *         description: Wallet retrieved successfully
 */
router.get("/wallets/:id", validateRequest({params: idParamSchema}), getWalletById);

/**
 * @swagger
 * /wallets/{id}:
 *   put:
 *     summary: Update a wallet by ID
 *     tags: [Wallets]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chain:
 *                 type: string
 *               address:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Wallet updated successfully
 */
router.put("/wallets/:id", validateRequest({params: idParamSchema, body: updateWalletSchema}), updateWallet);

/**
 * @swagger
 * /wallets/{id}:
 *   delete:
 *     summary: Delete a wallet by ID
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet ID
 *     responses:
 *       204:
 *         description: Wallet deleted successfully
 */
router.delete("/wallets/:id", validateRequest({params: idParamSchema}), deleteWallet);

export default router;
