import { useFetch } from '@/app/_hooks/useFetch';
import type { listResponse } from '@/app/_types/event/listResponse';

export const useEvents = () => useFetch<listResponse>('/api/events');
