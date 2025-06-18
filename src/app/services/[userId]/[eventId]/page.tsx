'use client';

import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ReservationForm } from '../../_components/form/ReservationForm';

export default function PublicEventPage() {
  const { userId, eventId } = useParams<{ userId: string; eventId: string }>();
  const { address } = useAccount();

  return (
    <ReservationForm
      userId={userId}
      eventId={eventId}
      walletAddress={address || ''}
    />
  );
}
