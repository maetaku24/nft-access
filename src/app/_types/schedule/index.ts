import { Type } from '@prisma/client';

export interface Schedule {
  type: Type;
  weekday?: string;
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
