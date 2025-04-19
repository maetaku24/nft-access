'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEvents } from '../../_hooks/useEvents';
import { EventMenu } from './EventMenu';
import { Badge } from '@/app/_components/ui/badge';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
} from '@/app/_components/ui/card';

export const EventCardList: React.FC = () => {
  const { data: events } = useEvents();
  const router = useRouter();

  if (!events) return;

  const handleDetailEvent = (eventId: number) => {
    router.push(`/dashboard/events/${eventId}/edit`);
  };
  return (
    <div className='space-y-4'>
      {events.map((event) => (
        <Card
          key={event.id}
          onClick={() => handleDetailEvent(event.id)}
          className='flex min-h-[100px] max-w-[1080px] cursor-pointer flex-col items-start justify-start rounded-[15px] border border-[#e9e9e9] bg-white p-6 transition hover:bg-gray-100 hover:shadow-md active:bg-gray-200 md:min-h-[121px] md:py-[9px]'
        >
          <CardHeader className='w-full pl-2 pr-4 pt-2'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-xl font-bold text-gray-900 sm:text-xl md:text-2xl lg:text-3xl'>
                  {event.eventName}
                </CardTitle>
              </div>
              <div
                className='inline-flex items-center justify-center rounded p-[2px] transition hover:bg-green-300 hover:text-white'
                onClick={(e) => e.stopPropagation()}
              >
                <EventMenu id={event.id} />
              </div>
            </div>
          </CardHeader>
          <CardFooter className='pb-4 pl-2'>
            <div className='flex items-center justify-center gap-5'>
              <div className='flex items-center justify-center gap-2'>
                <Badge className='bg-green-200 font-bold text-gray-900 shadow-none hover:bg-green-200'>
                  作成日
                </Badge>
                <div className='text-sm font-medium'>
                  {dayjs(event.createdAt).format('YYYY/MM/DD')}
                </div>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Badge className='bg-green-200 font-bold text-gray-900 shadow-none hover:bg-green-200'>
                  更新日
                </Badge>
                <div className='text-sm font-medium'>
                  {dayjs(event.updatedAt).format('YYYY/MM/DD')}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
