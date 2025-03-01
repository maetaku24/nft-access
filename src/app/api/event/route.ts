import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { supabase } from '@/utils/supabase';
import { Schedule } from '@/app/_types/schedule';
import {
  CreateEventRequest,
  CreateEventResponse,
} from '@/app/_types/event/CreateEvent';

export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  const supabaseUserId = data.user?.id;

  try {
    const events = await prisma.event.findMany({
      where: {
        profile: {
          supabaseUserId,
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

export const POST = async (request: Request) => {
  const token = request.headers.get('Authorization') ?? '';
  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const eventCreate = await prisma.$transaction(async (tx) => {
      const {
        profileId,
        eventName,
        length,
        nfts,
        schedules,
      }: CreateEventRequest = await request.json();

      // イベントを登録
      const eventData = await tx.event.create({
        data: {
          profile: {
            connect: {
              id: profileId,
            },
          },
          eventName,
          length,
        },
      });

      // NFTを登録
      await tx.nft.createMany({
        data: nfts.map((nft) => ({
          collectionName: nft.collectionName,
          standard: nft.standard,
          network: nft.network,
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId ?? null,
          minBalance: nft.minBalance,
          maxBalance: nft.maxBalance,
        })),
      });

      // イベントとNFTの中間テーブル登録
      await tx.eventNFT.createMany({
        data: nfts.map((nft) => ({
          nftId: nft?.id,
          eventId: eventData?.id,
        })),
      });

      // スケジュール登録
      await tx.schedule.createMany({
        data: schedules.map((schedule: Schedule) => ({
          type: schedule.type,
          weekday: schedule.weekday ?? null,
          date: schedule.date ? new Date(schedule.date) : null,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          maxParticipants: schedule.maxParticipants,
          isClosed: schedule.isClosed,
        })),
      });

      // イベントとスケジュールの中間テーブル登録
      await tx.eventSchedule.createMany({
        data: schedules.map((schedule) => ({
          scheduleId: schedule?.id,
          eventId: eventData?.id,
        })),
      });

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
