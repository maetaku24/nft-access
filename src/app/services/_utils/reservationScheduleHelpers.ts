import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';

export const reservationScheduleHelpers = {
  isReservable: (schedule: ReservationSchedule): boolean => {
    return !schedule.isClosed && schedule.availableCount > 0;
  },

  isFull: (schedule: ReservationSchedule): boolean => {
    return schedule.availableCount === 0;
  },

  getStatusText: (schedule: ReservationSchedule): string => {
    if (schedule.isClosed) return '休止中';
    if (schedule.availableCount === 0) return '満席';
    return '予約可能';
  },
};
