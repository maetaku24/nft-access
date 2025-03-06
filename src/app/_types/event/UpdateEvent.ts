import { Nft } from '../nft'
import { Schedule } from '../schedule'

export interface UpdateEventRequest {
  eventName: string;
  length: number;
  nfts: Nft[];
  schedules: Schedule[]
}

export interface UpdateEventResponse {
  id: number;
  message: string;
}