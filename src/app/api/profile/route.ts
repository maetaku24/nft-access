import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../_utils/getCurrentUser';
import { prisma } from '@/utils/prisma';
import { handleError } from '@/app/api/_utils/handleError';
import {
  CreateProfileRequest,
  CreateProfileResponse,
} from '@/app/_types/profile/CreateProfile';

export const GET = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);
    const data = await prisma.profile.findUnique({
      where: {
        id: profile.id,
      },
    });

    if (!data) {
      return NextResponse.json(
        { status: 'エラー', message: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const { supabaseUserId, name, email }: CreateProfileRequest =
      await request.json();

    // profileをDBに生成
    const data = await prisma.profile.create({
      data: {
        supabaseUserId,
        name,
        email,
      },
    });
    return NextResponse.json<CreateProfileResponse>(
      {
        id: data.id,
        message: 'プロフィールが作成されました',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
