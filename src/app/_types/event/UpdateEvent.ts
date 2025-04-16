import type { Nft } from '../nft';
import type { Schedule } from '../schedule';

export interface UpdateEventRequest {
  eventName: string;
  length: number;
  nfts: Nft[];
  schedules: Schedule[];
}

export interface UpdateEventResponse {
  id: number;
  message: string;
}
