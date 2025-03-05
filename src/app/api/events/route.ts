import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { getCurrentUser } from '../_utils/getCurrentUser';
import {
  CreateEventRequest,
  CreateEventResponse,
} from '@/app/_types/event/CreateEvent';

export const GET = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);
    const events = await prisma.event.findMany({
      where: {
        profile: {
          id: profile.id,
        },
      },
    });

    if (events.length === 0) {
      return NextResponse.json(
        { status: 'エラー', message: 'イベントが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
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
        // createManyではidを返さないのでPromise.allで処理
        Promise.all(
          nfts.map((nft) =>
            prisma.nft.create({
              data: {
                collectionName: nft.collectionName,
                standard: nft.standard,
                network: nft.network,
                contractAddress: nft.contractAddress,
                tokenId: nft.tokenId ?? null,
                minBalance: nft.minBalance,
                maxBalance: nft.maxBalance,
              },
            })
          )
        ),
        Promise.all(
          schedules.map((schedule) =>
            prisma.schedule.create({
              data: {
                type: schedule.type,
                weekday: schedule.weekday ?? null,
                date: schedule.date ? new Date(schedule.date) : null,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                maxParticipants: schedule.maxParticipants,
                isClosed: schedule.isClosed,
              },
            })
          )
        ),
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
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
