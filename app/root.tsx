import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import rainbowStylesUrl from "@rainbow-me/rainbowkit/styles.css";
import { Chain, useAccount, useDisconnect } from "wagmi";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
// import { useSetupWagmi } from "./hook/useSetupWagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: rainbowStylesUrl },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  // const { client, chains } = useSetupWagmi({
  //   appName: "RainbowKit Remix Example",
  //   alchemyId: "aS3KtbZgbWk3lrjhRqlYBadHUKEDfFRJ",
  //   // enablePublicTestnets: ENV.PUBLIC_ENABLE_TESTNETS,
  // });
  // const { chains, provider } = configureChains(
  //   [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  //   [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  // );

  const avalancheChain: Chain = {
    id: 97,
    name: "BSC Testnet",
    network: "BSC Testnet",
    // iconUrl: 'https://example.com/icon.svg',
    // iconBackground: '#fff',
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    },
    blockExplorers: {
      default: {
        name: "SnowTrace",
        url: "https://explorer.binance.org/smart-testnet",
      },
    },
    testnet: true,
  };
  const { chains, provider } = configureChains(
    [avalancheChain, chain.ropsten],
    [
      alchemyProvider({ apiKey: "aS3KtbZgbWk3lrjhRqlYBadHUKEDfFRJ" }),
      publicProvider(),
    ]
  );
  // const { connectors } = getDefaultWallets({
  //   appName: "My RainbowKit App",
  //   chains,
  // });

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        wallet.rainbow({ chains }),
        wallet.walletConnect({ chains }),
        wallet.trust({ chains }),

        wallet.metaMask({ chains, shimDisconnect: true }),
        wallet.coinbase({ appName: "My RainbowKit App", chains }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "12px",
              }}
            >
              {/* <Hello /> */}
              <ConnectButton />
            </div>
          </RainbowKitProvider>
          <Outlet />
        </WagmiConfig>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        {/* <ScrollRestoration />
        <Scripts />
        <LiveReload /> */}
      </body>
    </html>
  );
}
