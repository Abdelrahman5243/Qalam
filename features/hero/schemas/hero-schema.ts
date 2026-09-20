import { z } from "zod";

export const sanityHeroSchema = z.object({
  _id: z.string(),
  eyebrow: z.string().nullable().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.object({
    _type: z.literal("image"),
    asset: z.object({
      _ref: z.string(),
      _type: z.literal("reference"),
    }),
    alt: z.string().nullable().optional(),
  }),
  ctaText: z.string().nullable().optional(),
  secondaryCtaText: z.string().nullable().optional(),
});
