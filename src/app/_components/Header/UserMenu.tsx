'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { supabase } from '@/utils/supabase';

export default function UserMenu() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus-visible:outline-none'>
        <Avatar>
          <AvatarImage src='/avatar_test.png' alt='Rounded avatar' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='-translate-x-4 p-2'>
        <DropdownMenuItem asChild className='py-2'>
          <Link href='/dashboard/settings/basic'>アカウント設定</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='py-2 text-red-600' onClick={handleLogout}>
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
