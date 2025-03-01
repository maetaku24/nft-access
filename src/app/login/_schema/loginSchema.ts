import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('メールアドレス形式で入力してください。'),
  password: z.string().min(6, 'パスワードには6文字以上必要です。'),
});

export type LoginForm = z.infer<typeof loginSchema>;
