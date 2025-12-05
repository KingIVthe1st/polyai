/**
 * Polymarket API Types
 * Based on Gamma API and CLOB API documentation
 */

// Market Types
export interface Market {
  id: string;
  question: string;
  description: string;
  slug: string;
  conditionId: string;

  // Market state
  active: boolean;
  closed: boolean;
  archived: boolean;

  // Tokens
  clobTokenIds: string[];
  outcomes: string[];
  outcomePrices: string[];

  // Volume and liquidity
  volume: string;
  volume24hr: number;
  liquidity: string;

  // Timing
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;

  // Resolution
  resolutionSource: string;
  enableOrderBook: boolean;

  // Categories
  tags: Tag[];

  // Metadata
  image: string;
  icon: string;

  // Computed fields (added by us)
  yesPrice?: number;
  noPrice?: number;
  change24h?: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;

  // Related markets
  markets: Market[];

  // Categories
  tags: Tag[];

  // Metadata
  volume: string;
  liquidity: string;
  commentCount: number;
}

export interface Tag {
  id: string;
  slug: string;
  label: string;
  description?: string;
}

// Order Book Types
export interface OrderBook {
  market: string;
  assetId: string;
  hash: string;
  timestamp: number;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface Trade {
  id: string;
  taker_order_id: string;
  market: string;
  asset_id: string;
  side: "BUY" | "SELL";
  price: string;
  size: string;
  fee_rate_bps: string;
  status: "MATCHED" | "MINED" | "CONFIRMED";
  match_time: string;
  last_update: string;
  outcome: string;
  bucket_index: number;
  owner: string;
  transaction_hash?: string;
}

// Price History
export interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface PriceHistory {
  history: PricePoint[];
}

// Wallet/Trader Analysis
export interface TraderStats {
  address: string;
  totalTrades: number;
  winRate: number;
  totalVolume: number;
  totalPnL: number;
  avgPositionSize: number;
  favoriteMarkets: string[];
  recentActivity: Trade[];
}

// API Response Types
export interface MarketsResponse {
  data: Market[];
  next_cursor?: string;
}

export interface EventsResponse {
  data: Event[];
  next_cursor?: string;
}

// Search Types
export interface SearchResult {
  markets: Market[];
  events: Event[];
}

// Filter Types
export interface MarketFilters {
  active?: boolean;
  closed?: boolean;
  tags?: string[];
  minVolume?: number;
  maxVolume?: number;
  minLiquidity?: number;
  sortBy?: "volume" | "liquidity" | "newest" | "ending_soon";
  sortOrder?: "asc" | "desc";
  limit?: number;
  cursor?: string;
}

// WebSocket Message Types
export interface WSMessage {
  event: "price_change" | "trade" | "book_update" | "market_update";
  market_id: string;
  data: unknown;
}

export interface PriceChangeMessage {
  market_id: string;
  asset_id: string;
  price: string;
  timestamp: number;
}

export interface BookUpdateMessage {
  market_id: string;
  asset_id: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  timestamp: number;
}

// AI Analysis Types (for our platform)
export interface AIAnalysis {
  marketId: string;
  aiProbability: number;
  marketProbability: number;
  edge: number;
  confidence: "low" | "medium" | "high";
  reasoning: string;
  sources: string[];
  updatedAt: string;
}

export interface SmartMoneySignal {
  marketId: string;
  walletAddress: string;
  action: "buy" | "sell";
  side: "yes" | "no";
  size: number;
  walletWinRate: number;
  walletTotalTrades: number;
  timestamp: string;
}

export interface NewsCorrelation {
  marketId: string;
  newsItem: {
    title: string;
    source: string;
    url: string;
    timestamp: string;
  };
  sentiment: "positive" | "negative" | "neutral";
  priceImpact: number;
  relevanceScore: number;
}
