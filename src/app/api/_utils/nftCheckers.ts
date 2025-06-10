import type { Alchemy } from 'alchemy-sdk';

// ERC721
export const checkErc721 = async (
  alchemy: Alchemy,
  addr: string,
  nft: {
    contractAddress: string;
    minBalance: number;
    maxBalance: number | null;
  }
): Promise<boolean> => {
  try {
    const { totalCount } = await alchemy.nft.getNftsForOwner(addr, {
      contractAddresses: [nft.contractAddress],
    });

    // maxBalance が null または 0 の場合は上限なしとして扱う
    const hasMaxLimit = nft.maxBalance != null && nft.maxBalance > 0;
    const withinMaxLimit = hasMaxLimit ? totalCount <= nft.maxBalance! : true;
    const isValid = totalCount >= nft.minBalance && withinMaxLimit;

    return isValid;
  } catch (error) {
    console.error('ERC721チェックエラー:', error);
    return false;
  }
};

// ERC1155
export const checkErc1155 = async (
  alchemy: Alchemy,
  addr: string,
  nft: {
    contractAddress: string;
    tokenId: string;
    minBalance: number;
    maxBalance: number | null;
  }
): Promise<boolean> => {
  try {
    const res = await alchemy.nft.getNftsForOwner(addr, {
      contractAddresses: [nft.contractAddress],
    });

    // 対象tokenIdを検索
    const owned = res.ownedNfts.find(
      (n) =>
        n.tokenId === nft.tokenId ||
        n.tokenId === BigInt(nft.tokenId).toString(16) ||
        n.tokenId.toLowerCase() === nft.tokenId.toLowerCase()
    );

    const balance = Number(owned?.balance ?? 0);

    // maxBalanceがnullまたは0の場合は上限なしとして判定
    const hasMaxLimit = nft.maxBalance != null && nft.maxBalance > 0;
    const withinMaxLimit = hasMaxLimit ? balance <= nft.maxBalance! : true;
    const isValid = balance >= nft.minBalance && withinMaxLimit;

    return isValid;
  } catch (error) {
    console.error('ERC1155チェックエラー:', error);
    return false;
  }
};
