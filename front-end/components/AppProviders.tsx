"use client";

import React, { useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig as createWagmiConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { base, sepolia } from "viem/chains"; // Use Base and Sepolia
import { privyConfig } from "@/lib/privyConfig";
import { wagmiConfig } from "@/lib/WagmiConfig";

const queryClient = new QueryClient();

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log("AppProviders mounted — PrivyProvider should wrap children");
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID} // only if you set this up
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
