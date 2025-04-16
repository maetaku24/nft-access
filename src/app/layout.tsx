import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import { Header } from './_components/Header';
import './globals.css';
import ToastProvider from './_components/ToastProvider';
import { appName } from '@/config/app-config';

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
        <ToastProvider>
          <Header />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
