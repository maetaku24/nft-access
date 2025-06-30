import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { handleError } from '@/app/api/_utils/handleError';
import { checkNftConditionsAndRespond } from '@/app/api/_utils/nft';
import { validateReservationCapacity } from '@/app/api/_utils/reservationValidator';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('addr');

    if (!walletAddress) {
      return NextResponse.json(
        { status: 'エラー', message: 'ウォレットアドレスが指定されていません' },
        { status: 400 }
      );
    }

    // イベントとNFT条件を取得
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        eventNFTs: {
          include: {
            nft: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { status: 'エラー', message: '指定されたイベントが見つかりません' },
        { status: 404 }
      );
    }

    // NFT認証チェック
    const nftValidationError = await checkNftConditionsAndRespond(
      event.eventNFTs,
      walletAddress
    );
    if (nftValidationError) {
      return nftValidationError;
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        eventId,
        walletAddress: {
          equals: walletAddress,
          mode: 'insensitive',
        },
        OR: [
          // 今日より後の日付の予約
          {
            reservationDate: {
              gt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
          // 今日の日付で現在時刻より後の予約
          {
            AND: [
              {
                reservationDate: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
              {
                startTime: {
                  gt: new Date().toTimeString().substring(0, 5),
                },
              },
            ],
          },
        ],
      },
      include: {
        events: {
          select: {
            id: true,
            eventName: true,
            profile: {
              select: {
                userId: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        reservationDate: 'desc',
      },
    });

    // 各予約に対して、その時間枠の予約可能数情報を計算
    const response = await Promise.all(
      reservations.map(async (reservation) => {
        const validationResult = await validateReservationCapacity({
          eventId,
          reservationDate: reservation.reservationDate,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          participants: 0, // 既存予約なので0を指定
        });

        // 定員情報が取得できない場合のデフォルト値
        const maxParticipants = validationResult.schedule?.maxParticipants ?? 0;
        const availableCount = validationResult.availableSlots ?? 0;

        // 同じ時間枠の予約数を計算
        const reservedCount = await prisma.reservation.aggregate({
          where: {
            eventId,
            reservationDate: reservation.reservationDate,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
          },
          _sum: {
            participants: true,
          },
        });
        const currentReservedCount = reservedCount._sum.participants || 0;

        return {
          id: reservation.id,
          name: reservation.name,
          email: reservation.email,
          participants: reservation.participants,
          reservationDate: reservation.reservationDate,
          startTime: reservation.startTime,
          endTime: reservation.endTime,
          maxParticipants,
          reservedCount: currentReservedCount,
          availableCount,
        };
      })
    );

    return NextResponse.json<EventListResponse[]>(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
