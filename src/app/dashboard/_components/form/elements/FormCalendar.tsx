'use client';

import type { DayCellMountArg } from '@fullcalendar/core';
import jaLocale from '@fullcalendar/core/locales/ja';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DayCellContent } from './DayCellContent';
import { ScheduleModal } from './ScheduleModal';
import { FormLabel } from '@/app/_components/ui/form';
import type { WeekDay } from '@/app/_types/schedule/week';
import type { Event } from '@/app/dashboard/_schema/eventSchema';
import { dayjs } from '@/utils/dayjs';

export const FormCalendar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
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

  return (
    <div>
      <FormLabel>個別の時間帯を設定</FormLabel>
      <div className='mt-2 rounded-md border bg-white p-6'>
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
          dayCellContent={(arg) => (
            <DayCellContent arg={arg} schedules={schedules} />
          )} // 日付内のコンテンツを上書き
          height='auto'
          initialView='dayGridMonth'
        />
        <ScheduleModal
          weekday={selectedWeekday}
          date={selectedDay ?? undefined}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
};
