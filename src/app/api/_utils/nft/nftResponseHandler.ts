import { NextResponse } from 'next/server';
import { validateNftConditions } from './nftConditionValidator';
import type { EventWithNFTs } from '@/app/_types/nft/nftValidation';
import { prisma } from '@/utils/prisma';

/**
 * NFT条件をチェックして、適切なレスポンスを返す共通関数
 * @param eventNfts - イベントのNFT条件配列
 * @param walletAddress - チェック対象のウォレットアドレス
 * @returns 成功時はnull、失敗時はNextResponseを返す
 */
export const checkNftConditionsAndRespond = async (
  eventNfts: EventWithNFTs['eventNFTs'],
  walletAddress: string
): Promise<NextResponse | null> => {
  if (!eventNfts || eventNfts.length === 0) {
    // NFT条件がない場合は認証不要
    return null;
  }

  const validationResult = await validateNftConditions(
    eventNfts,
    walletAddress
  );

  if (!validationResult.isValid) {
    if (validationResult.failedCondition) {
      return NextResponse.json(
        {
          ok: false,
          status: 'エラー',
          message: `NFT条件を満たしていません。対象コレクション: ${validationResult.failedCondition.collectionName}`,
          reason: `NFT条件を満たしていません。対象コレクション: ${validationResult.failedCondition.collectionName}`,
        },
        { status: 403 }
      );
    } else if (validationResult.errorMessage) {
      return NextResponse.json(
        {
          ok: false,
          status: 'エラー',
          message: validationResult.errorMessage,
          reason: validationResult.errorMessage,
        },
        { status: 500 }
      );
    }
  }

  // すべての条件を満たした場合はnullを返す（処理継続）
  return null;
};

/**
 * イベントIDとウォレットアドレスから直接NFT認証を行う
 * @param eventId - イベントID
 * @param walletAddress - ウォレットアドレス
 * @returns 成功時はnull、失敗時はNextResponseを返す
 */
export const validateEventNftAccess = async (
  eventId: number,
  walletAddress: string
): Promise<NextResponse | null> => {
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
      {
        ok: false,
        status: 'エラー',
        message: '指定されたイベントが見つかりません',
        reason: 'イベントが見つかりません',
      },
      { status: 404 }
    );
  }

  return await checkNftConditionsAndRespond(event.eventNFTs, walletAddress);
};
