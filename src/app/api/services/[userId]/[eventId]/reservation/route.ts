import dayjs from 'dayjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/app/_types/reservation/CreateReservation';
import { handleError } from '@/app/api/_utils/handleError';
import { checkNftConditionsAndRespond } from '@/app/api/_utils/nft';
import { validateReservationCapacity } from '@/app/api/_utils/reservationValidator';
import { prisma } from '@/utils/prisma';

export const POST = async (
  request: NextRequest,
  { params }: { params: { userId: string; eventId: string } }
) => {
  try {
    const eventId = parseInt(params.eventId);
    const { reservations }: CreateReservationRequest = await request.json();

    // 予約リクエストからwalletAddressを取得
    const walletAddress = reservations[0]?.walletAddress;
    if (!walletAddress) {
      return NextResponse.json(
        { status: 'エラー', message: 'ウォレットアドレスが必要です' },
        { status: 400 }
      );
    }

    // eventが存在するか確認（NFT条件も含む）
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        profile: true,
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

    // イベント所有者の確認
    if (event.profile.userId !== params.userId) {
      return NextResponse.json(
        { status: 'エラー', message: 'アクセス権限がありません' },
        { status: 403 }
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

    // 予約の定員チェック
    for (const reservation of reservations) {
      const validationResult = await validateReservationCapacity({
        eventId,
        reservationDate: reservation.reservationDate,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        participants: reservation.participants,
      });

      if (!validationResult.isValid) {
        return NextResponse.json(
          { status: 'エラー', message: validationResult.errorMessage },
          {
            status: validationResult.errorMessage?.includes('見つかりません')
              ? 404
              : 409,
          }
        );
      }
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
      message: `${reservationData.length}件の予約を作成しました。`,
      data: reservationData,
    });
  } catch (error) {
    return handleError(error);
  }
};
