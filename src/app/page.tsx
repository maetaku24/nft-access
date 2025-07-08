'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './_components/ui/button';

export default function Home() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section className='container mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20 lg:py-24'>
        <div className='grid grid-cols-1 items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* 左側のテキストコンテンツ */}
          <div className='order-first space-y-6 sm:space-y-8 lg:pl-8'>
            <div className='space-y-4 sm:space-y-6'>
              <div className='flex items-center justify-center lg:justify-start'>
                <div className='transition-transform duration-300 hover:scale-105'>
                  <Image
                    src='/logo.svg'
                    alt='NFT Access'
                    width={350}
                    height={100}
                    className='w-64 object-contain drop-shadow-sm sm:w-80 md:w-96 lg:w-[400px]'
                  />
                </div>
              </div>
              <p className='text-center text-lg font-medium text-gray-700 sm:text-xl md:text-2xl lg:text-left'>
                <span className='bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                  NFTホルダー専用
                </span>
                の予約システム
              </p>
              <div className='space-y-3 text-center text-sm leading-relaxed text-gray-600 sm:space-y-4 sm:text-base lg:text-left'>
                <p className='text-gray-700'>
                  NFT
                  Accessは、NFT保有者だけが利用できる予約管理システムです。NFT認証を通して、安全かつ簡単にイベントやサービスを予約できます。
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4'>
              <Link href='/login' className='w-full sm:w-auto'>
                <Button size='lg' className='w-full sm:w-auto'>
                  ログイン
                </Button>
              </Link>
              <Link href='/signup' className='w-full sm:w-auto'>
                <Button
                  size='lg'
                  variant='outline'
                  className='w-full sm:w-auto'
                >
                  新規登録
                </Button>
              </Link>
            </div>
          </div>

          <div className='hidden lg:flex lg:justify-center lg:pr-8'>
            <div className='w-full max-w-md'>
              <Image
                src='/images/hero-character.png'
                alt='NFTキャラクター'
                width={400}
                height={400}
                className='w-full object-contain'
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUTセクション */}
      <section className='bg-white/70 py-12 backdrop-blur-sm sm:py-16 md:py-20 lg:py-24'>
        <div className='container mx-auto max-w-6xl px-4'>
          <div className='mb-12 text-center sm:mb-16'>
            <div className='inline-block'>
              <h2 className='relative mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl'>
                ABOUT
                <div className='absolute -bottom-2 left-1/2 h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400'></div>
              </h2>
            </div>
            <p className='mt-6 text-sm text-gray-600 sm:text-base'>
              本サービスについて
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-3 md:gap-12'>
            {' '}
            <div className='text-center'>
              <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mx-auto mb-6 flex items-center justify-center'>
                  <Image
                    src='/images/icon-nft-authentication.png'
                    alt='NFT認証'
                    width={300}
                    height={300}
                    className='w-48 object-contain sm:w-56 md:w-64 lg:w-72 xl:w-[300px]'
                  />
                </div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900 sm:text-xl'>
                  NFT認証
                </h3>
                <p className='text-sm leading-relaxed text-gray-600 sm:text-base'>
                  保有しているNFTを認証して、限定イベントやサービスにアクセス可能。
                </p>
              </div>
            </div>{' '}
            <div className='text-center'>
              <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mx-auto mb-6 flex items-center justify-center'>
                  <Image
                    src='/images/icon-special-reservation.png'
                    alt='特別な予約体験'
                    width={300}
                    height={300}
                    className='w-48 object-contain sm:w-56 md:w-64 lg:w-72 xl:w-[300px]'
                  />
                </div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900 sm:text-xl'>
                  特別な予約体験
                </h3>
                <p className='text-sm leading-relaxed text-gray-600 sm:text-base'>
                  NFTホルダー専用のシステムで、特別な体験イベントを簡単に管理。
                </p>
              </div>
            </div>{' '}
            <div className='text-center'>
              <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mx-auto mb-6 flex items-center justify-center'>
                  <Image
                    src='/images/icon-simple-interface.png'
                    alt='シンプルで使いやすい'
                    width={300}
                    height={300}
                    className='w-48 object-contain sm:w-56 md:w-64 lg:w-72 xl:w-[300px]'
                  />
                </div>
                <h3 className='mb-4 text-lg font-semibold text-gray-900 sm:text-xl'>
                  シンプルで使いやすい
                </h3>
                <p className='text-sm leading-relaxed text-gray-600 sm:text-base'>
                  初心者でも直感的に操作できる設計で、ストレスフリーな体験を提供。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
