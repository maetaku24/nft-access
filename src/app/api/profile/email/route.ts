import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../_utils/getCurrentUser';
import type { EmailResponse } from '@/app/_types/profile/UpdateEmail';
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

export const PUT = async (request: NextRequest) => {
  try {
    const { id, supabaseUserId } = await getCurrentUser(request);
    const { email }: EmailResponse = await request.json();

    const data = await prisma.profile.update({
      where: {
        id,
        supabaseUserId,
      },
      data: {
        email,
      },
    });
    return NextResponse.json(
      {
        id: data.id,
        message: 'メールアドレスが更新されました。',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
