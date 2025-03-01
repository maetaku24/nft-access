import { Nft } from '../nft'
import { Schedule } from '../schedule'

export interface CreateEventRequest {
  profileId: number;
  eventName: string;
  length: number;
  nfts: Nft[];
  schedules: Schedule[]
}

export interface CreateEventResponse {
  id: number;
  message: string;
}