import type { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoding, setIsLoding] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoding(false);
    };

    getSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setToken(session?.access_token || null);
    });
    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  return { session, isLoding, token };
};
