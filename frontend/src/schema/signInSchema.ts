import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email().min(1, "Required"),
  password: z.string().min(8, "Minimum of 8 characters"),
});
