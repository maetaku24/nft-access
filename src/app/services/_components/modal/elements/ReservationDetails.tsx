'use client';

import { TimeSlotCard } from './TimeSlotCard';
import { Button } from '@/app/_components/ui/button';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { dayjs } from '@/utils/dayjs';

interface Props {
  selectedDate: string;
  schedules: ReservationSchedule[];
  onSelectSchedule: (schedule: ReservationSchedule) => void;
  onClose: () => void;
}

export const ReservationDetails: React.FC<Props> = ({
  selectedDate,
  schedules,
  onSelectSchedule,
  onClose,
}) => {
  // 予約可能なスケジュールのみにフィルタリング
  const availableSchedules = schedules.filter((schedule) => !schedule.isClosed);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className='flex h-[80vh] max-h-[600px] min-h-[400px] flex-col'
    >
      <h2 className='mb-4 shrink-0 text-xl font-semibold'>
        {dayjs(selectedDate).format('YYYY年MM月DD日 (dd)')} の予約時間を選択
      </h2>

      <div className='min-h-0 flex-1 overflow-hidden'>
        <div className='h-full space-y-3 overflow-y-auto pr-2'>
          {availableSchedules.map((schedule, index) => (
            <TimeSlotCard
              key={index}
              schedule={schedule}
              onSelect={onSelectSchedule}
            />
          ))}
        </div>
      </div>

      <div className='mt-4 flex shrink-0 justify-end border-t pt-4'>
        <Button
          variant='outline'
          onClick={onClose}
          className='border-gray-300 text-gray-900 hover:bg-blue-50 hover:text-gray-900'
        >
          閉じる
        </Button>
      </div>
    </div>
  );
};
