'use client';

import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { FormLabel } from '@/app/_components/ui/form';
import { Event } from '@/app/dashboard/_schema/eventSchema';
import { ScheduleModal } from './ScheduleModal';

interface Props {
  control: Control<Event>;
}

export const WeekTimePicker: React.FC<Props> = ({ control }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<
    Event['schedules']
  >([]);

  const handleSelect = (day: string) => {
    const daySchedules = fields.filter(
      (item) => item.weekday === day && item.type === 'WEEKDAY'
    );
    setSelectedDay(day);
    setSelectedDaySchedules(daySchedules);
    setIsOpen(true);
  };

  const { fields, replace } = useFieldArray({
    control,
    name: 'schedules',
  });

  // 同じ曜日ごとにグループ化する
  const grouped = fields.reduce(
    (acc: { [key: string]: (typeof fields)[number][] }, item) => {
      const day = item.weekday || '未設定';
      if (item.type !== 'WEEKDAY') return acc;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as { [key: string]: (typeof fields)[number][] }
  );

  // grouped を配列に変換
  const groupedDays = Object.entries(grouped).map(([day, items]) => ({
    day,
    items,
  }));

  // 現在のfieldsから該当曜日以外の要素を抽出
  const handleScheduleUpdate = (updatedSchedules: Event['schedules']) => {
    if (!selectedDay) return;

    // 現在のfieldsから該当曜日以外の要素を抽出
    const otherSchedules = fields.filter(
      (item) => item.weekday !== selectedDay
    );
    // 更新後の配列を作成（他曜日 + 更新後曜日）
    const newSchedules = [...otherSchedules, ...updatedSchedules];

    // 曜日ごとに並ぶようにsort
    const weekdayOrder = [
      '日曜日',
      '月曜日',
      '火曜日',
      '水曜日',
      '木曜日',
      '金曜日',
      '土曜日',
    ];
    const sortedSchedules = newSchedules.sort((a, b) => {
      const aIndex = weekdayOrder.indexOf(a.weekday || '');
      const bIndex = weekdayOrder.indexOf(b.weekday || '');
      return aIndex - bIndex;
    });

    // スケジュールを一括更新
    replace(sortedSchedules);
    setSelectedDaySchedules(updatedSchedules);
  };

  return (
    <div>
      <FormLabel>日程候補として提示する曜日と時間帯</FormLabel>
      <div className='flex mt-2 max-w-4xl'>
        {groupedDays.map(({ day, items }) => {
          const isClosed = items.some((item) => item.isClosed);
          
          return (
            <button
              key={day}
              type='button'
              onClick={() => handleSelect(day)}
              className={
                isClosed
                  ? 'border p-4 w-36 text-gray-900 text-center bg-gray-200 first:rounded-l-md last:rounded-r-md hover:border-green-300'
                  : 'border p-4 w-36 text-gray-900 text-center bg-white first:rounded-l-md last:rounded-r-md hover:border-green-300'
              }
            >
              <div className='relative font-semibold flex items-center justify-center'>
                <span className='mx-auto text-gray-900'>{day}</span>
                <Settings
                  size={16}
                  className='absolute text-gray-900 right-0 top-0'
                />
              </div>
              <div className='text-sm'>
                {items.slice(0, 1).map((item, index) => (
                  <div key={index}>
                    {item.startTime || '未設定'} 〜 {item.endTime || '未設定'}
                  </div>
                ))}
                {items.length > 1 && (
                  <div className='text-xs text-gray-500'>
                    +{items.length - 1}件
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <ScheduleModal
        day={selectedDay || ''}
        initialValues={selectedDaySchedules}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleScheduleUpdate}
      />
    </div>
  );
};
