'use client';

import { Control } from 'react-hook-form';
import { DurationPicker } from '@/app/dashboard/_components/form/elements/DurationPicker';
import { FormInput } from './elements/FormInput';
import { Event } from '@/app/dashboard/_schema/eventSchema';

interface Props {
  control: Control<Event>;
}

export const BasicForm = ({ control }: Props) => {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-10'>基本設定</h2>
      <div className='space-y-6 max-w-2xl'>
        <FormInput name='eventName' label='イベント名' control={control} />
        <DurationPicker control={control} />
      </div>
    </div>
  );
};
