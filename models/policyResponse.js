import { z } from "zod";

export const PolicyItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  region: z.string(),
  operator: z.string(),
  target: z.string(),
  period: z.string(),
  detail: z.string(),
  url: z.string(),
});

export const PolicyListSchema = z.object({
  total: z.number(),
  page: z.number().optional(),
  policies: z.array(PolicyItemSchema),
});
