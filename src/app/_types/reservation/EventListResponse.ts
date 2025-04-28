export interface EventListResponse {
  id: number;
  name: string;
  email: string;
  participants: number;
  reservationDate: Date;
  startTime: string;
  endTime: string;
}
