import { useFetch } from '@/app/_hooks/useFetch';
import type { ShareUrlResponse } from '@/app/_types/shareUrl';

export const useShareUrl = (eventId: number) =>
  useFetch<ShareUrlResponse>(`/api/eventUrl/${eventId}`);
