import { z } from 'zod';

// ユーザー登録・ログインのバリデーション
export const userAuthSchema = z.object({
  email: z.string().email('メールアドレス形式で入力してください。'),
  password: z.string().min(6, 'パスワードには6文字以上必要です。'),
});

export type userAuth = z.infer<typeof userAuthSchema>;

