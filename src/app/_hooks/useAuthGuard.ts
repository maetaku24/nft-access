'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSupabaseSession } from './useSupabaseSession';

export const useAuthGuard = () => {
  const { session, isLoding } = useSupabaseSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoding) return;
    if (session) return;
    router.replace('/');
  }, [isLoding, session, router]);
};
