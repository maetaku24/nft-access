import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { supabase } from '@/utils/spabase';
import { profileSchema } from '@/app/_schemas/profileSchema';

const prisma = new PrismaClient();

// POSTリクエスト
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // safeParseで常にオブジェクトを返す（エラーをスローしない）
    const validation = profileSchema.safeParse(body);

    // もしバリデーションが成功しなければエラーを返す
    if (!validation.success) {
      return NextResponse.json(
        { status: 'バリデーションエラー', error: validation.error.format() },
        { status: 400 }
      );
    }

    // validationの中身をvalidationDataへ格納
    const validationData = validation.data;

    // validationDataからsupabaseUserId, name, email, walletAddress, iconKeyを取り出す
    const { supabaseUserId, name, email, walletAddress, iconKey } =
      validationData;

    // profileをDBに生成
    const data = await prisma.profile.create({
      data: {
        supabaseUserId,
        name: name || null,
        email,
        walletAddress: walletAddress || null,
        iconKey: iconKey || null,
      },
    });
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
