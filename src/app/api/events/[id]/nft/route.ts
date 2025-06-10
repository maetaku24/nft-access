import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { alchemyFor } from '@/app/api/_utils/alchemyFor';
import { handleError } from '@/app/api/_utils/handleError';
import { checkErc721, checkErc1155 } from '@/app/api/_utils/nftCheckers';
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
      where: { id: eventId },
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

    if (event.eventNFTs.length === 0) {
      return NextResponse.json(
        { ok: false, reason: 'このイベントにはNFT条件が設定されていません' },
        { status: 404 }
      );
    }

    // すべてのNFT条件をチェック（AND条件）
    for (const { nft } of event.eventNFTs) {
      // ネットワークに応じたAlchemyインスタンスを取得
      const alchemy = alchemyFor(nft.network.toLowerCase());
      if (!alchemy) {
        return NextResponse.json(
          {
            ok: false,
            reason: `サポートされていないネットワーク: ${nft.network}`,
          },
          { status: 400 }
        );
      }

      let isEligible = false;

      if (nft.standard === 'ERC721') {
        isEligible = await checkErc721(alchemy, addr, {
          contractAddress: nft.contractAddress,
          minBalance: nft.minBalance,
          maxBalance: nft.maxBalance,
        });
      } else if (nft.standard === 'ERC1155') {
        // ERC1155の場合、TokenIDが必須
        if (!nft.tokenId && nft.tokenId !== 0) {
          return NextResponse.json(
            {
              ok: false,
              reason: `ERC1155コレクション「${nft.collectionName}」にTokenIDが設定されていません`,
            },
            { status: 400 }
          );
        }

        isEligible = await checkErc1155(alchemy, addr, {
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId.toString(),
          minBalance: nft.minBalance,
          maxBalance: nft.maxBalance,
        });
      } else {
        return NextResponse.json(
          { ok: false, reason: `サポートされていないNFT標準: ${nft.standard}` },
          { status: 400 }
        );
      }

      // 1つでも条件を満たさない場合は失敗
      if (!isEligible) {
        return NextResponse.json(
          {
            ok: false,
            reason: `NFT条件を満たしていません。対象コレクション: ${nft.collectionName}`,
          },
          { status: 403 }
        );
      }
    }

    // すべての条件を満たした場合
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
