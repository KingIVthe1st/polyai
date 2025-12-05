"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { walletConfig } from "@/lib/wallet/config";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

// Custom RainbowKit theme matching our Cyberpunk Institutional design
const customDarkTheme = darkTheme({
  accentColor: "#8B5CF6",
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
});

// Override specific colors
const polyAITheme = {
  ...customDarkTheme,
  colors: {
    ...customDarkTheme.colors,
    modalBackground: "#121214",
    modalBorder: "#27272A",
    modalText: "#FAFAFA",
    modalTextSecondary: "#A1A1AA",
    profileForeground: "#09090B",
    connectButtonBackground: "#121214",
    connectButtonBackgroundError: "#FB7185",
    connectButtonInnerBackground: "#18181B",
    connectButtonText: "#FAFAFA",
    connectButtonTextError: "#FAFAFA",
  },
};

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={polyAITheme}
          modalSize="compact"
          appInfo={{
            appName: "PolyAI",
            learnMoreUrl: "https://polyai.app/learn",
          }}
        >
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
