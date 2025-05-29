import { Router } from "express";
import {
  getAllWallets,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet
} from "../controllers/walletController";
import { authenticateToken } from "../middlewares/auth";
import { createWalletSchema, updateWalletSchema, getWalletsQuerySchema } from "../schemas/walletSchemas";
import { validateRequest } from "../middlewares/validateRequest";
import { idParamSchema } from "../schemas/commonSchemas";

const router = Router();
router.use("/wallets", router);

router.use(authenticateToken); // protects all routes below

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Get paginated list of wallets
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       tag:
 *                         type: string
 *                         example: Main Wallet
 *                       chain:
 *                         type: string
 *                         example: Ethereum
 *                       address:
 *                         type: string
 *                         example: 0xabc123...
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     totalItems:
 *                       type: integer
 *                       example: 25
 */
router.get("/", validateRequest({query: getWalletsQuerySchema}), getAllWallets);

/**
 * @swagger
 * /api/wallets:
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
router.post("/", validateRequest({body: createWalletSchema}), createWallet);

/**
 * @swagger
 * /api/wallets/{id}:
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
router.get("/:id", validateRequest({params: idParamSchema}), getWalletById);

/**
 * @swagger
 * /api/wallets/{id}:
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
router.put("/:id", validateRequest({params: idParamSchema, body: updateWalletSchema}), updateWallet);

/**
 * @swagger
 * /api/wallets/{id}:
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
router.delete("/:id", validateRequest({params: idParamSchema}), deleteWallet);

export default router;
