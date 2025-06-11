import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { Address } from 'viem';
import { Button } from '../ui/button';

export const WalletConnectButton = () => {
  const shorten = (addr: Address) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <ConnectButton.Custom>
      {({ account, openAccountModal, openConnectModal, mounted }) => {
        if (!mounted) return null;
        if (!account) {
          return (
            <Button onClick={openConnectModal} type='button'>
              ウォレット接続
            </Button>
          );
        }
        return (
          <Button onClick={openAccountModal} type='button'>
            {shorten(account.address as Address)}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};
