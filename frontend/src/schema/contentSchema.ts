import { z } from "zod";

export const contentSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  link: z.string().min(1, "Required"),
  tags: z.string().optional(),
  type: z.string().optional(),
});
