import { nonEmptyString } from '@/shared/formUtils';
import { z } from 'zod';

export const craeteCommentFormSchema = z
  .object({
    content: z.string().pipe(nonEmptyString),
    parentId: z.number().optional().nullable(),
    lessonId: z.number().optional().nullable(),
    postId: z.number().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    const targets = [data.lessonId, data.postId].filter(
      (id) => id !== null && id !== undefined
    );

    if (targets.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Musisz przypisać komentarz do lekcji, wpisu.',
        path: ['root'],
      });
    }

    if (targets.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Komentarz przypisany do wielu miejsc jednocześnie.',
        path: ['root'],
      });
    }
  });

export const createCommentFormDefaultValues = {
  content: '',
  parentId: null,
  lessonId: undefined,
  postId: undefined,
};

export type CreateCommentValues = z.infer<typeof craeteCommentFormSchema>;
