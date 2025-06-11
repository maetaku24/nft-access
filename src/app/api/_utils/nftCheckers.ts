import type { Alchemy } from 'alchemy-sdk';

const UNLIMITED_BALANCE = 0;
const MIN_OWNED_COUNT = 0;

interface BaseNftConfig {
  contractAddress: string;
  minBalance: number;
  maxBalance: number | null;
}

type Erc721Config = BaseNftConfig;

interface Erc1155Config extends BaseNftConfig {
  tokenId: string;
}

// ERC721
export const checkErc721 = async (
  alchemy: Alchemy,
  addr: string,
  nft: Erc721Config
): Promise<boolean> => {
  try {
    const { totalCount } = await alchemy.nft.getNftsForOwner(addr, {
      contractAddresses: [nft.contractAddress],
    });

    // maxBalance が null または UNLIMITED_BALANCE の場合は上限なしとして扱う
    const hasMaxLimit =
      nft.maxBalance != null && nft.maxBalance > UNLIMITED_BALANCE;
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
  nft: Erc1155Config
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

    const balance = Number(owned?.balance ?? MIN_OWNED_COUNT);

    // maxBalance が null または UNLIMITED_BALANCE の場合は上限なしとして扱う
    const hasMaxLimit =
      nft.maxBalance != null && nft.maxBalance > UNLIMITED_BALANCE;
    const withinMaxLimit = hasMaxLimit ? balance <= nft.maxBalance! : true;
    const isValid = balance >= nft.minBalance && withinMaxLimit;

    return isValid;
  } catch (error) {
    console.error('ERC1155チェックエラー:', error);
    return false;
  }
};
