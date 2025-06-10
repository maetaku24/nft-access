'use client';

import useSWR from 'swr';
import { appBaseUrl } from '@/config/app-config';

export const usePublicFetch = <T>(path: string | null) => {
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;

      try {
        const errorData = await res.json();
        // APIレスポンスのフィールドに合わせて reason または message を確認
        errorMessage = errorData.reason || errorData.message || errorMessage;
      } catch {
        // エラーレスポンスのパースに失敗した場合はHTTPステータスを使用
      }

      throw new Error(errorMessage);
    }

    const data: T = await res.json();
    return data;
  };

  const results = useSWR(path ? `${appBaseUrl}${path}` : null, fetcher);
  return results;
};
