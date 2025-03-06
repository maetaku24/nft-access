import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { getCurrentUser } from '../../_utils/getCurrentUser';
import { supabase } from '@/utils/supabase';
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/app/_types/profile/UpdateProfile';

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const profile = await getCurrentUser(request);
    const { name, walletAddress, iconKey }: UpdateProfileRequest =
      await request.json();

    const updateProfile = await prisma.profile.update({
      where: {
        id: parseInt(id),
        supabaseUserId: profile.supabaseUserId
      },
      data: {
        name: name,
        walletAddress: walletAddress ?? null,
        iconKey: iconKey ?? null,
      },
    });
    return NextResponse.json<UpdateProfileResponse>(
      { id: updateProfile.id, message: 'プロフィールが更新されました' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 404 });
    }
  }
};
