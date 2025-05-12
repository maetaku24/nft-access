'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/app/_components/ui/tabs';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname.split('/').pop();

  return (
    <div className='mx-auto flex max-w-6xl items-center justify-center'>
      <Tabs value={active}>
        <h1 className='mb-16 mt-10 flex items-center justify-start text-4xl font-bold'>
          各種設定
        </h1>
        <TabsList className='mb-10 flex justify-center gap-6'>
          <TabsTrigger
            asChild
            value='basic'
            className='rounded-none border-b-2 border-transparent text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none'
          >
            <Link href='/dashboard/settings/basic'>基本設定</Link>
          </TabsTrigger>
          <TabsTrigger
            asChild
            value='email'
            className='rounded-none border-b-2 border-transparent text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none'
          >
            <Link href='/dashboard/settings/email'>メールアドレス変更</Link>
          </TabsTrigger>
          <TabsTrigger
            asChild
            value='password'
            className='rounded-none border-b-2 border-transparent text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none'
          >
            <Link href='/dashboard/settings/password'>パスワード変更</Link>
          </TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  );
}
