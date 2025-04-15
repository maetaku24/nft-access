'use client';

import { useMemo, useState } from 'react';
import { Control, useWatch } from 'react-hook-form';

// UIコンポーネント・アイコン
import { Settings } from 'lucide-react';
import { FormLabel } from '@/app/_components/ui/form';

// アプリコンポーネント
import { ScheduleModal } from './ScheduleModal';

// 型
import type { WeekDay } from '@/app/_types/schedule/week';
import type { Event } from '@/app/dashboard/_schema/eventSchema';

interface Props {
  control: Control<Event>;
}

export const WeekTimePicker: React.FC<Props> = ({ control }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeekday, setSelectedWeekday] = useState<WeekDay | null>(null);

  const schedules = useWatch({
    control,
    name: 'schedules',
  });

  const handleSelect = (weekday: WeekDay) => {
    setSelectedWeekday(weekday);
    setIsOpen(true);
  };

  // 同じ曜日ごとにグループ化する
  const grouped = useMemo(() => {
    return schedules.reduce((acc, item) => {
      if (!item.weekday || item.date) return acc;
      (acc[item.weekday as WeekDay] ??= []).push(item);
      return acc;
    }, {} as Record<WeekDay, (typeof schedules)[number][]>);
  }, [schedules]);

  // grouped を配列に変換
  const groupedDays = Object.entries(grouped).map(([weekday, items]) => ({
    weekday,
    items,
  }));

  return (
    <div>
      <FormLabel>日程候補として提示する曜日と時間帯</FormLabel>
      <div className='flex mt-2 max-w-4xl'>
        {groupedDays.map(({ weekday, items }) => {
          const isClosed = items.some((item) => item.isClosed);
          return (
            <button
              key={weekday}
              type='button'
              onClick={() => handleSelect(weekday as WeekDay)}
              className={
                isClosed
                  ? 'border p-4 w-36 text-gray-900 text-center bg-gray-200 first:rounded-l-md last:rounded-r-md hover:border-green-300'
                  : 'border p-4 w-36 text-gray-900 text-center bg-white first:rounded-l-md last:rounded-r-md hover:border-green-300'
              }
            >
              <div className='relative font-semibold flex items-center justify-center'>
                <span className='mx-auto text-gray-900'>{weekday}</span>
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
        weekday={(selectedWeekday as WeekDay) || ''}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};
