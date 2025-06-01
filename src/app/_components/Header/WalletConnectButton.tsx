import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '../ui/button';

export const WalletConnectButton = () => {
  const shorten = (addr: `0x${string}`) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

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
            {shorten(account.address as `0x${string}`)}
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};
