'use client';

import { useAuthGuard } from '../_hooks/useAuthGuard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuthGuard();
  return <div className=''>{children}</div>;
}
