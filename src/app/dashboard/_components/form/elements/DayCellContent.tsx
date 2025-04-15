'use client';

import { dayjs } from '@/utils/dayjs';
import {
  isTargetSchedule,
  isWeekdayTemplate,
} from '@/app/dashboard/_utils/scheduleHelpers';
import type { WeekDay } from '@/app/_types/schedule/week';
import type { DayCellContentArg } from '@fullcalendar/core';
import type { Schedule } from '@/app/dashboard/_schema/scheduleSchema';

interface Props {
  arg: DayCellContentArg;
  schedules: Schedule[];
}

// 日付セルの表示内容を返す（スケジュール or テンプレート or 受付停止）
export const DayCellContent: React.FC<Props> = ({
  arg,
  schedules,
}): JSX.Element | null => {
  const date = dayjs(arg.date);
  const dateStr = date.format('YYYY-MM-DD');
  const weekday = date.format('dddd') as WeekDay;

  const dateSchedules = schedules.filter((s) =>
    isTargetSchedule(s, weekday, dateStr)
  );
  const templateSchedules = schedules.filter(
    (s) => isTargetSchedule(s, weekday) && isWeekdayTemplate(s)
  );
  const displaySchedules =
    dateSchedules.length > 0 ? dateSchedules : templateSchedules;

  if (displaySchedules.length === 0) return null;

  const restCount = displaySchedules.length - 1;
  const isClosed = displaySchedules[0]?.isClosed;

  return (
    <div className='h-auto'>
      <div className='mt-4 text-base'>{arg.dayNumberText}</div>
      {!isClosed ? (
        <div className='text-xs font-medium mt-1 text-center rounded px-1 min-h-[40px] overflow-hidden'>
          {displaySchedules[0].startTime} 〜 {displaySchedules[0].endTime}
          {restCount > 0 && (
            <div className='font-normal text-xs text-gray-500'>
              +{restCount}件
            </div>
          )}
        </div>
      ) : (
        <div className='text-xs font-bold text-red-500 mt-1 text-center rounded px-1 min-h-[40px] overflow-hidden'>
          受付停止中
        </div>
      )}
    </div>
  );
};