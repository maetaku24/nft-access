'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../Button';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';

export const HeaderActionButton: React.FC = () => {
  const { session } = useSupabaseSession();
  const pathname = usePathname();

  if (!session) return null;

  if (pathname === '/dashboard') {
    return (
      <Link href='/dashboard/events/new'>
        <Button type='button'>新規イベント作成</Button>
      </Link>
    );
  }

  if (pathname.startsWith('/dashboard')) {
    return (
      <Link href='/dashboard'>
        <Button type='button'>ダッシュボード</Button>
      </Link>
    );
  }

  return null;
};
