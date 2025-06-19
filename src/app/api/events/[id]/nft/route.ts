import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { handleError } from '@/app/api/_utils/handleError';
import { validateEventNftAccess } from '@/app/api/_utils/nft';

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const eventId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const addr = searchParams.get('addr')?.toLowerCase();

    if (!addr) {
      return NextResponse.json(
        { ok: false, reason: 'ウォレットアドレスが指定されていません' },
        { status: 400 }
      );
    }

    // NFT認証チェック
    const nftValidationError = await validateEventNftAccess(eventId, addr);
    if (nftValidationError) {
      return nftValidationError;
    }

    // すべての条件を満たした場合
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
