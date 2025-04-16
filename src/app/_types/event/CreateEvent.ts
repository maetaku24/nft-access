import type { Nft } from '../nft';
import type { Schedule } from '../schedule';

export interface CreateEventRequest {
  eventName: string;
  length: number;
  nfts: Nft[];
  schedules: Schedule[];
}

export interface CreateEventResponse {
  id: number;
  message: string;
}
