import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { avatarUrlFromKey } from '../_utils/avatarUrlFromKey';
import { getCurrentUser } from '../_utils/getCurrentUser';
import type {
  CreateProfileRequest,
  CreateProfileResponse,
} from '@/app/_types/profile/CreateProfile';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/app/_types/profile/UpdateProfile';
import { handleError } from '@/app/api/_utils/handleError';
import { prisma } from '@/utils/prisma';

export const GET = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);
    const data = await prisma.profile.findUnique({
      where: {
        id: profile.id,
      },
      select: {
        userId: true,
        name: true,
        walletAddress: true,
        iconKey: true,
      },
    });

    if (!data) {
      return NextResponse.json(
        { status: 'エラー', message: 'プロフィールが見つかりません' },
        { status: 404 }
      );
    }

    const iconUrl = avatarUrlFromKey(data.iconKey);

    return NextResponse.json({ ...data, iconUrl }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { supabaseUserId, userId, email }: CreateProfileRequest =
      await request.json();

    // profileをDBに生成
    const data = await prisma.profile.create({
      data: {
        supabaseUserId,
        userId,
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

export const PUT = async (request: NextRequest) => {
  try {
    const profile = await getCurrentUser(request);
    const { userId, name, walletAddress, iconKey }: UpdateProfileRequest =
      await request.json();

    const data = await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        userId,
        name: name ?? null,
        walletAddress: walletAddress ?? null,
        iconKey: iconKey ?? null,
      },
    });

    return NextResponse.json<UpdateProfileResponse>(
      { id: data.id, message: 'プロフィールを更新しました' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
};
