import dayjs from 'dayjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../_utils/getCurrentUser';
import type {
  UpdateEventRequest,
  UpdateEventResponse,
} from '@/app/_types/event/UpdateEvent';
import { handleError } from '@/app/api/_utils/handleError';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const profile = await getCurrentUser(request);

    const eventDetail = await prisma.event.findUnique({
      where: {
        id: eventId,
        profileId: profile.id,
      },
      include: {
        eventNFTs: {
          include: {
            nft: {
              select: {
                collectionName: true,
                standard: true,
                network: true,
                contractAddress: true,
                tokenId: true,
                minBalance: true,
                maxBalance: true,
              },
            },
          },
        },
        eventSchedules: {
          include: {
            schedule: {
              select: {
                weekday: true,
                date: true,
                startTime: true,
                endTime: true,
                maxParticipants: true,
                isClosed: true,
              },
            },
          },
        },
      },
    });

    if (!eventDetail) {
      return NextResponse.json(
        { message: 'イベントが存在しません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ eventDetail });
  } catch (error) {
    return handleError(error);
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const profile = await getCurrentUser(request);

    const updateEvent = await prisma.$transaction(async (prisma) => {
      const { eventName, length, nfts, schedules }: UpdateEventRequest =
        await request.json();

      // テーブルの削除
      // onDelete: Cascadeを設定しているので、親であるnftとscheduleが削除されれば自動的に中間テーブルも削除される
      await prisma.nft.deleteMany({
        where: {
          eventNFTs: {
            some: {
              eventId,
            },
          },
        },
      });
      await prisma.schedule.deleteMany({
        where: {
          eventSchedules: {
            some: {
              eventId,
            },
          },
        },
      });

      // テーブルの更新
      const [eventData, nftData, scheduleData] = await Promise.all([
        prisma.event.update({
          where: {
            id: eventId,
            profileId: profile.id,
          },
          data: {
            eventName,
            length,
          },
        }),
        await prisma.nft.createManyAndReturn({
          data: nfts.map((nft) => ({
            collectionName: nft.collectionName,
            standard: nft.standard,
            network: nft.network,
            contractAddress: nft.contractAddress,
            tokenId: nft.tokenId ?? null,
            minBalance: nft.minBalance,
            maxBalance: nft.maxBalance,
          })),
          select: {
            id: true,
          },
        }),
        await prisma.schedule.createManyAndReturn({
          data: schedules.map((schedule) => ({
            weekday: schedule.weekday,
            date: schedule.date ? dayjs(schedule.date).toDate() : null,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            maxParticipants: schedule.maxParticipants,
            isClosed: schedule.isClosed,
          })),
          select: {
            id: true,
          },
        }),
      ]);

      await Promise.all([
        prisma.eventNFT.createMany({
          data: nftData.map((nft) => ({
            nftId: nft.id,
            eventId: eventData.id,
          })),
        }),
        prisma.eventSchedule.createMany({
          data: scheduleData.map((schedule) => ({
            scheduleId: schedule.id,
            eventId: eventData.id,
          })),
        }),
      ]);

      return eventData.id;
    });

    return NextResponse.json<UpdateEventResponse>({
      message: 'イベントを更新しました',
      id: updateEvent,
    });
  } catch (error) {
    return handleError(error);
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const profile = await getCurrentUser(request);

    // 関連データの削除
    await prisma.$transaction(async (prisma) => {
      // テーブルの削除
      // onDelete: Cascadeを設定しているので、親であるevent・nft・scheduleが削除されれば自動的に中間テーブルも削除される
      await prisma.nft.deleteMany({
        where: {
          eventNFTs: {
            some: {
              eventId,
            },
          },
        },
      });
      await prisma.schedule.deleteMany({
        where: {
          eventSchedules: {
            some: {
              eventId,
            },
          },
        },
      });
      await prisma.event.delete({
        where: {
          id: eventId,
          profileId: profile.id,
        },
      });
    });

    return NextResponse.json(
      { message: 'イベントを削除しました' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
