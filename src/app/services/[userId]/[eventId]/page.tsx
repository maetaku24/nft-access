'use client';

import { useParams } from 'next/navigation';
import { useFetch } from '@/app/_hooks/useFetch';

export default function PublicEventPage() {
  const { userId, eventId } = useParams<{ userId: string; eventId: string }>();

  const { data } = useFetch<{ userId: string; eventId: string }>(
    `/api/services/${userId}/${eventId}`
  );

  if (!data) return;

  return (
    <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
      <h1 className='flex items-center justify-center text-3xl font-bold'>
        イベント予約ページ（仮）
      </h1>
      <div className='flex items-center justify-center text-lg font-semibold'>
        userId: {data.userId}
      </div>
      <div className='flex items-center justify-center text-lg font-semibold'>
        eventId: {data.eventId}
      </div>
    </main>
  );
}
