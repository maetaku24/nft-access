import type { Schedule } from '@prisma/client';
import dayjs from 'dayjs';
import { getJapaneseWeekday } from './weekdayHelper';
import { prisma } from '@/utils/prisma';

export interface ReservationValidationParams {
  eventId: number;
  reservationDate: Date | string;
  startTime: string;
  endTime: string;
  participants: number;
  excludeReservationId?: number;
}

export interface ReservationValidationResult {
  isValid: boolean;
  errorMessage?: string;
  schedule?: Schedule;
  availableSlots?: number;
}

export async function validateReservationCapacity({
  eventId,
  reservationDate,
  startTime,
  endTime,
  participants,
  excludeReservationId,
}: ReservationValidationParams): Promise<ReservationValidationResult> {
  const date = dayjs(reservationDate).toDate();

  // スケジュール検索用の日付範囲
  const startOfDay = dayjs(date).startOf('day').toDate();
  const endOfDay = dayjs(date).endOf('day').toDate();
  const japaneseWeekday = getJapaneseWeekday(dayjs(date).day());

  // 該当スケジュールを検索
  const schedules = await prisma.schedule.findMany({
    where: {
      OR: [
        // 特定日付のスケジュール
        {
          date: { gte: startOfDay, lte: endOfDay },
          startTime: { lte: startTime },
          endTime: { gte: endTime },
        },
        // 曜日ベースのスケジュール
        {
          weekday: japaneseWeekday,
          date: null,
          startTime: { lte: startTime },
          endTime: { gte: endTime },
        },
      ],
      eventSchedules: { some: { eventId } },
      isClosed: false,
    },
  });

  // 最適なスケジュールを選択（特定日付 > 定員順）
  const schedule = schedules.sort((a, b) => {
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return b.maxParticipants - a.maxParticipants;
  })[0];

  if (!schedule) {
    return {
      isValid: false,
      errorMessage: '指定された時間枠が見つかりません',
    };
  }

  // 同一時間枠の既存予約数を計算
  const whereCondition = {
    eventId,
    reservationDate: date,
    startTime,
    endTime,
    ...(excludeReservationId && { id: { not: excludeReservationId } }),
  };

  const { _sum } = await prisma.reservation.aggregate({
    where: whereCondition,
    _sum: { participants: true },
  });

  const totalReserved = _sum.participants ?? 0;
  const newTotal = totalReserved + participants;
  const availableSlots = Math.max(0, schedule.maxParticipants - totalReserved);

  if (newTotal > schedule.maxParticipants) {
    return {
      isValid: false,
      errorMessage: `予約可能人数を超えています。残り${availableSlots}人まで予約可能です。`,
      schedule,
      availableSlots,
    };
  }

  return {
    isValid: true,
    schedule,
    availableSlots,
  };
}
