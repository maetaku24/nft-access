import type { Status } from '@prisma/client';

export interface Reservation {
  eventId: number;
  name: string;
  email: string;
  participants: number;
  walletAddress: string;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  status: Status;
}

export interface ReservationIndexResponse {
  status: number;
  data: Reservation[];
}

// タイムスロット生成関連の型定義
export * from './timeSlot';
