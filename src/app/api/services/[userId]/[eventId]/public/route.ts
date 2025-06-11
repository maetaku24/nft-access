import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { EventData } from '@/app/_types/event';
import { handleError } from '@/app/api/_utils/handleError';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string; eventId: string } }
) => {
  try {
    const { userId } = params;
    const eventId = parseInt(params.eventId);

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        profile: {
          userId,
        },
      },
      include: {
        eventNFTs: {
          include: {
            nft: {
              select: {
                collectionName: true,
                standard: true,
                network: true,
                minBalance: true,
                maxBalance: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: 'イベントが見つかりません' },
        { status: 404 }
      );
    }

    const publicEventData = {
      eventName: event.eventName,
      nfts: event.eventNFTs.map(({ nft }) => ({
        collectionName: nft.collectionName,
        standard: nft.standard,
        network: nft.network,
        minBalance: nft.minBalance,
        maxBalance: nft.maxBalance,
      })),
    };

    return NextResponse.json<EventData>(publicEventData, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
