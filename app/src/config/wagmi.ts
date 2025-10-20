import { http, createConfig, createStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';

// In-memory storage to avoid localStorage usage
const memoryStorage = createStorage({
  storage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
});

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'FHE Purchase Demo',
    projectId: 'fhe-purchase-demo',
  }
);

export const config = createConfig({
  chains: [sepolia],
  ssr: false,
  connectors,
  storage: memoryStorage,
  transports: {
    [sepolia.id]: http(),
  },
});
