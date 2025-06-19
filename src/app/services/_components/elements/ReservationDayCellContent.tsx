'use client';

import type { DayCellContentArg } from '@fullcalendar/core';
import { reservationScheduleHelpers } from '../../_utils/reservationScheduleHelpers';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { dayjs } from '@/utils/dayjs';

interface Props {
  arg: DayCellContentArg;
  schedules?: ReservationSchedule[];
}

export const ReservationDayCellContent: React.FC<Props> = ({
  arg,
  schedules,
}): JSX.Element => {
  const dateStr = dayjs(arg.date).format('YYYY-MM-DD');
  const today = dayjs().startOf('day');
  const cellDate = dayjs(arg.date).startOf('day');
  const isPastDate = cellDate.isBefore(today);

  // その日のスケジュールを取得
  const daySchedules = schedules?.filter(
    (schedule) => schedule.date === dateStr
  );

  // 過去の日付の場合
  if (isPastDate) {
    return (
      <div className='h-auto'>
        <div className='mt-4 text-base text-gray-400'>{arg.dayNumberText}</div>
        <div className='mt-1 min-h-[40px] overflow-hidden rounded px-1 text-center text-xs font-medium text-gray-400'>
          過去の日付
        </div>
      </div>
    );
  }

  // スケジュールがない日付の場合
  if (!daySchedules || daySchedules.length === 0) {
    return (
      <div className='h-auto'>
        <div className='mt-4 text-base'>{arg.dayNumberText}</div>
        <div className='mt-1 min-h-[40px] overflow-hidden rounded px-1 text-center text-xs font-medium text-gray-400'>
          設定なし
        </div>
      </div>
    );
  }

  // タイムスロットの状態を集計
  const availableSlots = daySchedules.filter((schedule) =>
    reservationScheduleHelpers.isReservable(schedule)
  );
  const closedSlots = daySchedules.filter((schedule) => schedule.isClosed);

  // 状態の判定
  const getStatusDisplay = () => {
    if (availableSlots.length > 0) {
      return (
        <div className='mt-1 min-h-[40px] overflow-hidden rounded px-1 text-center text-xs font-medium text-green-600'>
          予約可能
        </div>
      );
    } else if (closedSlots.length > 0) {
      return (
        <div className='mt-1 min-h-[40px] overflow-hidden rounded px-1 text-center text-xs font-bold text-orange-500'>
          受付停止中
        </div>
      );
    } else {
      return (
        <div className='mt-1 min-h-[40px] overflow-hidden rounded px-1 text-center text-xs font-bold text-red-500'>
          満席
        </div>
      );
    }
  };

  return (
    <div className='h-auto'>
      <div className='mt-4 text-base'>{arg.dayNumberText}</div>
      {getStatusDisplay()}
    </div>
  );
};
