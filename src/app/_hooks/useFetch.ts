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
      // デバッグログ追加
      console.log('🔍 API Request Debug:');
      console.log('URL:', `${appBaseUrl}${path}`);
      console.log('Auth Token exists:', !!authToken);
      console.log('Auth Token length:', authToken?.length || 0);
      console.log('Auth Token preview:', authToken?.substring(0, 20) + '...');

      const res = await fetch(`${appBaseUrl}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: authToken } : {}),
        },
      });

      // レスポンスのデバッグ
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message);
      }

      const data: T = await res.json();
      console.log('✅ API Success:', data);
      return data;
    },
    [authToken]
  );

  const shouldFetch = token === null || authToken;

  const results = useSWR(shouldFetch ? path : null, fetcher);
  return results;
};
