import { z } from 'zod';

export const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z
    .any()
    .refine((file) => file.size <= 5000000, 'Max image size is 5MB'),
  content: z.string(),
});
