import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email().min(1, "Required"),
  password: z.string().min(8, "Minimum of 8 characters"),
});
