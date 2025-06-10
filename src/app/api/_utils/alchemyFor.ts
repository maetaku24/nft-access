import { Alchemy, Network } from 'alchemy-sdk';

const NETWORK_MAP: Record<string, Network> = {
  ethereum: Network.ETH_MAINNET,
  polygon: Network.MATIC_MAINNET,
};

const cache = new Map<Network, Alchemy>();

export const alchemyFor = (netStr: string) => {
  const net = NETWORK_MAP[netStr];
  if (!net) throw new Error(`不明なネットワークです: ${netStr}`);

  if (!cache.has(net)) {
    const apiKey = process.env.ALCHEMY_API_KEY || process.env.ALCHEMY_KEY || '';

    if (!apiKey) {
      throw new Error('Alchemy API キーが必要です。');
    }

    cache.set(net, new Alchemy({ apiKey, network: net }));
  }
  return cache.get(net);
};
