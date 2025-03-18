'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import Button from '../Button';
import Logo from './Logo';
import UserMenu from './UserMenu';

export const Header: React.FC = () => {
  const { session, isLoding } = useSupabaseSession();
  const pathname = usePathname();

  const logoUrl = useMemo(() => (session ? '/dashboard' : '/'), [session]);

  if (pathname === '/signup' || pathname === '/login') {
    return (
      <header
        className='fixed top-0 left-0 right-0 z-50 bg-green-100 shadow 
                      px-4 sm:px-6 md:px-11 py-3 flex justify-between items-center'
      >
        <Link
          href={logoUrl}
          className='w-[200px] sm:w-[250px] md:w-[275px] h-[40px] sm:h-[45px] md:h-[50px]'
        >
          <Logo />
        </Link>
        <Link href={pathname === '/signup' ? '/login' : '/signup'}>
          <Button type='button' variant='primary'>
            {pathname === '/signup' ? 'ログイン' : '新規登録'}
          </Button>
        </Link>
      </header>
    );
  }

  return (
    <header
      className='fixed top-0 left-0 right-0 z-50 bg-green-100 shadow 
                      px-4 sm:px-6 md:px-11 py-3 flex justify-between items-center'
    >
      <Link
        href={logoUrl}
        className='w-[200px] sm:w-[250px] md:w-[275px] h-[40px] sm:h-[45px] md:h-[50px]'
      >
        <Logo />
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
              <UserMenu />
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
