import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { supabase } from '@/utils/supabase';
import {
  UpdateEventRequest,
  UpdateEventResponse,
} from '@/app/_types/event/UpdateEvent';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get('Authorization') ?? '';
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const eventId = parseInt(params.id);
    const profile = await prisma.profile.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });

    // profileがnullの場合はすぐにエラーを返す
    if (!profile) {
      return NextResponse.json(
        { status: 'ユーザー情報がありません' },
        { status: 401 }
      );
    }

    const eventDetail = await prisma.event.findUnique({
      where: {
        id: eventId,
        profile,
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
                type: true,
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
        { status: 400 }
      );
    }

    return NextResponse.json({ eventDetail });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 404 });
    }
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get('Authorization') ?? '';
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const eventId = parseInt(params.id);
    const profile = await prisma.profile.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });

    // profileがnullの場合はすぐにエラーを返す
    if (!profile) {
      return NextResponse.json(
        { status: 'ユーザー情報がありません' },
        { status: 401 }
      );
    }

    const updateEvent = await prisma.$transaction(async (prisma) => {
      const { eventName, length, nfts, schedules }: UpdateEventRequest =
        await request.json();

      // テーブルの削除
      await prisma.eventNFT.deleteMany({
        where: {
          eventId,
        },
      });
      await prisma.eventSchedule.deleteMany({
        where: {
          eventId,
        },
      });
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
          },
          data: {
            eventName,
            length,
          },
        }),
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
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 404 });
    }
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = request.headers.get('Authorization') ?? '';
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const eventId = parseInt(params.id);
    const profile = await prisma.profile.findUnique({
      where: {
        supabaseUserId: data.user.id,
      },
    });

    // profileがnullの場合はすぐにエラーを返す
    if (!profile) {
      return NextResponse.json(
        { status: 'ユーザー情報がありません' },
        { status: 401 }
      );
    }

    // 関連データの削除
    await prisma.$transaction(async (prisma) => {
      // 先に中間テーブルの削除
      await prisma.eventNFT.deleteMany({
        where: {
          id: eventId,
        },
      });
      await prisma.eventSchedule.deleteMany({
        where: {
          id: eventId,
        },
      });
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
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 404 });
    }
  }
};
