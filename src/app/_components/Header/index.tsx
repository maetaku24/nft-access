'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import Button from '../Button';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export const Header: React.FC = () => {
  const { session, isLoding } = useSupabaseSession();
  const pathname = usePathname();

  const logoUrl = useMemo(() => (session ? '/dashboard' : '/'), [session]);

  if (pathname === '/signup' || pathname === '/login') {
    return (
      <header
        className='fixed inset-x-0 top-0 z-50 flex items-center justify-between 
                      bg-green-100 px-4 py-3 shadow sm:px-6 md:px-11'
      >
        <Link
          href={logoUrl}
          className='h-[40px] w-[200px] sm:h-[45px] sm:w-[250px] md:h-[50px] md:w-[275px]'
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
      className='fixed inset-x-0 top-0 z-50 flex items-center justify-between 
                      bg-green-100 px-4 py-3 shadow sm:px-6 md:px-11'
    >
      <Link
        href={logoUrl}
        className='h-[40px] w-[200px] sm:h-[45px] sm:w-[250px] md:h-[50px] md:w-[275px]'
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
