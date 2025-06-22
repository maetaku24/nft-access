import { alchemyFor } from './alchemyFor';
import { checkErc721, checkErc1155 } from './nftCheckers';
import type {
  NftCondition,
  NftCheckResult,
  NftValidationResult,
} from '@/app/_types/nft/nftValidation';

//単一のNFT条件をチェックする
export const checkSingleNftCondition = async (
  eventNft: NftCondition,
  walletAddress: string
): Promise<NftCheckResult> => {
  const { nft } = eventNft;

  // ネットワークに応じたAlchemyインスタンスを取得
  const alchemy = alchemyFor(nft.network.toLowerCase());
  if (!alchemy) {
    throw new Error(`サポートされていないネットワーク: ${nft.network}`);
  }

  let isEligible = false;

  if (nft.standard === 'ERC721') {
    isEligible = await checkErc721(alchemy, walletAddress, {
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

    isEligible = await checkErc1155(alchemy, walletAddress, {
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

//複数のNFT条件をチェックし、すべての条件を満たしているかを検証する
export const validateNftConditions = async (
  eventNfts: NftCondition[],
  walletAddress: string
): Promise<NftValidationResult> => {
  try {
    const results = await Promise.all(
      eventNfts.map((eventNft) =>
        checkSingleNftCondition(eventNft, walletAddress)
      )
    );

    // 失敗した条件をすべて取得
    const failedConditions = results
      .filter((result) => !result.isEligible)
      .map((result) => ({
        collectionName: result.collectionName,
      }));

    // 1つでも条件を満たさない場合は失敗
    if (failedConditions.length > 0) {
      return {
        isValid: false,
        failedConditions,
      };
    }

    return {
      isValid: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'NFT条件チェック中にエラーが発生しました';

    return {
      isValid: false,
      errorMessage,
    };
  }
};
