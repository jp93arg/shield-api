import { RequestHandler } from "express";
import Wallet from "../models/wallet";
import { AuthRequest } from "../middlewares/auth";

// Get all wallets
export const getAllWallets: RequestHandler = async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const wallets = await Wallet.findAll({ where: { userId } });
  res.json(wallets);
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
  res.json({ message: "Wallet deleted" });
};
