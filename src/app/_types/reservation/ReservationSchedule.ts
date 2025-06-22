export interface ReservationSchedule {
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  reservedCount: number;
  availableCount: number;
  isClosed: boolean;
}
