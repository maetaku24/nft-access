import { NextResponse, type NextRequest } from 'next/server';
import { handleError } from '@/app/api/_utils/handleError';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string; eventId: string } }
) => {
  const eventId = parseInt(params.eventId);

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        profile: {
          userId: params.userId,
        },
      },
      include: {
        profile: true,
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: 'イベントが存在しません' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        eventId: event.id,
        userId: event.profile.userId,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
