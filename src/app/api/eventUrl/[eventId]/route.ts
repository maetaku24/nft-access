import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../_utils/getCurrentUser';
import { handleError } from '@/app/api/_utils/handleError';
import { appBaseUrl } from '@/config/app-config';
import { prisma } from '@/utils/prisma';

export const GET = async (
  request: NextRequest,
  { params }: { params: { eventId: string } }
) => {
  const eventId = parseInt(params.eventId);
  const profile = await getCurrentUser(request);

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        profileId: profile.id,
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

    const response = `${appBaseUrl}/services/${event.profile.userId}/${event.id}`;

    return NextResponse.json({ shareUrl: response }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
