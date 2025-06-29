import dayjs from 'dayjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import type {
  UpdateReservationRequest,
  UpdateReservationResponse,
} from '@/app/_types/reservation/UpdateReservation';
import { handleError } from '@/app/api/_utils/handleError';
import { checkReservationPermission } from '@/app/api/_utils/reservationPermission';
import { validateReservationCapacity } from '@/app/api/_utils/reservationValidator';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string; reservationId: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const reservationId = parseInt(params.reservationId);

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('addr');

    // 権限チェック
    await checkReservationPermission(
      request,
      eventId,
      reservationId,
      walletAddress || undefined
    );

    // 予約詳細を取得
    const reservationDetail = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
        eventId,
      },
    });

    if (!reservationDetail) {
      return NextResponse.json(
        { status: 'エラー', message: '指定された予約が見つかりません' },
        { status: 404 }
      );
    }

    const response = {
      id: reservationDetail.id,
      name: reservationDetail.name,
      email: reservationDetail.email,
      participants: reservationDetail.participants,
      reservationDate: reservationDetail.reservationDate,
      startTime: reservationDetail.startTime,
      endTime: reservationDetail.endTime,
    };

    return NextResponse.json<EventListResponse>(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string; reservationId: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const reservationId = parseInt(params.reservationId);

    const {
      name,
      email,
      participants,
      walletAddress,
      reservationDate,
      startTime,
      endTime,
    }: UpdateReservationRequest = await request.json();

    // 権限チェック
    await checkReservationPermission(
      request,
      eventId,
      reservationId,
      walletAddress
    );

    // 現在の予約情報を取得
    const currentReservation = await prisma.reservation.findUnique({
      where: {
        id: reservationId,
        eventId,
      },
    });

    if (!currentReservation) {
      return NextResponse.json(
        { status: 'エラー', message: '指定された予約が見つかりません' },
        { status: 404 }
      );
    }

    // 予約可能数チェック（更新時）
    if (participants !== currentReservation.participants) {
      const validationResult = await validateReservationCapacity({
        eventId,
        reservationDate,
        startTime,
        endTime,
        participants,
        excludeReservationId: reservationId,
      });

      if (!validationResult.isValid) {
        return NextResponse.json(
          { status: 'エラー', message: validationResult.errorMessage },
          {
            status: validationResult.errorMessage?.includes('見つかりません')
              ? 404
              : 400,
          }
        );
      }
    }

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

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string; reservationId: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const reservationId = parseInt(params.reservationId);

    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('addr');

    // 権限チェック
    await checkReservationPermission(
      request,
      eventId,
      reservationId,
      walletAddress || undefined
    );

    const deletedReservation = await prisma.reservation.delete({
      where: {
        id: reservationId,
      },
    });

    return NextResponse.json(
      { message: '予約を削除しました', deletedReservation },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
