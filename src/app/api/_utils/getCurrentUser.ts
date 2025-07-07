import type { NextRequest } from 'next/server';
import { prisma } from '@/utils/prisma';
import { supabase } from '@/utils/supabase';

export const getCurrentUser = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';

  // デバッグログ追加
  console.log('🔍 getCurrentUser Debug:');
  console.log('Token received:', !!token);
  console.log('Token length:', token.length);
  console.log('Token preview:', token.substring(0, 20) + '...');

  if (!token) {
    console.error('❌ No token provided');
    throw new Error('認証トークンがありません');
  }

  const { data, error } = await supabase.auth.getUser(token);

  // Supabase認証結果のデバッグ
  console.log('Supabase auth result:');
  console.log('- User exists:', !!data?.user);
  console.log('- User ID:', data?.user?.id);
  console.log('- Error:', error);

  if (error) {
    console.error('❌ Supabase auth error:', error);
    throw new Error('認証に失敗しました');
  }

  const profile = await prisma.profile.findUnique({
    where: {
      supabaseUserId: data.user.id,
    },
  });

  console.log('Profile found:', !!profile);

  if (!profile) {
    console.error('❌ Profile not found for user:', data.user.id);
    throw new Error('プロフィール情報が見つかりません');
  }

  console.log('✅ getCurrentUser success');
  return profile;
};
