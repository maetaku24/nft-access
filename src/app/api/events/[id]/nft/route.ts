import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { handleError } from '@/app/api/_utils/handleError';
import { validateNftConditions } from '@/app/api/_utils/nftConditionValidator';
import { prisma } from '@/utils/prisma';

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

    // イベント情報とNFT条件を取得
    const event = await prisma.event.findUnique({
      where: { id: eventId, eventNFTs: { some: {} } },
      include: {
        eventNFTs: {
          include: {
            nft: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { ok: false, reason: 'イベントが見つかりません' },
        { status: 404 }
      );
    }

    // NFT条件チェック
    const validationResult = await validateNftConditions(event.eventNFTs, addr);

    if (!validationResult.isValid) {
      if (validationResult.failedCondition) {
        return NextResponse.json(
          {
            ok: false,
            reason: `NFT条件を満たしていません。対象コレクション: ${validationResult.failedCondition.collectionName}`,
          },
          { status: 403 }
        );
      } else if (validationResult.errorMessage) {
        return NextResponse.json(
          { ok: false, reason: validationResult.errorMessage },
          { status: 500 }
        );
      }
    }

    // すべての条件を満たした場合
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
