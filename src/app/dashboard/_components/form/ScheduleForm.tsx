'use client';

import { Control } from 'react-hook-form';
import { Event } from '@/app/dashboard/_schema/eventSchema';
import { WeekTimePicker } from './elements/WeekTimePicker';
import { FormCalendar } from './elements/FormCalendar';

interface Props {
  control: Control<Event>;
}

export const ScheduleForm = ({ control }: Props) => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-10'>日程・参加メンバー設定</h2>
      <div className='space-y-6 max-w-4xl'>
        <WeekTimePicker control={control} />
        <FormCalendar />
      </div>
    </div>
  );
};
