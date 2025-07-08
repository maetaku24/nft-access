'use client';

import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { HeaderActionButton } from './HeaderActionButton';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { WalletConnectButton } from './WalletConnectButton';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { feedbackUrl } from '@/config/app-config';

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
      <header className='fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-green-100 px-4 py-3 shadow sm:px-6 md:px-11'>
        <Link
          href={
            userId && eventId ? `/services/${userId}/${eventId}` : fallbackHref
          }
          className='h-[40px] w-[200px] sm:h-[45px] sm:w-[250px] md:h-[50px] md:w-[275px]'
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
        <div className='flex items-center gap-5'>
          <a
            href={feedbackUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='hidden items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-md transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 hover:shadow-lg sm:flex'
            title='フィードバック'
          >
            <MessageSquare size={14} />
            <span>フィードバック</span>
          </a>

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
            </>
          )}
        </div>
      )}
    </header>
  );
};
