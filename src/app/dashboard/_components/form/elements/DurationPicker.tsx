'use client';

import { useState } from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/app/_components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/app/_components/ui/toggle-group';
import { Event } from '@/app/dashboard/_schema/eventSchema';

interface Props {
  control: Control<Event>;
}

export const DurationPicker = ({ control }: Props) => {
  const [isCustom, setIsCustom] = useState(false);

  return (
    <FormField
      name='length'
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>1回の予約確保時間</FormLabel>
          <FormControl>
            <ToggleGroup
              type='single'
              variant='outline'
              value={isCustom ? 'custom' : field.value?.toString() || ''}
              onValueChange={(value) => {
                if (!value) return;
                if (value === 'custom') {
                  setIsCustom(true);
                  field.onChange('');
                } else {
                  setIsCustom(false);
                  field.onChange(Number(value));
                }
              }}
            >
              <ToggleGroupItem
                value='30'
                className='w-full h-12 flex justify-center items-center bg-white first:rounded-l-md border-r-0'
              >
                30分
              </ToggleGroupItem>
              <ToggleGroupItem
                value='45'
                className='w-full h-12 flex justify-center items-center bg-white border-r-0'
              >
                45分
              </ToggleGroupItem>
              <ToggleGroupItem
                value='60'
                className='w-full h-12 flex justify-center items-center bg-white border-r-0'
              >
                60分
              </ToggleGroupItem>
              <ToggleGroupItem
                value='90'
                className='w-full h-12 flex justify-center items-center bg-white border-r-0'
              >
                90分
              </ToggleGroupItem>
              <ToggleGroupItem
                value='custom'
                className='w-full h-12 flex items-center justify-center bg-white last:rounded-r-md'
              >
                {
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='カスタム'
                      value={isCustom ? field.value : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val ? Number(val) : '');
                      }}
                      onFocus={() => {
                        if ([30, 45, 60, 90].includes(field.value))
                          field.onChange('');
                        setIsCustom(true);
                      }}
                      className='w-full min-w-0 border text-sm pl-2 pr-2 bg-white text-gray-900 text-center placeholder:text-xs'
                    />
                  </FormControl>
                }
                <span>分</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </FormControl>
          <FormMessage className='text-xs' />
        </FormItem>
      )}
    />
  );
};
