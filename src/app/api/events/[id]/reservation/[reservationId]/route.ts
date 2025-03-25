import { NextRequest, NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { prisma } from '@/utils/prisma';
import { handleError } from '@/app/api/_utils/handleError';
import {
  UpdateReservationRequest,
  UpdateReservationResponse,
} from '@/app/_types/reservation/UpdateReservation';

// NFT認証確認必要
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; reservationId: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const reservationId = parseInt(params.reservationId);

    const reservation = await prisma.reservation.findMany({
      where: {
        id: reservationId,
        eventId,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { status: 'エラー', message: '指定された予約が見つかりません' },
        { status: 404 }
      );
    }
    return NextResponse.json({ reservation }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

// NFT認証確認必要
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string; reservationId: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const reservationId = parseInt(params.reservationId);

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
        eventId,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { status: 'エラー', message: '指定された予約が見つかりません' },
        { status: 404 }
      );
    }

    const {
      name,
      email,
      participants,
      walletAddress,
      reservationDate,
      startTime,
      endTime,
    }: UpdateReservationRequest = await request.json();

    const reservationData = await prisma.reservation.update({
      where: {
        id: reservationId,
        eventId,
      },
      data: {
        name,
        email,
        participants,
        walletAddress,
        reservationDate: dayjs(reservationDate).toDate(),
        startTime,
        endTime,
        status: 'UPDATED',
      },
    });

    return NextResponse.json<UpdateReservationResponse>({
      message: '予約を更新しました',
      data: reservationData,
    });
  } catch (error) {
    return handleError(error);
  }
};

// NFT認証確認必要
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string; reservationId: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const reservationId = parseInt(params.reservationId);

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
        eventId,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { status: 'エラー', message: '指定された予約が見つかりません' },
        { status: 404 }
      );
    }

    const deletedReservation = await prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });
    return NextResponse.json(
      { message: 'イベントを削除しました', deletedReservation },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
