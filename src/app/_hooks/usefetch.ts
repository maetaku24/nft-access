'use client';

import useSWR from 'swr';
import { useSupabaseSession } from './useSupabaseSession';
import { appBaseUrl } from '@/config/app-config';

export const useFetch = <T>(path: string) => {
  const { token } = useSupabaseSession();
  const fetcher = async () => {
    if (!token) return;

    const res = await fetch(`${appBaseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }

    const data: T = await res.json();
    return data;
  };
  const results = useSWR(token ? `${appBaseUrl}${path}` : null, fetcher);
  return results;
};
