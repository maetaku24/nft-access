'use client';

import { useRouter } from 'next/navigation';
import { Card, CardTitle } from '@/app/_components/ui/card';
import { SquarePlus } from 'lucide-react';

export const CreateEventCard: React.FC = () => {
  const router = useRouter();
  const handleCreateEvent = () => {
    router.push('/dashboard/events/new');
  };
  return (
    <Card
      onClick={handleCreateEvent}
      className='w-full max-w-[1080px] min-h-[100px] md:min-h-[121px] 
                px-6 py-6 md:py-[9px] 
                bg-white rounded-[15px] border border-[#e9e9e9] 
                hover:shadow-md hover:bg-gray-100 active:bg-gray-200
                flex justify-center items-center cursor-pointer transition'
    >
      <CardTitle className='text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold flex items-center'>
        <SquarePlus
          size={56}
          className='pr-4 text-[#118b50] align-middle'
        />
        <span className='whitespace-nowrap'>新しくイベントを登録する</span>
      </CardTitle>
    </Card>
  );
}
