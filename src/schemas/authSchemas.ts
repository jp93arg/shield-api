import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const signinSchema = signupSchema; // Same structure

export type SignupInput = z.infer<typeof signupSchema>;
