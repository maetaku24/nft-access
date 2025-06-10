'use client';

import { useAccount } from 'wagmi';
import { usePublicFetch } from '@/app/_hooks/usePublicFetch';
import type { EventData, NftCheckData } from '@/app/_types/event';

export const useEventAuth = (userId: string, eventId: string) => {
  const { address } = useAccount();

  // イベント情報取得
  const { data: eventData } = usePublicFetch<EventData>(
    `/api/services/${userId}/${eventId}/public`
  );

  // NFT認証チェック
  const { data: nftCheckData, error: nftError } = usePublicFetch<NftCheckData>(
    address ? `/api/events/${eventId}/nft?addr=${address}` : null
  );

  return {
    address,
    eventData,
    nftCheckData,
    nftError,
  };
};
