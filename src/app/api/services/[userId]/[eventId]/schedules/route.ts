import { NextResponse, type NextRequest } from 'next/server';
import { handleError } from '@/app/api/_utils/handleError';
import { processEventSchedules } from '@/app/api/_utils/scheduleProcessor';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string; eventId: string } }
) => {
  const eventId = parseInt(params.eventId);

  try {
    // イベント情報を取得
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        profile: {
          userId: params.userId,
        },
      },
      include: {
        profile: true,
        eventSchedules: {
          include: { schedule: true },
        },
      },
    });

    // イベントが存在しない場合
    if (!event) {
      return NextResponse.json(
        { message: 'イベントが見つからないか、アクセス権限がありません' },
        { status: 404 }
      );
    }

    // 予約データを取得
    const reservations = await prisma.reservation.findMany({
      where: { eventId },
    });

    // スケジュール処理を実行
    const schedules = processEventSchedules(
      event.eventSchedules,
      event.length,
      reservations
    );

    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
