import type { NextRequest } from 'next/server';
import { getCurrentUser } from './getCurrentUser';
import { prisma } from '@/utils/prisma';

// 予約に対する権限をチェック（権限がない場合はエラーを投げる）
export const checkReservationPermission = async (
  request: NextRequest,
  eventId: number,
  reservationId: number,
  walletAddress?: string
): Promise<void> => {
  const reservation = await prisma.reservation.findUnique({
    where: {
      id: reservationId,
      eventId,
    },
    include: {
      events: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!reservation) {
    throw new Error('指定された予約が見つかりません');
  }

  let isEventCreator = false;
  let isReservationOwner = false;

  // イベント作成者かチェック
  try {
    const currentUser = await getCurrentUser(request);
    isEventCreator =
      reservation.events.profile.supabaseUserId === currentUser.supabaseUserId;
  } catch {
    isEventCreator = false;
  }

  // 予約者かチェック
  if (walletAddress) {
    isReservationOwner =
      reservation.walletAddress.toLowerCase() === walletAddress.toLowerCase();
  }

  const hasPermission = isEventCreator || isReservationOwner;

  if (!hasPermission) {
    throw new Error('この予約にアクセスする権限がありません');
  }
};
