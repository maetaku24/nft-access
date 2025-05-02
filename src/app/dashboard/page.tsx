'use client';

import { CreateEventCard } from './_components/card/CreateEventCard';
import { EventCardList } from './_components/card/EventCardList';
import { EventCardSkeleton } from './_components/skeleton/EventCardSkeleton';
import { useEvents } from './_hooks/useEvents';

export default function DashboardPage() {
  const { data: events, isLoading } = useEvents();

  if (isLoading) {
    return (
      <div className='mx-auto w-full max-w-5xl'>
        <EventCardSkeleton />
      </div>
    );
  }

  const hasEvents = events && events.length > 0;

  return (
    <div className='mb-20 mt-40 flex w-full flex-col items-center space-y-4'>
      {hasEvents ? (
        <div className='w-full max-w-5xl px-4'>
          <EventCardList events={events} />
        </div>
      ) : (
        <div className='w-full max-w-5xl px-4'>
          <CreateEventCard />
        </div>
      )}
    </div>
  );
}
