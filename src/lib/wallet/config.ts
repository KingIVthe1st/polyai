/**
 * Wallet Configuration for Polymarket Trading
 * Phase 2: Enable direct trading through wallet connection
 */

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon, polygonAmoy } from "wagmi/chains";

// Custom Polygon chain config for Polymarket
const polymarketChain = {
  ...polygon,
  name: "Polygon (Polymarket)",
};

export const walletConfig = getDefaultConfig({
  appName: "PolyAI",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo",
  chains: [polymarketChain, polygonAmoy],
  ssr: true,
});

// Polymarket contract addresses
export const POLYMARKET_CONTRACTS = {
  // Main exchange contract
  CTF_EXCHANGE: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
  // Conditional Tokens Framework
  CONDITIONAL_TOKENS: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045",
  // USDC on Polygon
  USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  // Neg Risk adapter
  NEG_RISK_CTF_EXCHANGE: "0xC5d563A36AE78145C45a50134d48A1215220f80a",
  NEG_RISK_ADAPTER: "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296",
} as const;

// Allowance amounts for trading
export const TRADING_CONFIG = {
  DEFAULT_SLIPPAGE: 0.01, // 1%
  MAX_SLIPPAGE: 0.05, // 5%
  GAS_BUFFER: 1.2, // 20% gas buffer
  APPROVAL_AMOUNT: BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), // Max approval
} as const;
