import { NextResponse } from 'next/server';
import { validateNftConditions } from './nftConditionValidator';
import type { EventWithNFTs } from '@/app/_types/nft/nftValidation';
import { prisma } from '@/utils/prisma';

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

  if (validationResult.isValid) return null;

  // 特定の条件で失敗した場合
  if (
    validationResult.failedConditions &&
    validationResult.failedConditions.length > 0
  ) {
    const collectionNames = validationResult.failedConditions
      .map((condition) => condition.collectionName)
      .join(', ');

    return NextResponse.json(
      {
        ok: false,
        status: 'エラー',
        message: `NFT条件を満たしていません。対象コレクション: ${collectionNames}`,
        reason: `NFT条件を満たしていません。対象コレクション: ${collectionNames}`,
      },
      { status: 403 }
    );
  }

  // システムエラーの場合
  if (validationResult.errorMessage) {
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

  return NextResponse.json(
    {
      ok: false,
      status: 'エラー',
      message: '予期しないエラーが発生しました',
      reason: '予期しないエラーが発生しました',
    },
    { status: 500 }
  );
};

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
