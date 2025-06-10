'use client';

import { useParams } from 'next/navigation';
import { useEventAuth } from '../../_hooks/useEventAuth';

export default function PublicEventPage() {
  const { userId, eventId } = useParams<{ userId: string; eventId: string }>();
  const { address, eventData, nftCheckData, nftError } = useEventAuth(
    userId,
    eventId
  );

  // ウォレット未接続の場合
  if (!address) {
    return (
      <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
        <h1 className='flex items-center justify-center text-4xl font-bold'>
          {eventData?.eventName || 'イベント'} 予約画面
        </h1>
        <div className='flex items-center justify-center text-lg font-medium'>
          このイベントにはNFT認証が必要です
        </div>
        <div className='flex items-center justify-center text-lg font-medium'>
          右上のボタンからウォレットを接続してください
        </div>
        {eventData?.nfts && eventData.nfts.length > 0 && (
          <div className='space-y-5 rounded-lg bg-white p-6'>
            <h2 className='text-center text-lg font-semibold text-gray-800'>
              必要なNFT条件
            </h2>
            {eventData.nfts.map((nft, index) => (
              <div key={index} className='rounded border bg-white p-4'>
                <div className='mb-2 font-semibold text-gray-900'>
                  対象コレクション：{nft.collectionName}
                </div>
                <div className='mb-2 font-semibold text-gray-900'>
                  必要保有数：{nft.minBalance}点
                  {nft.maxBalance ? ` 〜 ${nft.maxBalance}点` : '以上'}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  // NFT認証エラーの場合
  if (nftError) {
    return (
      <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
        <h1 className='flex items-center justify-center text-3xl font-bold'>
          エラーが発生しました
        </h1>
        <div className='flex flex-col items-center justify-center space-y-4'>
          <div className='text-lg text-red-600'>{nftError.message}</div>
          <div className='text-sm text-gray-600'>
            ウォレットアドレス: {address}
          </div>
        </div>
      </main>
    );
  }

  // NFT認証チェック中
  if (!nftCheckData) {
    return (
      <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
        <h1 className='flex items-center justify-center text-3xl font-bold'>
          NFT認証中...
        </h1>
        <div className='flex items-center justify-center'>
          <div className='size-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
        </div>
      </main>
    );
  }

  // NFT認証失敗の場合
  if (!nftCheckData.ok) {
    return (
      <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
        <h1 className='flex items-center justify-center text-3xl font-bold'>
          アクセス拒否
        </h1>
        <div className='flex flex-col items-center justify-center space-y-4'>
          <div className='whitespace-pre-line text-center text-lg text-red-600'>
            {nftCheckData.reason}
          </div>
          <div className='text-sm text-gray-600'>
            接続中のアドレス: {address}
          </div>
          <div className='text-sm text-gray-600'>イベントID: {eventId}</div>
          <div className='max-w-md text-center text-xs text-gray-500'>
            必要なNFTを保有していない場合、このイベントにアクセスできません。
          </div>
        </div>
      </main>
    );
  }

  // イベントデータ読み込み中
  if (!eventData) {
    return (
      <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
        <h1 className='flex items-center justify-center text-3xl font-bold'>
          イベント情報を読み込み中...
        </h1>
        <div className='flex items-center justify-center'>
          <div className='size-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
        </div>
      </main>
    );
  }

  // NFT認証成功 & イベントページ表示
  return (
    <main className='mx-auto mt-40 max-w-3xl space-y-10 px-4'>
      <div className='mb-4 flex items-center justify-center'>
        <div className='rounded-full bg-green-100 p-2'>
          <svg
            className='size-6 text-green-600'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>
      </div>
      <h1 className='flex items-center justify-center text-3xl font-bold text-green-600'>
        NFT認証成功！
      </h1>
      <div className='flex items-center justify-center text-lg'>
        {eventData?.eventName || 'イベント'}へようこそ
      </div>
      <div className='space-y-4 rounded-lg bg-gray-50 p-6'>
        <div className='flex items-center justify-center text-lg font-semibold'>
          イベントID: {eventId}
        </div>
        <div className='flex items-center justify-center gap-2'>
          認証済みアドレス:
          <div className='text-base font-semibold text-green-600'>
            {address}
          </div>
        </div>
      </div>
    </main>
  );
}
