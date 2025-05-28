import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../_utils/getCurrentUser';
import { handleError } from '@/app/api/_utils/handleError';
import { prisma } from '@/utils/prisma';

export const GET = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);
    const email = await prisma.profile.findUnique({
      where: {
        id: profile.id,
      },
      select: {
        email: true,
      },
    });

    if (!email) {
      return NextResponse.json(
        { status: 'エラー', message: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(email, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
