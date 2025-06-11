'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { HeaderActionButton } from './HeaderActionButton';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { WalletConnectButton } from './WalletConnectButton';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export const Header: React.FC = () => {
  const { session, isLoding } = useSupabaseSession();
  const pathname = usePathname();

  const { userId, eventId } = useParams<{
    userId?: string;
    eventId?: string;
  }>();

  const isServicePage = pathname.startsWith('/services');
  const logoUrl = useMemo(() => (session ? '/dashboard' : '/'), [session]);

  if (pathname === '/signup' || pathname === '/login') {
    return (
      <header className='fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-green-100 px-4 py-3 shadow sm:px-6 md:px-11'>
        <Link
          href={logoUrl}
          className='h-[40px] w-[200px] sm:h-[45px] sm:w-[250px] md:h-[50px] md:w-[275px]'
        >
          <Logo />
        </Link>
        <Link href={pathname === '/signup' ? '/login' : '/signup'}>
          <Button type='button' className='text-base font-semibold'>
            {pathname === '/signup' ? 'ログイン' : '新規登録'}
          </Button>
        </Link>
      </header>
    );
  }

  if (isServicePage) {
    // userId / eventId が取れなければ fallback
    const fallbackHref = '/services';

    return (
      <header className='fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-green-100 px-4 py-3 shadow'>
        <Link
          href={
            userId && eventId ? `/services/${userId}/${eventId}` : fallbackHref
          }
          className='h-[40px] w-[200px]'
        >
          <Logo />
        </Link>
        <WalletConnectButton />
      </header>
    );
  }

  return (
    <header className='fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-green-100 px-4 py-3 shadow sm:px-6 md:px-11'>
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
              <HeaderActionButton />
              <UserMenu />
            </>
          ) : (
            <>
              <Link href='/login'>
                <Button type='button' className='text-base font-semibold'>
                  ログイン
                </Button>
              </Link>
              <Link href='/signup'>
                <Button
                  type='button'
                  variant='outline'
                  className='text-base font-semibold'
                >
                  新規登録
                </Button>
              </Link>
              <Link href='/contact'>
                <Button
                  type='button'
                  variant='outline'
                  className='text-base font-semibold'
                >
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
