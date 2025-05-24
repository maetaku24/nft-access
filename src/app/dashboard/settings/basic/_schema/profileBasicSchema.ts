import { z } from 'zod';

export const profileBasicSchema = z.object({
  userId: z.string().regex(/^[a-zA-Z0-9_-]{3,32}$/, {
    message: 'ユーザーIDは 3〜32 文字の半角英数字・_・- のみ使用できます',
  }),
  name: z
    .string()
    .min(1, '名前は1文字以上で入力してください')
    .max(50, '名前は50文字以内で入力してください')
    .optional(),
  walletAddress: z
    .string()
    .length(42, 'ウォレットアドレスは42文字である必要があります')
    .regex(/^0x[0-9a-fA-F]{40}$/, {
      message: '0xから始まる42文字である必要があります',
    })
    .optional(),
  iconKey: z.string().optional(),
  iconUrl: z.string().url().optional(),
});

export type ProfileBasic = z.infer<typeof profileBasicSchema>;
