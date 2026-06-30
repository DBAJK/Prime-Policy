import { z } from "zod";

export const SearchRequestSchema = z.object({
  keyword: z.string().min(1),
  page: z.number().int().min(1).optional().default(1),
});

export const DetailRequestSchema = z.object({
  policyId: z.string().min(1),
});

export const RegionRequestSchema = z.object({
  region: z.string().min(1),
  page: z.number().int().min(1).optional().default(1),
});

export const CategoryRequestSchema = z.object({
  category: z.string().min(1),
  page: z.number().int().min(1).optional().default(1),
});

export const RecommendRequestSchema = z.object({
  age: z.number().int().min(15).max(39),
  region: z.string().optional(),
  employment: z.string().optional(),
});
