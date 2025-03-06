import { z } from 'zod';

export const signupSchema = z
  .object({
    email: z.string().email('メールアドレス形式で入力してください。'),
    password: z.string().min(6, 'パスワードには6文字以上必要です。'),
    passwordConfirmation: z
      .string()
      .min(6, 'パスワードには6文字以上必要です。'),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      message: 'パスワードが一致しません',
      path: ['passwordConfirmation'],
    }
  );

export type SignupForm = z.infer<typeof signupSchema>;
