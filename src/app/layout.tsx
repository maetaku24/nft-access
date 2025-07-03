import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import { Footer } from './_components/Footer';
import { Header } from './_components/Header';
import './globals.css';
import ToastProvider from './_components/ToastProvider';
import { appName } from '@/config/app-config';
import { RainbowKitProviders } from '@/lib/wallet/rainbowProvider';
import '@rainbow-me/rainbowkit/styles.css';

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
    <html lang='ja' className='h-full'>
      <body className={`flex h-full flex-col ${noto.className}`}>
        <ToastProvider>
          <RainbowKitProviders>
            <Header />
            <main className='flex-1 pt-20'>{children}</main>
            <Footer />
          </RainbowKitProviders>
        </ToastProvider>
      </body>
    </html>
  );
}
