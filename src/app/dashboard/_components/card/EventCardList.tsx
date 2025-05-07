'use client';

import { EventCardItem } from '../elements/EventCardItem';
import type { ListResponse } from '@/app/_types/event/ListResponse';

export const EventCardList: React.FC<{ events: ListResponse }> = ({
  events,
}) => {
  return (
    <div className='space-y-4'>
      {events.map((event) => (
        <EventCardItem key={event.id} event={event} />
      ))}
    </div>
  );
};
