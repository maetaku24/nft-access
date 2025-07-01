'use client';

import { Button } from '@/app/_components/ui/button';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { reservationScheduleHelpers } from '@/app/services/_utils/reservationScheduleHelpers';

interface Props {
  schedule: ReservationSchedule;
  onSelect: (schedule: ReservationSchedule) => void;
}

const getCapacityTextColor = (
  isFull: boolean,
  isLowCapacity: boolean,
  isReservable: boolean
): string => {
  if (isFull) return 'text-red-600';
  if (isLowCapacity) return 'text-orange-600';
  if (isReservable) return 'text-green-600';
  return 'text-gray-600';
};

export const TimeSlotCard: React.FC<Props> = ({ schedule, onSelect }) => {
  const isReservable = reservationScheduleHelpers.isReservable(schedule);
  const isLowCapacity =
    schedule.availableCount <= 2 && schedule.availableCount > 0;
  const isFull = schedule.availableCount === 0;

  const capacityTextColor = getCapacityTextColor(
    isFull,
    isLowCapacity,
    isReservable
  );

  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ease-out ${
        isReservable
          ? 'border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg'
          : isFull
            ? 'cursor-not-allowed border-gray-200 bg-gray-50'
            : 'cursor-not-allowed border-gray-200 bg-gray-50'
      }`}
      onClick={() => (isReservable ? onSelect(schedule) : undefined)}
    >
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div
            className={`text-lg font-semibold transition-colors duration-200 ${
              isReservable ? 'text-gray-900' : 'text-gray-500'
            }`}
          >
            {schedule.startTime} - {schedule.endTime}
          </div>
          <div className='flex items-center space-x-2'>
            <div
              className={`text-sm font-medium transition-colors duration-200 ${capacityTextColor}`}
            >
              残り {schedule.availableCount} 名
            </div>
            <span className='text-sm text-gray-400'>
              / {schedule.maxParticipants} 名
            </span>
          </div>
        </div>
        <div className='text-right'>
          <Button
            size='sm'
            className={`font-medium transition-all duration-200 ${
              isReservable
                ? 'bg-green-600 text-white hover:scale-105 hover:bg-green-700 hover:shadow-md'
                : 'bg-gray-300 text-gray-500 hover:bg-gray-300'
            }`}
            disabled={!isReservable}
          >
            {isFull ? '満席' : isReservable ? '予約する' : '予約不可'}
          </Button>
        </div>
      </div>
    </div>
  );
};
