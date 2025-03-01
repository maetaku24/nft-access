import { Nft } from '../nft'
import { Schedule } from '../schedule'

export interface UpdateEventRequest {
  id: number;
  profileId: number;
  eventName: string;
  length: number;
  nft: Nft;
  Schedule: Schedule[]
}

export interface UpdateEventResponse {
  id: number;
  message: string;
}