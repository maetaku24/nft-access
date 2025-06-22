import { Alchemy, Network } from 'alchemy-sdk';

// as constで読み取り専用オブジェクトとして定義
const NETWORK_MAP = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
} as const;

// サポートされるネットワーク名の型を生成（'ethereum' | 'polygon'）
type SupportedNetwork = keyof typeof NETWORK_MAP;

const cache = new Map<Network, Alchemy>();

export const alchemyFor = (netStr: string) => {
  // サポートされていないネットワークの場合はエラー
  if (!(netStr in NETWORK_MAP)) {
    throw new Error(`不明なネットワークです: ${netStr}`);
  }
  // 型安全なキャストでネットワークを取得
  const net = NETWORK_MAP[netStr as SupportedNetwork];

  // キャッシュにAlchemyインスタンスが存在しない場合は作成
  if (!cache.has(net)) {
    const apiKey = process.env.ALCHEMY_API_KEY || process.env.ALCHEMY_KEY || '';

    if (!apiKey) {
      throw new Error('Alchemy API キーが必要です。');
    }
    // 新しいAlchemyインスタンスを作成してキャッシュに保存
    cache.set(net, new Alchemy({ apiKey, network: net }));
  }

  // キャッシュからインスタンスを取得
  return cache.get(net);
};
