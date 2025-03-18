import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import prisma from '@/utils/prisma';
import { handleError } from '@/app/api/_utils/handleError';
import {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/app/_types/reservation/CreateReservation';

// NFT認証確認必要
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);

    const reservations = await prisma.reservation.findMany({
      where: {
        eventId,
      },
    });

    if (!reservations) {
      return NextResponse.json(
        { status: 'エラー', message: '指定されたイベントが見つかりません' },
        { status: 404 }
      );
    }
    return NextResponse.json({ reservations }, { status: 200 });
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
