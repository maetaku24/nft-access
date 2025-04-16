export interface Schedule {
  weekday: string;
  date?: Date;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isClosed: boolean;
}

export interface ScheduleIndexResponse {
  status: number;
  data: Schedule[];
}
