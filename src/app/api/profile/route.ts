import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import prisma from '@/utils/prisma';
import { CreateProfileRequest, CreateProfileResponse } from '@/app/_types/profile/CreateProfile';

export const GET = async (request: NextRequest) => {
  const token = request.headers.get('Authorization') ?? '';
  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  const supabaseUserId = data.user?.id;

  try {
    const data = await prisma.profile.findUnique({
      where: {
        supabaseUserId,
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
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
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
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
