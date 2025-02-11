import { Header } from './_components/Header';
import type { Metadata } from 'next';
import { appName } from '@/config/app-config';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans_JP({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: appName,
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={noto.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
