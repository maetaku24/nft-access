import React from 'react';
import { CreateEventCard } from './_components/card/CreateEventCard';

export default function DashboardPage() {
  return (
    <div>
      <div className='flex justify-center items-start mt-40'>
        <CreateEventCard />
      </div>
    </div>
  );
}
