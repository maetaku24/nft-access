'use client';

import { Label } from '@radix-ui/react-dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';

export const AvatarSettings = () => {
  return (
    <div>
      <Label className='mb-2 block text-sm font-semibold text-gray-900'>
        ユーザーアイコン
      </Label>
      <div className='flex items-center gap-8'>
        <Avatar className='size-20'>
          <AvatarImage
            src='/avatar_test.png'
            alt='Rounded avatar'
            width={400}
            height={400}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            className='border-gray-900 bg-white text-gray-900 hover:bg-blue-50 hover:text-gray-900'
          >
            変更
          </Button>
          <Button type='button' className='bg-red-600 hover:bg-red-600/75'>
            削除
          </Button>
        </div>
      </div>
    </div>
  );
};
