import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { handleError } from '@/app/api/_utils/handleError';
import { checkNftConditionsAndRespond } from '@/app/api/_utils/nft';
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

    const response = reservations.map((reservation) => ({
      id: reservation.id,
      name: reservation.name,
      email: reservation.email,
      participants: reservation.participants,
      reservationDate: reservation.reservationDate,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    }));

    return NextResponse.json<EventListResponse[]>(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
