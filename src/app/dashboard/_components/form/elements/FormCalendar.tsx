'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// 外部ライブラリ
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';

// UIコンポーネント
import { FormLabel } from '@/app/_components/ui/form';

// アプリコンポーネント
import { ScheduleModal } from './ScheduleModal';

// 型・ユーティリティ
import { dayjs } from '@/utils/dayjs';
import {
  isTargetSchedule,
  isWeekdayTemplate,
} from '@/app/dashboard/_utils/scheduleHelpers';
import type { WeekDay } from '@/app/_types/schedule/week';
import type { Event } from '@/app/dashboard/_schema/eventSchema';
import type { Schedule } from '@/app/dashboard/_schema/scheduleSchema';
import type { DayCellContentArg, DayCellMountArg } from '@fullcalendar/core';

export const FormCalendar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>();
  const [selectedWeekday, setSelectedWeekday] = useState<WeekDay>();

  const { getValues } = useFormContext<Event>();
  const schedules = getValues('schedules');

  const handleSelect = ({ dateStr }: { dateStr: string }) => {
    const date = dayjs(dateStr);
    const today = dayjs().startOf('day');
    if (date.isBefore(today)) return;

    setSelectedDay(date.format('YYYY-MM-DD'));
    setSelectedWeekday(date.format('dddd') as WeekDay);
    setIsOpen(true);
  };
  
  // 過去日付のセルに「fc-day-disabled」クラスを付与し、スタイルを変更する
  const disablePastDateCell = (arg: DayCellMountArg) => {
    const today = dayjs().startOf('day');
    const cellDate = dayjs(arg.date).startOf('day');
    if (cellDate.isBefore(today)) arg.el.classList.add('fc-day-disabled');
  };

  // 日付セルの表示内容を返す（スケジュール or テンプレート or 受付停止）
  const renderDayCellContent = (
    arg: DayCellContentArg,
    schedules: Schedule[]
  ): JSX.Element | null => {
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
              <div className='font-normal text-xs text-gray-500'>+{restCount}件</div>
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

  return (
    <div>
      <FormLabel className='text-base'>個別の時間帯を設定</FormLabel>
      <div className='mt-2 p-6 rounded-md border bg-white'>
        <FullCalendar
          locale={jaLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next',
          }}
          dateClick={handleSelect}
          dayCellDidMount={disablePastDateCell} // DOMにアクセス
          dayCellContent={(arg) => renderDayCellContent(arg, schedules)} // 日付内のコンテンツを上書き
          height='auto'
          initialView='dayGridMonth'
        />
        <ScheduleModal
          weekday={selectedWeekday}
          date={selectedDay}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};
