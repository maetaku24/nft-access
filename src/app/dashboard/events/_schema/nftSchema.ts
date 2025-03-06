import { z } from 'zod';
import { Standard, Network } from '@prisma/client';

const standardEnum = z.nativeEnum(Standard);
const networkEnum = z.nativeEnum(Network);

export const nftSchema = z
  .object({
    id: z.number(),
    collectionName: z.string().max(20, '20文字以内で入力してください'),
    standard: standardEnum,
    network: networkEnum,
    contractAddress: z.string(),
    tokenId: z.coerce.number().int().optional().nullable(),
    minBalance: z.coerce.number().int().min(1, '1以上を入力してください'),
    maxBalance: z.coerce.number().int().min(1, '1以上を入力してください'),
  })
  .refine(({ minBalance, maxBalance }) => minBalance <= maxBalance, {
    message: '最大保有数は最小保有数以上にしてください',
    path: ['maxBalance'],
  });

export type Nft = z.infer<typeof nftSchema>;
