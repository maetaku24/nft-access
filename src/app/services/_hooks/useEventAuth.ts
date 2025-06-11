'use client';

import { useAccount } from 'wagmi';
import { useFetch } from '@/app/_hooks/useFetch';
import type { EventData, NftCheckData } from '@/app/_types/event';

export const useEventAuth = (userId: string, eventId: string) => {
  const { address } = useAccount();

  // イベント情報取得
  const { data: eventData } = useFetch<EventData>(
    `/api/services/${userId}/${eventId}/public`,
    null
  );

  // NFT認証チェック
  const { data: nftCheckData, error: nftError } = useFetch<NftCheckData>(
    address ? `/api/events/${eventId}/nft?addr=${address}` : null,
    null
  );

  return {
    address,
    eventData,
    nftCheckData,
    nftError,
  };
};
