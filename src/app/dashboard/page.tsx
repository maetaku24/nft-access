import React from 'react';
import { CreateEventCard } from './_components/card/CreateEventCard';

export default function DashboardPage() {
  return (
    <div>
      <div className='mt-40 flex items-start justify-center'>
        <CreateEventCard />
      </div>
    </div>
  );
}
