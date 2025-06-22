'use client';

import type { DayCellMountArg } from '@fullcalendar/core';
import jaLocale from '@fullcalendar/core/locales/ja';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';
import { ReservationModal } from '../../modal/ReservationModal';
import { ReservationDayCellContent } from './ReservationDayCellContent';
import { Label } from '@/app/_components/ui/label';
import { useReservationSchedule } from '@/app/services/_hooks/useReservationSchedule';
import { dayjs } from '@/utils/dayjs';

interface Props {
  userId: string;
  eventId: string;
}

export const ReservationCalendar: React.FC<Props> = ({ userId, eventId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // タイムスロットデータを取得
  const { data: schedules = [] } = useReservationSchedule({ userId, eventId });

  // 日付セルをクリックした時の処理
  const handleSelect = (arg: { dateStr: string }) => {
    const today = dayjs().startOf('day');
    const selectedDate = dayjs(arg.dateStr).startOf('day');

    // 過去の日付の場合はクリック無効
    if (selectedDate.isBefore(today)) {
      return;
    }

    const dateSchedules = schedules.filter(
      (schedule) => schedule.date === arg.dateStr
    );

    // スケジュールがある日付で、かつ休止中でないスケジュールが存在する場合のみモーダルを開く
    const hasActiveSchedules = dateSchedules.some(
      (schedule) => !schedule.isClosed
    );

    if (dateSchedules.length > 0 && hasActiveSchedules) {
      setSelectedDay(arg.dateStr);
      setIsOpen(true);
    }
  };

  // 過去日付のセルに「fc-day-disabled」クラスを付与し、スタイルを変更する
  const disablePastDateCell = (arg: DayCellMountArg) => {
    const today = dayjs().startOf('day');
    const cellDate = dayjs(arg.date).startOf('day');
    if (cellDate.isBefore(today)) arg.el.classList.add('fc-day-disabled');
  };

  return (
    <>
      <Label className='text-base font-semibold'>
        予約する日時を選択してください
      </Label>
      <div className='mt-2 rounded-md border bg-white p-6'>
        <FullCalendar
          locale={jaLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          height='auto'
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next',
          }}
          dateClick={handleSelect}
          dayCellDidMount={disablePastDateCell}
          dayCellContent={(arg) => (
            <ReservationDayCellContent arg={arg} schedules={schedules} />
          )}
        />
      </div>
      <ReservationModal
        selectedDate={selectedDay ?? ''}
        schedules={schedules.filter(
          (schedule) => schedule.date === selectedDay
        )}
        eventId={eventId}
        userId={userId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
