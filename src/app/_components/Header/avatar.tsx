'use client';

import Image from 'next/image';

export default function Avatar() {
  return (
    <Image
      src='/avatar_test.png'
      alt='Rounded avatar'
      width={48}
      height={48}
      className='w-12 h-12 rounded-full'
    />
  );
};
