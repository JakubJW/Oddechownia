import z from 'zod';

export const selectProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  type: z.literal('live-lesson').or(z.literal('ebook')),
  description: z.string().optional(),
  stripePriceId: z.string(),
  image: z.string(),
  price: z.number(),
  isVisible: z.boolean(),
  isFreeForSubscribers: z.boolean(),
  usesMonthlyQuota: z.boolean(),
});

export type Product = z.infer<typeof selectProductSchema>;

export type EbookProduct = Product & {
  fileUrl: string;
};
