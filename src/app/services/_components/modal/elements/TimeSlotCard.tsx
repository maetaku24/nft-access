'use client';

import { Button } from '@/app/_components/ui/button';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { reservationScheduleHelpers } from '@/app/services/_utils/reservationScheduleHelpers';

interface Props {
  schedule: ReservationSchedule;
  onSelect: (schedule: ReservationSchedule) => void;
}

export const TimeSlotCard: React.FC<Props> = ({ schedule, onSelect }) => {
  const isReservable = reservationScheduleHelpers.isReservable(schedule);

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isReservable
          ? 'cursor-pointer border-gray-200 bg-green-50 hover:bg-green-300/25'
          : 'cursor-not-allowed border-gray-300 bg-gray-100'
      }`}
      onClick={() => (isReservable ? onSelect(schedule) : undefined)}
    >
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-lg font-medium'>
            {schedule.startTime} - {schedule.endTime}
          </div>
          <div
            className={`text-sm ${
              schedule.availableCount <= 2 && schedule.availableCount > 0
                ? 'font-medium text-orange-600'
                : schedule.availableCount === 0
                  ? 'font-medium text-red-600'
                  : 'text-gray-600'
            }`}
          >
            残り {schedule.availableCount} / {schedule.maxParticipants} 名
          </div>
        </div>
        <div className='text-right'>
          <Button
            size='sm'
            className={`mt-1 ${
              isReservable
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-500 hover:bg-gray-500'
            }`}
            disabled={!isReservable}
          >
            {isReservable ? '予約する' : '満席のため予約不可'}
          </Button>
        </div>
      </div>
    </div>
  );
};
