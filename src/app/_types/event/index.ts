export interface EventData {
  eventName: string;
  nfts: Array<{
    collectionName: string;
    standard: string;
    network: string;
    minBalance: number;
    maxBalance: number | null;
  }>;
}

export interface NftCheckData {
  ok: boolean;
  reason?: string;
}
