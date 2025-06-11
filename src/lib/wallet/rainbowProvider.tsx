'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './wagmiConfig';

interface RainbowKitProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const RainbowKitProviders = ({ children }: RainbowKitProviderProps) => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider modalSize='compact'>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
