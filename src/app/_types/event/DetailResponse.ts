import type { Nft } from '../nft';
import type { Schedule } from '../schedule';

export interface DetailResponse {
  eventName: string;
  length: number;
  nfts: Nft[];
  schedules: Schedule[];
}
