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

    // NFT条件チェック関数
    const checkNftCondition = async (eventNft: (typeof event.eventNFTs)[0]) => {
      const { nft } = eventNft;

      // ネットワークに応じたAlchemyインスタンスを取得
      const alchemy = alchemyFor(nft.network.toLowerCase());
      if (!alchemy) {
        throw new Error(`サポートされていないネットワーク: ${nft.network}`);
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
          throw new Error(
            `ERC1155コレクション「${nft.collectionName}」にTokenIDが設定されていません`
          );
        }

        isEligible = await checkErc1155(alchemy, addr, {
          contractAddress: nft.contractAddress,
          tokenId: nft.tokenId.toString(),
          minBalance: nft.minBalance,
          maxBalance: nft.maxBalance,
        });
      } else {
        throw new Error(`サポートされていないNFT標準: ${nft.standard}`);
      }

      return {
        isEligible,
        collectionName: nft.collectionName,
      };
    };

    try {
      const results = await Promise.all(event.eventNFTs.map(checkNftCondition));

      // 1つでも条件を満たさない場合は失敗
      const failedCondition = results.find((result) => !result.isEligible);
      if (failedCondition) {
        return NextResponse.json(
          {
            ok: false,
            reason: `NFT条件を満たしていません。対象コレクション: ${failedCondition.collectionName}`,
          },
          { status: 403 }
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'NFT条件チェック中にエラーが発生しました';
      return NextResponse.json(
        { ok: false, reason: errorMessage },
        { status: 400 }
      );
    }

    // すべての条件を満たした場合
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
};
