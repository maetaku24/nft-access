import type { NextRequest } from 'next/server';
import { prisma } from '@/utils/prisma';
import { supabase } from '@/utils/supabase';

export const getCurrentUser = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';

  if (!token) {
    throw new Error('認証トークンがありません');
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    throw new Error('認証に失敗しました');
  }

  const profile = await prisma.profile.findUnique({
    where: {
      supabaseUserId: data.user.id,
    },
  });

  if (!profile) {
    throw new Error('プロフィール情報が見つかりません');
  }

  return profile;
};
