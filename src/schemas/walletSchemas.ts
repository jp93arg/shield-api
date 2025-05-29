import { z } from "zod";
import { addressValidatorMap } from "../utils/addressValidator";

export const supportedChains = ["bitcoin", "ethereum", "tron"] as const;

export const chainEnum = z.enum(supportedChains, {
  errorMap: () => ({
    message: `Chain must be one of: ${supportedChains.join(", ")}`,
  }),
});

export const createWalletSchema = z
  .object({
    chain: chainEnum,
    address: z.string().min(1),
    tag: z.string().optional(),
  })
  .refine(
    ({ chain, address }) => {
      const validator = addressValidatorMap[chain];
      return validator?.isValid(address);
    },
    {
      path: ["address"],
      message: "Address format is invalid for the selected chain",
    }
  );

// all the createWalletSchema but all of them are optional
export const updateWalletSchema = z.object({
  chain: chainEnum.optional(),
  address: z.string().min(1).optional(),
  tag: z.string().optional(),
});

export const getWalletsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(Number)
    .refine((n) => n > 0, {
      message: "Page must be a positive number",
    }),
  limit: z
    .string()
    .optional()
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, {
      message: "Limit must be between 1 and 100",
    }),
});
