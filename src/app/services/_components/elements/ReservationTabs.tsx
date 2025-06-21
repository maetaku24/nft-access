'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';

export const ReservationTabs = () => {
  const pathname = usePathname();
  const params = useParams();

  // パラメータを取得
  const userId = params.userId as string;
  const eventId = params.eventId as string;

  // 現在のタブを判定
  const isReservationManagement = pathname.includes('/reservations');
  const active = isReservationManagement ? 'management' : 'reservation';

  return (
    <div className='flex w-full items-center justify-center px-4'>
      <Tabs value={active} className='w-full max-w-2xl'>
        <TabsList className='mb-10 grid w-full grid-cols-2 rounded-xl bg-slate-100/80 p-1 backdrop-blur-sm'>
          <TabsTrigger
            asChild
            value='reservation'
            className='rounded-lg rounded-r-none border bg-white px-8 py-3 text-base font-semibold transition-all hover:bg-green-300/50 data-[state=active]:border-green-300 data-[state=active]:bg-green-300 data-[state=active]:text-white'
          >
            <Link href={`/services/${userId}/${eventId}`}>予約</Link>
          </TabsTrigger>
          <TabsTrigger
            asChild
            value='management'
            className='rounded-lg rounded-l-none border bg-white px-8 py-3 text-base font-semibold transition-all hover:bg-green-300/50 data-[state=active]:border-green-300 data-[state=active]:bg-green-300 data-[state=active]:text-white'
          >
            <Link href={`/services/${userId}/${eventId}/reservations`}>
              予約管理
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
