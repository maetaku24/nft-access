// スケジュール設定の基本型
export interface ScheduleConfig {
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isClosed: boolean;
}

// 予約データの基本型
export interface ReservationData {
  reservationDate: Date;
  startTime: string;
  endTime: string;
  participants: number;
}

// 生成されたタイムスロット情報
export interface GeneratedTimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  reservedCount: number;
  availableCount: number;
  isClosed: boolean;
}
