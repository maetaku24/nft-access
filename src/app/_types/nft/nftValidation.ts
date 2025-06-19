/**
 * NFT条件チェック・バリデーション関連の型定義
 */

export interface BaseNftConfig {
  contractAddress: string;
  minBalance: number;
  maxBalance: number | null;
}
//ERC721トークンのチェック設定
export type Erc721Config = BaseNftConfig;

//ERC1155トークンのチェック設定
export interface Erc1155Config extends BaseNftConfig {
  tokenId: string;
}

export interface NftCondition {
  nft: {
    collectionName: string;
    standard: string;
    network: string;
    contractAddress: string;
    tokenId: number | null;
    minBalance: number;
    maxBalance: number | null;
  };
}

// 単一のNFT条件チェック結果
export interface NftCheckResult {
  isEligible: boolean;
  collectionName: string;
}

// 複数のNFT条件をまとめて検証した結果
export interface NftValidationResult {
  isValid: boolean;
  failedCondition?: {
    collectionName: string;
  };
  errorMessage?: string;
}

/**
 * イベントのNFT条件を含む型定義
 * API処理で使用するイベント情報の型
 */
export interface EventWithNFTs {
  eventNFTs: Array<{
    nft: {
      collectionName: string;
      standard: string;
      network: string;
      contractAddress: string;
      tokenId: number | null;
      minBalance: number;
      maxBalance: number | null;
    };
  }>;
}
