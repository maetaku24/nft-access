'use client';

import { useParams } from 'next/navigation';
import { LoadingSpinner } from '../../../_components/LoadingSpinner';
import { ReservationTabs } from '../../_components/elements/ReservationTabs';
import { useEventAuth } from '../../_hooks/useEventAuth';

interface Props {
  children: React.ReactNode;
}

export default function ServiceEventLayout({ children }: Props) {
  const params = useParams();

  // パラメータを取得
  const userId = params.userId as string;
  const eventId = params.eventId as string;

  // NFT認証を実行
  const { address, eventData, nftCheckData, nftError } = useEventAuth(
    userId,
    eventId
  );

  // ウォレット未接続の場合
  if (!address) {
    return (
      <main className='mx-auto max-w-2xl py-16'>
        <div className='space-y-8 text-center'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900 md:text-4xl'>
              {eventData?.eventName || 'イベント'}
            </h1>
            <p className='text-gray-600'>予約にはNFT認証が必要です</p>
          </div>

          <div className='rounded-2xl border border-gray-200 bg-white p-8 shadow-sm'>
            <div className='space-y-8'>
              {/* ウォレット接続セクション */}
              <div className='space-y-4'>
                <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-blue-50'>
                  <svg
                    className='size-8 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                </div>
                <h2 className='text-xl font-semibold text-gray-900'>
                  ウォレットを接続してください
                </h2>
                <p className='text-sm text-gray-600'>
                  右上の「ウォレット接続」ボタンをクリックしてください
                </p>
              </div>

              {/* NFT条件セクション */}
              {eventData?.nfts && eventData.nfts.length > 0 && (
                <div className='space-y-6'>
                  {/* 区切り線 */}
                  <div className='mx-auto w-24 border-t border-gray-200'></div>

                  <div className='space-y-4'>
                    <h3 className='flex items-center justify-center gap-2 text-lg font-semibold text-gray-900'>
                      <svg
                        className='size-5 text-emerald-600'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      必要なNFT条件
                    </h3>

                    <p className='text-center text-sm text-gray-500'>
                      以下のNFTを保有している必要があります
                    </p>

                    <div className='space-y-3'>
                      {eventData.nfts.length > 0 && (
                        <div className='rounded-lg border border-gray-100 bg-gray-50 p-4'>
                          <div className='flex items-center justify-center gap-4'>
                            <div className='flex items-center gap-3'>
                              <h4 className='font-semibold text-gray-900'>
                                {eventData.nfts[0].collectionName}
                              </h4>
                            </div>
                            <span className='rounded-md bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800'>
                              {eventData.nfts[0].minBalance}点
                              {eventData.nfts[0].maxBalance
                                ? ` 〜 ${eventData.nfts[0].maxBalance}点`
                                : '以上'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // NFT認証エラーの場合
  if (nftError) {
    return (
      <main className='mx-auto max-w-2xl px-4 py-16'>
        <div className='space-y-8 text-center'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900 md:text-4xl'>
              エラーが発生しました
            </h1>
          </div>

          <div className='rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-8'>
            <div className='space-y-4'>
              <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-red-100'>
                <svg
                  className='size-8 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>
                認証エラー
              </h2>
              <p className='text-sm font-medium leading-relaxed text-red-600'>
                {nftError.message}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // NFT認証チェック中
  if (!nftCheckData) {
    return (
      <main className='mx-auto max-w-2xl px-4 py-16'>
        <div className='space-y-8 text-center'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900 md:text-4xl'>
              NFT認証中...
            </h1>
            <p className='text-gray-600'>しばらくお待ちください</p>
          </div>

          <div className='rounded-2xl border border-blue-100 bg-white p-8'>
            <div className='space-y-6'>
              <LoadingSpinner
                size='lg'
                text='NFTアクセス条件を確認しています'
                className='py-4'
              />
              <p className='text-sm text-gray-600'>
                あなたのウォレットが保有するNFTを確認中です
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // NFT認証失敗の場合
  if (!nftCheckData.ok) {
    return (
      <main className='mx-auto max-w-2xl px-4 py-16'>
        <div className='space-y-8 text-center'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900 md:text-4xl'>
              アクセス拒否
            </h1>
          </div>

          <div className='rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-8'>
            <div className='space-y-4'>
              <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-red-100'>
                <svg
                  className='size-8 text-red-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='whitespace-pre-line text-sm font-medium leading-relaxed text-red-600'>
                {nftCheckData.reason}
              </div>
              <div className='space-y-1 pt-4 text-xs text-gray-500'>
                <div>接続中のアドレス: {address}</div>
                <div>イベントID: {eventId}</div>
                <div className='mx-auto mt-2 max-w-sm text-center'>
                  必要なNFTを保有していない場合、このイベントにアクセスできません。
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // NFT認証成功
  return (
    <div className='mx-auto mb-16 max-w-6xl space-y-10 px-4'>
      <div className='flex items-center justify-center'>
        <div className='mb-6 flex items-center justify-center text-4xl font-bold md:text-5xl'>
          {eventData?.eventName || 'イベント'}
        </div>
      </div>
      <ReservationTabs />
      {children}
    </div>
  );
}
