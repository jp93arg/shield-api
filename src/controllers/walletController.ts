import { RequestHandler } from "express";
import Wallet from "../models/wallet";
import { AuthRequest } from "../middlewares/auth";
import { addressValidatorMap } from "../utils/addressValidator";

// Get all wallets
export const getAllWallets: RequestHandler = async (req, res) => {
  const userId = (req as AuthRequest).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
  
    const offset = (page - 1) * limit;
  
    const { count, rows } = await Wallet.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  
    res.json({
      data: rows,
      meta: {
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      },
    });
  };

// Get a wallet by ID
export const getWalletById: RequestHandler = async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const id = Number(req.params.id);
  const wallet = await Wallet.findOne({ where: { id, userId } });

  if (!wallet) {
    res.status(404).json({ message: "Wallet not found" });
    return;
  }

  res.json(wallet);
};

// Create a new wallet
export const createWallet: RequestHandler = async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const { tag, chain, address } = req.body;

  if (!chain || !address) {
    res.status(400).json({ message: "chain and address required" });
    return;
  }

  const wallet = await Wallet.create({ tag, chain, address, userId });
  res.status(201).json(wallet);
};

// Update a wallet
export const updateWallet: RequestHandler = async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const id = Number(req.params.id);
  const { tag, chain, address } = req.body;

  const wallet = await Wallet.findOne({ where: { id, userId } });
  if (!wallet) {
    res.status(404).json({ message: "Wallet not found" });
    return;
  }

  const finalChain = req.body.chain || wallet.chain;
  const addressValidator = addressValidatorMap[finalChain];
  if (address && !addressValidator?.isValid(address)) {
    res.status(400).json({ message: "Address format is invalid for the selected chain" });
    return;
  }

  await wallet.update({ tag, chain, address });
  res.json(wallet);
};

// Delete a wallet
export const deleteWallet: RequestHandler = async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const id = Number(req.params.id);

  const wallet = await Wallet.findOne({ where: { id, userId } });
  if (!wallet) {
    res.status(404).json({ message: "Wallet not found" });
    return;
  }

  await wallet.destroy();
  res.status(204).end();
};
