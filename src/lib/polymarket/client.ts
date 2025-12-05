/**
 * Polymarket API Client
 * Connects to Gamma API and CLOB API
 */

import type {
  Market,
  Event,
  Tag,
  OrderBook,
  Trade,
  MarketFilters,
  MarketsResponse,
  EventsResponse,
  SearchResult,
} from "./types";

// Use proxy in production to avoid CORS issues
const IS_BROWSER = typeof window !== "undefined";
const USE_PROXY = IS_BROWSER;
const GAMMA_API_URL = USE_PROXY ? "/api/polymarket" : "https://gamma-api.polymarket.com";
const CLOB_API_URL = "https://clob.polymarket.com";

class PolymarketAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "PolymarketAPIError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${baseUrl}${path}`;
  const { method = "GET", body, headers = {}, cache, next } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache,
    next,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new PolymarketAPIError(
        `API request failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof PolymarketAPIError) {
      throw error;
    }
    throw new PolymarketAPIError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Gamma API Client - Read-only market data
 */
export const gammaApi = {
  /**
   * Get all markets with optional filters
   */
  async getMarkets(filters?: MarketFilters): Promise<Market[]> {
    const params = new URLSearchParams();

    if (filters?.active !== undefined) params.set("active", String(filters.active));
    if (filters?.closed !== undefined) params.set("closed", String(filters.closed));
    if (filters?.limit) params.set("limit", String(filters.limit));
    if (filters?.cursor) params.set("next_cursor", filters.cursor);

    const query = params.toString();
    const path = `/markets${query ? `?${query}` : ""}`;

    const response = await request<Market[] | MarketsResponse>(GAMMA_API_URL, path, {
      cache: "no-store",
      next: { revalidate: 30 },
    });

    // Handle both array and object response formats
    return Array.isArray(response) ? response : response.data;
  },

  /**
   * Get a single market by ID
   */
  async getMarket(id: string): Promise<Market> {
    return request<Market>(GAMMA_API_URL, `/markets/${id}`, {
      next: { revalidate: 30, tags: [`market-${id}`] },
    });
  },

  /**
   * Get market by slug
   */
  async getMarketBySlug(slug: string): Promise<Market> {
    return request<Market>(GAMMA_API_URL, `/markets/slug/${slug}`, {
      next: { revalidate: 30 },
    });
  },

  /**
   * Get all events
   */
  async getEvents(limit?: number): Promise<Event[]> {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));

    const query = params.toString();
    const path = `/events${query ? `?${query}` : ""}`;

    const response = await request<Event[] | EventsResponse>(GAMMA_API_URL, path, {
      next: { revalidate: 60 },
    });

    return Array.isArray(response) ? response : response.data;
  },

  /**
   * Get a single event by ID
   */
  async getEvent(id: string): Promise<Event> {
    return request<Event>(GAMMA_API_URL, `/events/${id}`, {
      next: { revalidate: 60, tags: [`event-${id}`] },
    });
  },

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    return request<Tag[]>(GAMMA_API_URL, "/tags", {
      next: { revalidate: 3600 },
    });
  },

  /**
   * Search markets and events
   */
  async search(query: string): Promise<SearchResult> {
    const params = new URLSearchParams({ q: query });
    return request<SearchResult>(GAMMA_API_URL, `/public-search?${params}`, {
      cache: "no-store",
    });
  },
};

/**
 * CLOB API Client - Order book and trading data
 */
export const clobApi = {
  /**
   * Get order book for a market
   */
  async getOrderBook(tokenId: string): Promise<OrderBook> {
    return request<OrderBook>(CLOB_API_URL, `/book?token_id=${tokenId}`, {
      cache: "no-store",
    });
  },

  /**
   * Get midpoint price for a token
   */
  async getMidpoint(tokenId: string): Promise<{ mid: string }> {
    return request<{ mid: string }>(CLOB_API_URL, `/midpoint?token_id=${tokenId}`, {
      cache: "no-store",
    });
  },

  /**
   * Get last trade price
   */
  async getLastTradePrice(tokenId: string): Promise<{ price: string }> {
    return request<{ price: string }>(
      CLOB_API_URL,
      `/last-trade-price?token_id=${tokenId}`,
      { cache: "no-store" }
    );
  },

  /**
   * Get recent trades for a market
   */
  async getTrades(tokenId: string, limit?: number): Promise<Trade[]> {
    const params = new URLSearchParams({ token_id: tokenId });
    if (limit) params.set("limit", String(limit));

    return request<Trade[]>(CLOB_API_URL, `/trades?${params}`, {
      cache: "no-store",
    });
  },

  /**
   * Get server time (for sync)
   */
  async getServerTime(): Promise<{ timestamp: number }> {
    return request<{ timestamp: number }>(CLOB_API_URL, "/time");
  },
};

/**
 * Helper to parse JSON strings that the API returns
 */
function parseJsonField<T>(value: string | T[] | undefined): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

/**
 * Normalize market data from API response
 */
function normalizeMarket(market: Market): Market {
  const outcomes = parseJsonField<string>(market.outcomes);
  const outcomePrices = parseJsonField<string>(market.outcomePrices);

  return {
    ...market,
    outcomes,
    outcomePrices,
    // Parse prices into numbers for convenience
    yesPrice: outcomePrices[0] ? parseFloat(outcomePrices[0]) : undefined,
    noPrice: outcomePrices[1] ? parseFloat(outcomePrices[1]) : undefined,
  };
}

/**
 * Filter for valid, active markets
 */
function isValidActiveMarket(market: Market): boolean {
  // Must be active and not closed
  if (!market.active || market.closed) return false;
  // Must have some activity
  if ((market.volume24hr ?? 0) === 0 && (market.liquidityNum ?? 0) === 0) return false;
  return true;
}

/**
 * Combined Polymarket client with helper methods
 */
export const polymarket = {
  gamma: gammaApi,
  clob: clobApi,

  /**
   * Get market with enriched price data
   */
  async getEnrichedMarket(id: string): Promise<Market & { yesPrice: number; noPrice: number }> {
    const market = await gammaApi.getMarket(id);
    const normalized = normalizeMarket(market);

    return {
      ...normalized,
      yesPrice: normalized.yesPrice ?? 0,
      noPrice: normalized.noPrice ?? 0,
    };
  },

  /**
   * Get trending markets (highest 24h volume)
   */
  async getTrendingMarkets(limit: number = 10): Promise<Market[]> {
    const markets = await gammaApi.getMarkets({ active: true, closed: false, limit: 200 });

    return markets
      .map(normalizeMarket)
      .filter(isValidActiveMarket)
      .sort((a, b) => (b.volume24hr ?? 0) - (a.volume24hr ?? 0))
      .slice(0, limit);
  },

  /**
   * Get markets ending soon
   */
  async getEndingSoonMarkets(limit: number = 10): Promise<Market[]> {
    const markets = await gammaApi.getMarkets({ active: true, closed: false, limit: 200 });
    const now = new Date();

    return markets
      .map(normalizeMarket)
      .filter(isValidActiveMarket)
      .filter((m) => m.endDate && new Date(m.endDate) > now)
      .sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
      .slice(0, limit);
  },

  /**
   * Get hot markets (high volume + recent activity)
   */
  async getHotMarkets(limit: number = 10): Promise<Market[]> {
    const markets = await gammaApi.getMarkets({ active: true, closed: false, limit: 200 });

    // Score based on volume, liquidity, and recency
    const scored = markets
      .map(normalizeMarket)
      .filter(isValidActiveMarket)
      .map((market) => {
        const volumeScore = Math.log10((market.volume24hr ?? 0) + 1);
        const liquidityScore = Math.log10((market.liquidityNum ?? parseFloat(market.liquidity || "0")) + 1);
        const score = volumeScore * 0.6 + liquidityScore * 0.4;

        return { market, score };
      });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.market);
  },
};

export { PolymarketAPIError };
export default polymarket;
