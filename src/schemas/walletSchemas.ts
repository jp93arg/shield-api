import { z } from "zod";

export const createWalletSchema = z.object({
  chain: z.string().min(1),
  address: z.string().min(1),
  tag: z.string().optional(),
});

// all the createWalletSchema but all of them are optional
export const updateWalletSchema = z.object({
  chain: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  tag: z.string().optional(),
});
