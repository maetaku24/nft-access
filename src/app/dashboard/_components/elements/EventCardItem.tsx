'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShareUrl } from '../../_hooks/useShareUrl';
import { CopyUrlButton } from './CopyUrlButton';
import { EventMenu } from './EventMenu';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
} from '@/app/_components/ui/card';
import type { List } from '@/app/_types/event/ListResponse';
import { dayjs } from '@/utils/dayjs';

interface Props {
  event: List;
}

export const EventCardItem: React.FC<Props> = ({ event }) => {
  const router = useRouter();
  const { data } = useShareUrl(event.id);

  if (!data) return;

  const handleDetailEvent = (eventId: number) => {
    router.push(`/dashboard/events/${eventId}`);
  };
  return (
    <Card
      key={event.id}
      onClick={() => handleDetailEvent(event.id)}
      className='flex min-h-[100px] max-w-[1080px] cursor-pointer flex-col items-start justify-start rounded-[15px] border border-[#e9e9e9] bg-white p-6 transition hover:bg-gray-100 hover:shadow-md active:bg-gray-200 md:min-h-[121px] md:py-[9px]'
    >
      <CardHeader className='w-full pl-2 pr-4'>
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
      <CardFooter className='flex w-full items-center justify-between pb-4 pl-2 pr-4'>
        <div className='flex items-center gap-5'>
          <div className='flex items-center gap-2'>
            <Badge className='bg-green-200 font-bold text-gray-900 shadow-none hover:bg-green-200'>
              作成日
            </Badge>
            <span className='text-sm font-medium'>
              {dayjs(event.createdAt).format('YYYY/MM/DD')}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Badge className='bg-green-200 font-bold text-gray-900 shadow-none hover:bg-green-200'>
              更新日
            </Badge>
            <span className='text-sm font-medium'>
              {dayjs(event.updatedAt).format('YYYY/MM/DD')}
            </span>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Link href={data.shareUrl} target='_blank'>
            <Button
              variant='ghost'
              className='text-base text-gray-900 hover:text-black'
            >
              <ExternalLink size={28} />
              <span>ページを表示</span>
            </Button>
          </Link>
          <CopyUrlButton
            shareUrl={data.shareUrl}
            className='text-base text-green-300 hover:text-green-400'
          />
        </div>
      </CardFooter>
    </Card>
  );
};
