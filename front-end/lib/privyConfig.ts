import type { PrivyClientConfig } from "@privy-io/react-auth";
import { base, baseSepolia } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["google", "github"],  // or whatever you use
  appearance: {
    theme: "light",
    accentColor: "#676FFF",
  },
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  // Set Base Sepolia as default chain
  defaultChain: baseSepolia,
  supportedChains: [base, baseSepolia],
};
