'use client';

import { useFetch } from '@/app/_hooks/useFetch';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';

interface Props {
  userId: string;
  eventId: string;
}

export const useReservationSchedule = ({ userId, eventId }: Props) =>
  useFetch<ReservationSchedule[]>(
    `/api/services/${userId}/${eventId}/schedules`,
    null
  );
