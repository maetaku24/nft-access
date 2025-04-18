import React from 'react';
import { CreateEventCard } from './_components/card/CreateEventCard';
import { EventCard } from './_components/card/EventCard';

export default function DashboardPage() {
  return (
    <div className='mb-20 mt-40 flex w-full flex-col items-center space-y-4'>
      <div className='w-full max-w-5xl px-4'>
        <EventCard />
      </div>
      <div className='w-full max-w-5xl px-4'>
        <CreateEventCard />
      </div>
    </div>
  );
}
