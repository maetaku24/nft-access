'use client';

import { SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShareUrlCard } from '../../_components/card/ShareUrlCard';
import { ShareLink } from '../../_components/elements/ShareLink';
import { EventReservationTable } from '../../_components/table/EventReservationTable';
import { Button } from '@/app/_components/ui/button';

export default function DetailEventPage() {
  const { id } = useParams();
  const eventId = Number(id);

  return (
    <div>
      <h1 className='flex items-start justify-center text-4xl font-bold'>
        イベント詳細
      </h1>
      <div className='mx-auto mt-40 flex w-full max-w-7xl items-center justify-between'>
        <div className='text-2xl font-semibold'>予約状況</div>
        <div className='flex items-center gap-5'>
          <ShareLink eventId={eventId} />
          <Link href={`/dashboard/events/${eventId}/edit`}>
            <Button
              size='lg'
              className='bg-green-300 px-4 text-xl hover:bg-green-300/75'
            >
              <SquarePen size={28} />
              イベントを編集
            </Button>
          </Link>
        </div>
      </div>
      <div className='mx-auto mt-10 w-full max-w-7xl'>
        <ShareUrlCard eventId={eventId} />
      </div>
      <div className='mx-auto mt-10 w-full max-w-7xl'>
        <EventReservationTable />
      </div>
    </div>
  );
}
