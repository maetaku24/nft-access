'use client';

import { useParams } from 'next/navigation';
import { ReservationForm } from '../../_components/form/ReservationForm';
import { useEventAuth } from '../../_hooks/useEventAuth';

export default function PublicEventPage() {
  const { userId, eventId } = useParams<{ userId: string; eventId: string }>();
  const { address } = useEventAuth(userId, eventId);

  return (
    <div className='mx-auto max-w-4xl'>
      <ReservationForm
        userId={userId}
        eventId={eventId}
        walletAddress={address || ''}
      />
    </div>
  );
}
