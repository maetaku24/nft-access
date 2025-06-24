import type { NextRequest } from 'next/server';
import { getCurrentUser } from './getCurrentUser';
import { prisma } from '@/utils/prisma';

export interface PermissionCheckResult {
  hasPermission: boolean;
  reservation?: unknown;
  event?: unknown;
}

// 予約に対する権限をチェック
export const checkReservationPermission = async (
  request: NextRequest,
  eventId: number,
  reservationId: number,
  walletAddress?: string
): Promise<PermissionCheckResult> => {
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
    return { hasPermission: false };
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

  return {
    hasPermission: isEventCreator || isReservationOwner,
    reservation,
    event: reservation.events,
  };
};
