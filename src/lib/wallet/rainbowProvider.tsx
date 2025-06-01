'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './wagmiConfig';

const queryClient = new QueryClient();

export const RainbowKitProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider modalSize='compact'>{children}</RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
