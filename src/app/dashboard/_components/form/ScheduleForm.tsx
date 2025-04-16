'use client';

import type { Control } from 'react-hook-form';
import { FormCalendar } from './elements/FormCalendar';
import { WeekTimePicker } from './elements/WeekTimePicker';
import type { Event } from '@/app/dashboard/_schema/eventSchema';

interface Props {
  control: Control<Event>;
}

export const ScheduleForm = ({ control }: Props) => {
  return (
    <div>
      <h2 className='mb-10 text-2xl font-bold'>日程・参加メンバー設定</h2>
      <div className='max-w-4xl space-y-6'>
        <WeekTimePicker control={control} />
        <FormCalendar />
      </div>
    </div>
  );
};
