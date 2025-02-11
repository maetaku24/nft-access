'use client';

import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { supabase } from '@/utils/spabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { use } from 'react';
import Image from 'next/image';
import Button from '../Button';
import Avatar from './avatar';

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const { session, isLoding } = useSupabaseSession();

  return (
    <header className='flex justify-between items-center  px-11 py-[13px] bg-green-100'>
      <Link href='/' className='w-[275px] h-[50px]'>
        <Image
          src='/logo.svg'
          alt='App Logo'
          width={275}
          height={50}
          priority
        />
      </Link>
      {!isLoding && (
        <div className='flex items-center gap-4'>
          {session ? (
            <>
              <Link href='/dashboard/events/new'>
                <Button type='button' variant='primary'>
                  新規イベント作成
                </Button>
              </Link>
              <Button type='button' variant='primary' onClick={handleLogout}>
                ログアウト
              </Button>
              <Avatar />
            </>
          ) : (
            <>
              <Link href='/login'>
                <Button type='button' variant='primary'>
                  ログイン
                </Button>
              </Link>
              <Link href='/signup'>
                <Button type='button' variant='outline'>
                  新規登録
                </Button>
              </Link>
              <Link href='/contact'>
                <Button type='button' variant='outline'>
                  お問い合わせ
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
