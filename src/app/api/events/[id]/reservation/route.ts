import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/app/_types/reservation/CreateReservation';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { handleError } from '@/app/api/_utils/handleError';
import { dayjs } from '@/utils/dayjs';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);

    const reservations = await prisma.reservation.findMany({
      where: {
        eventId,
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
      orderBy: [
        {
          reservationDate: 'asc',
        },
        {
          startTime: 'asc',
        },
      ],
    });

    if (!reservations) {
      return NextResponse.json(
        { status: 'エラー', message: '指定されたイベントが見つかりません' },
        { status: 404 }
      );
    }

    const response: EventListResponse[] = reservations.map((reservation) => ({
      id: reservation.id,
      name: reservation.name,
      email: reservation.email,
      participants: reservation.participants,
      reservationDate: reservation.reservationDate,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

// NFT認証確認必要
export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const { reservations }: CreateReservationRequest = await request.json();

    // eventが存在するか確認
    const eventExists = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!eventExists) {
      return NextResponse.json(
        { status: 'エラー', message: '指定されたイベントが見つかりません' },
        { status: 404 }
      );
    }

    // 予約作成
    const reservationData = await prisma.reservation.createManyAndReturn({
      data: reservations.map((reservation) => ({
        eventId,
        name: reservation.name,
        email: reservation.email,
        participants: reservation.participants,
        walletAddress: reservation.walletAddress,
        reservationDate: dayjs(reservation.reservationDate).toDate(),
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: 'COMPLETED',
      })),
    });

    return NextResponse.json<CreateReservationResponse>({
      message: `${reservationData.length}件のデータを作成しました。`,
      data: reservationData,
    });
  } catch (error) {
    return handleError(error);
  }
};
