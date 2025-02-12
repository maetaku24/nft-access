import { z } from 'zod';

// プロフィール設定のバリデーション
export const profileSchema = z.object({
  supabaseUserId: z.string(),
  name: z
    .string()
    .min(1, '名前は1文字以上で入力してください')
    .max(50, '名前は50文字以内で入力してください')
    .optional(),
  email: z.string().email('メールアドレス形式で入力してください。'),
  walletAddress: z
    .string()
    .length(42, 'ウォレットアドレスは42文字である必要があります')
    .regex(/^0x[0-9a-fA-F]{40}$/, {
      message: '0xから始まる42文字である必要があります',
    })
    .optional()
    .nullable(),
  iconKey: z.string().optional().nullable(),
});

export type profile = z.infer<typeof profileSchema>;
