import { z } from 'zod';

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, '6文字以上で入力してください'),
    newPassword: z.string().min(6, '6文字以上で入力してください'),
    passwordConfirmation: z
      .string()
      .min(6, 'パスワードには6文字以上必要です。'),
  })
  .refine(
    ({ newPassword, passwordConfirmation }) =>
      newPassword === passwordConfirmation,
    {
      message: 'パスワードが一致しません',
      path: ['passwordConfirmation'],
    }
  );

export type PasswordForm = z.infer<typeof passwordSchema>;
