import { z } from 'zod';

export const profileEmailSchema = z.object({
  email: z.string().email('メールアドレス形式で入力してください。'),
});

export type ProfileEmail = z.infer<typeof profileEmailSchema>;
