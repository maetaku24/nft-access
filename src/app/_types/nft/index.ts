import type { Standard, Network } from '@prisma/client';

export interface Nft {
  collectionName: string;
  standard: Standard;
  network: Network;
  contractAddress: string;
  tokenId?: number | null;
  minBalance: number;
  maxBalance?: number | null;
}

export interface NftIndexResponse {
  status: number;
  data: Nft[];
}

// NFT条件チェック・バリデーション関連の型定義
export * from './nftValidation';
