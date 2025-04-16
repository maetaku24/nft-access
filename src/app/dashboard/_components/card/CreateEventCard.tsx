'use client';

import { SquarePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardTitle } from '@/app/_components/ui/card';

export const CreateEventCard: React.FC = () => {
  const router = useRouter();
  const handleCreateEvent = () => {
    router.push('/dashboard/events/new');
  };
  return (
    <Card
      onClick={handleCreateEvent}
      className='flex min-h-[100px] w-full max-w-[1080px] 
                cursor-pointer items-center justify-center 
                rounded-[15px] border border-[#e9e9e9] bg-white 
                p-6 transition hover:bg-gray-100
                hover:shadow-md active:bg-gray-200 md:min-h-[121px] md:py-[9px]'
    >
      <CardTitle className='flex items-center text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl'>
        <SquarePlus size={56} className='pr-4 align-middle text-[#118b50]' />
        <span className='whitespace-nowrap'>新しくイベントを登録する</span>
      </CardTitle>
    </Card>
  );
};
