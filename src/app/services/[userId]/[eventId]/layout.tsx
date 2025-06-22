'use client';

import { useParams } from 'next/navigation';
import { LoadingSpinner } from '../../../_components/LoadingSpinner';
import { ReservationTabs } from '../../_components/elements/ReservationTabs';
import { useEventAuth } from '../../_hooks/useEventAuth';
import { Badge } from '@/app/_components/ui/badge';

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
                <div className='mb-2 flex items-center gap-2 font-semibold text-gray-900'>
                  <Badge className='bg-green-200 text-sm font-semibold text-gray-900 shadow-none hover:bg-green-200'>
                    コレクション
                  </Badge>
                  {nft.collectionName}
                </div>
                <div className='mb-2 flex items-center gap-2 font-semibold text-gray-900'>
                  <Badge className='bg-green-200 text-sm font-semibold text-gray-900 shadow-none hover:bg-green-200'>
                    必要保有数
                  </Badge>
                  {nft.minBalance}点
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
          <LoadingSpinner
            size='lg'
            text='NFTアクセス条件を確認中...'
            className='py-8'
          />
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
          <LoadingSpinner
            size='lg'
            text='イベント詳細を取得中...'
            className='py-8'
          />
        </div>
      </main>
    );
  }

  // NFT認証成功 - ServiceEventLayoutを表示
  return (
    <div className='mx-auto mt-40 max-w-6xl space-y-10 px-4'>
      <div className='flex items-center justify-center'>
        <div className='mb-6 flex items-center justify-center text-5xl font-bold'>
          {eventData?.eventName || 'イベント'}
        </div>
      </div>
      <ReservationTabs />
      {children}
    </div>
  );
}
