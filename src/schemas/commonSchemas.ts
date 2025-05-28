import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "ID must be a number" }),
});
