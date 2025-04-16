'use client';

import Image from 'next/image';

export default function Logo() {
  return (
    <Image src='/logo.svg' alt='App Logo' width={275} height={50} priority />
  );
}
