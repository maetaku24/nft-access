import dayjs from 'dayjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '../_utils/getCurrentUser';
import type {
  CreateEventRequest,
  CreateEventResponse,
} from '@/app/_types/event/CreateEvent';
import type { ListResponse } from '@/app/_types/event/ListResponse';
import { handleError } from '@/app/api/_utils/handleError';
import { prisma } from '@/utils/prisma';

export const GET = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);
    const events = await prisma.event.findMany({
      where: {
        profile: {
          id: profile.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const response: ListResponse = events.map((event) => ({
      id: event.id,
      eventName: event.eventName,
      createdAt: dayjs(event.createdAt).format(),
      updatedAt: dayjs(event.updatedAt).format(),
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);

    const eventCreate = await prisma.$transaction(async (prisma) => {
      const { eventName, length, nfts, schedules }: CreateEventRequest =
        await request.json();

      // イベント・NFT・スケジュールを登録
      const [eventData, nftData, scheduleData] = await Promise.all([
        prisma.event.create({
          data: {
            profileId: profile.id,
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

      // 作成された内容のidを元に中間テーブルの作成
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
    return NextResponse.json<CreateEventResponse>({
      message: '作成しました',
      id: eventCreate,
    });
  } catch (error) {
    return handleError(error);
  }
};
