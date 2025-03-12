import { z } from 'zod';

export const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;

        if (typeof file == 'string' || !(file instanceof File)) return false;
        return file.size <= 5000000;
      },
      {
        message: 'Too big file!',
      }
    ),
  content: z.string(),
});
