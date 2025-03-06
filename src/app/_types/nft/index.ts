import { Standard, Network } from '@prisma/client';

export interface Nft {
  collectionName: string;
  standard: Standard;
  network: Network;
  contractAddress: string;
  tokenId?: number;
  minBalance: number;
  maxBalance: number;
}

export interface NftIndexResponse {
  status: number;
  data: Nft[];
}
