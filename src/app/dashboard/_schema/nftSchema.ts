import { Standard, Network } from '@prisma/client';
import { z } from 'zod';

const standardEnum = z.nativeEnum(Standard, {
  errorMap: () => {
    return { message: '規格を選択してください' };
  },
});
const networkEnum = z.nativeEnum(Network, {
  errorMap: () => {
    return { message: 'ネットワークを選択してください' };
  },
});

export const nftSchema = z
  .object({
    collectionName: z
      .string({ message: 'コレクション名を入力してください' })
      .min(1, 'コレクション名を入力してください')
      .max(20, '20文字以内で入力してください'),
    standard: standardEnum,
    network: networkEnum,
    contractAddress: z
      .string({ message: 'コントラクトアドレスを入力してください' })
      .min(1, 'コントラクトアドレスを入力してください'),
    tokenId: z.coerce.number().int().optional().nullable(),
    minBalance: z.coerce
      .number({ message: '1以上を入力してください' })
      .int()
      .min(1, '1以上を入力してください'),
    maxBalance: z.coerce
      .number({ message: '1以上を入力してください' })
      .int()
      .min(1, '1以上を入力してください'),
  })
  .refine(({ minBalance, maxBalance }) => minBalance <= maxBalance, {
    message: '最大保有数は最小保有数以上にしてください',
    path: ['maxBalance'],
  });

export type Nft = z.infer<typeof nftSchema>;
