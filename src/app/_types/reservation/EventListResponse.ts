export interface EventListResponse {
  id: number;
  name: string;
  email: string;
  participants: number;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
  reservedCount?: number;
  availableCount?: number;
}
