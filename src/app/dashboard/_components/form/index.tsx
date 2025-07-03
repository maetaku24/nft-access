'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { EventSchema } from '../../_schema/eventSchema';
import type { Event } from '../../_schema/eventSchema';
import { BasicForm } from './BasicForm';
import { NftForm } from './NftForm';
import { ScheduleForm } from './ScheduleForm';
import { Button } from '@/app/_components/ui/button';
import { Form } from '@/app/_components/ui/form';
import { WEEKDAYS } from '@/app/_types/schedule/week';

interface Props {
  onSubmit: (data: Event) => void;
  defaultValues?: Partial<Event>;
}

export const EventForm: React.FC<Props> = ({ onSubmit, defaultValues }) => {
  const methods = useForm<Event>({
    resolver: zodResolver(EventSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: defaultValues || {
      length: 30,
      nfts: [{}],
      schedules: WEEKDAYS.map((day) => ({
        weekday: day,
        isClosed: false,
        startTime: '10:00',
        endTime: '19:00',
        maxParticipants: 1,
      })),
    },
  });

  const pathname = usePathname();
  const isEditing = pathname.includes('/edit');

  return (
    <Form {...methods}>
      <div className='flex min-h-[calc(100vh-200px)] items-start justify-center pt-20'>
        <div className='w-full max-w-4xl'>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className='space-y-20'>
              <BasicForm control={methods.control} />
              <NftForm control={methods.control} />
              <ScheduleForm control={methods.control} />
            </div>
            <div className='my-16 flex justify-center'>
              <Button
                type='submit'
                size='lg'
                disabled={methods.formState.isSubmitting}
                className='w-[500px] bg-green-300 hover:bg-green-300/50'
              >
                {methods.formState.isSubmitting
                  ? isEditing
                    ? '更新中...'
                    : '作成中...'
                  : isEditing
                    ? '更新する'
                    : '作成する'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
};
