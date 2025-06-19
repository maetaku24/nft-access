export interface Schedule {
  weekday: string;
  date?: Date | null;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isClosed: boolean;
}

export interface ScheduleIndexResponse {
  status: number;
  data: Schedule[];
}

// 新しいスケジュール処理関連の型定義
export * from './scheduleTypes';
