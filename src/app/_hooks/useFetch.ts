'use client';

import { useCallback } from 'react';
import useSWR from 'swr';
import { useSupabaseSession } from './useSupabaseSession';
import { appBaseUrl } from '@/config/app-config';

export const useFetch = <T>(path: string | null, token?: string | null) => {
  const { token: sessionToken } = useSupabaseSession();

  // tokenが明示的に渡された場合はそれを使用、未指定の場合はsessionTokenを使用
  const authToken = token !== undefined ? token : sessionToken;

  const fetcher = useCallback(
    async (path: string) => {
      // 本番環境では相対パスを使用してCORSエラーを回避
      const apiUrl =
        process.env.NODE_ENV === 'production' ? path : `${appBaseUrl}${path}`;

      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: authToken } : {}),
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const data: T = await res.json();
      return data;
    },
    [authToken]
  );

  const shouldFetch = token === null || authToken;

  const results = useSWR(shouldFetch ? path : null, fetcher);
  return results;
};
