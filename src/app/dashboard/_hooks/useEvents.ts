import { useFetch } from '@/app/_hooks/useFetch';
import type { ListResponse } from '@/app/_types/event/ListResponse';

export const useEvents = () => useFetch<ListResponse>('/api/events');
