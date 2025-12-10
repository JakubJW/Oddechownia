import { nonEmptyString } from '@/shared/formUtils';
import z from 'zod';

export const requestPasswordResetFormSchema = z.object({
  email: z.string().pipe(nonEmptyString),
});

export const setNewPasswordFormSchema = z
  .object({
    password: z.string().pipe(nonEmptyString),
    confirmPassword: z.string().pipe(nonEmptyString),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        message: 'Podane hasła różnią się',
        path: ['confirmPassword'],
        code: 'custom',
      });
    }
  });

export type RequestPasswordResetFormValues = z.infer<
  typeof requestPasswordResetFormSchema
>;

export type SetNewPasswordFormValues = z.infer<typeof setNewPasswordFormSchema>;

export const requestPasswordResetFormDefaultValues = {
  email: '',
};

export const setNewPasswordFormDefaultValues: SetNewPasswordFormValues = {
  password: '',
  confirmPassword: '',
};
