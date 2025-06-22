import type { Schedule as ApiSchedule } from './index';

// 基本型を再エクスポート
export type { ScheduleIndexResponse } from './index';

export interface Schedule {
  weekday: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isClosed: boolean;
}

// 既存のAPIとの互換性のための型エイリアス
export type BaseSchedule = ApiSchedule;

// イベントスケジュール型（Prismaからの取得データ）
export interface EventSchedule {
  schedule: Schedule;
}

// イベントスケジュール配列型
export type EventScheduleList = EventSchedule[];

// 予約データ型
export interface ReservationForSchedule {
  reservationDate: Date;
  startTime: string;
  endTime: string;
  participants: number;
}

// 予約データ配列型
export type ReservationListForSchedule = ReservationForSchedule[];

// 特定日付スケジュール型
export interface SpecificDateSchedule {
  date: Date | null;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isClosed: boolean;
}

// 曜日繰り返しスケジュール型
export interface RecurringWeekdaySchedule {
  weekday: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  isClosed: boolean;
}
