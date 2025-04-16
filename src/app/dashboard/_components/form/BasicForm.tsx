'use client';

import type { Control } from 'react-hook-form';
import { FormInput } from './elements/FormInput';
import { DurationPicker } from '@/app/dashboard/_components/form/elements/DurationPicker';
import type { Event } from '@/app/dashboard/_schema/eventSchema';

interface Props {
  control: Control<Event>;
}

export const BasicForm = ({ control }: Props) => {
  return (
    <div>
      <h2 className='mb-10 text-2xl font-bold'>基本設定</h2>
      <div className='space-y-6'>
        <FormInput name='eventName' label='イベント名' control={control} />
        <DurationPicker control={control} />
      </div>
    </div>
  );
};
