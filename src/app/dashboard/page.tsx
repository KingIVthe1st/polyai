"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Brain,
  Users,
  AlertTriangle,
  RefreshCw,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Activity,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { MarketCard, FeaturedMarketCard } from "@/components/market";
import { Button, Skeleton, Badge } from "@/components/ui";
import { cn, formatCompact } from "@/lib/utils";
import type { Market } from "@/lib/polymarket/types";

// Mock data for demonstration - in production, this would come from the Polymarket API
const MOCK_MARKETS: Market[] = [
  {
    id: "1",
    question: "Will Donald Trump win the 2024 Presidential Election?",
    conditionId: "0x123",
    slug: "trump-2024",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.52", "0.48"],
    volume: "125000000",
    volume24hr: 2500000,
    liquidity: "8500000",
    endDate: new Date("2024-11-05").toISOString(),
    category: "Politics",
    change24h: 0.03,
    active: true,
    closed: false,
  },
  {
    id: "2",
    question: "Will Bitcoin reach $100k by end of 2024?",
    conditionId: "0x456",
    slug: "btc-100k-2024",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.68", "0.32"],
    volume: "45000000",
    volume24hr: 890000,
    liquidity: "3200000",
    endDate: new Date("2024-12-31").toISOString(),
    category: "Crypto",
    change24h: 0.05,
    active: true,
    closed: false,
  },
  {
    id: "3",
    question: "Will the Fed cut rates in December 2024?",
    conditionId: "0x789",
    slug: "fed-cut-dec-2024",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.72", "0.28"],
    volume: "28000000",
    volume24hr: 450000,
    liquidity: "2100000",
    endDate: new Date("2024-12-18").toISOString(),
    category: "Economics",
    change24h: -0.02,
    active: true,
    closed: false,
  },
  {
    id: "4",
    question: "Will SpaceX Starship reach orbit by Q1 2025?",
    conditionId: "0xabc",
    slug: "starship-orbit-q1",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.45", "0.55"],
    volume: "12000000",
    volume24hr: 320000,
    liquidity: "980000",
    endDate: new Date("2025-03-31").toISOString(),
    category: "Science",
    change24h: 0.08,
    active: true,
    closed: false,
  },
  {
    id: "5",
    question: "Will AI generate a #1 Billboard hit in 2025?",
    conditionId: "0xdef",
    slug: "ai-billboard-2025",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.23", "0.77"],
    volume: "8500000",
    volume24hr: 180000,
    liquidity: "620000",
    endDate: new Date("2025-12-31").toISOString(),
    category: "Entertainment",
    change24h: 0.01,
    active: true,
    closed: false,
  },
  {
    id: "6",
    question: "Will GPT-5 be released by June 2025?",
    conditionId: "0xghi",
    slug: "gpt5-june-2025",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.35", "0.65"],
    volume: "15000000",
    volume24hr: 420000,
    liquidity: "1100000",
    endDate: new Date("2025-06-30").toISOString(),
    category: "Technology",
    change24h: -0.04,
    active: true,
    closed: false,
  },
  {
    id: "7",
    question: "Will Ethereum hit $5000 before BTC halving?",
    conditionId: "0xjkl",
    slug: "eth-5k-halving",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.28", "0.72"],
    volume: "32000000",
    volume24hr: 780000,
    liquidity: "2400000",
    endDate: new Date("2024-04-15").toISOString(),
    category: "Crypto",
    change24h: 0.06,
    active: true,
    closed: false,
  },
  {
    id: "8",
    question: "Will Apple release a foldable iPhone in 2025?",
    conditionId: "0xmno",
    slug: "apple-foldable-2025",
    outcomes: ["Yes", "No"],
    outcomePrices: ["0.18", "0.82"],
    volume: "6200000",
    volume24hr: 95000,
    liquidity: "450000",
    endDate: new Date("2025-12-31").toISOString(),
    category: "Technology",
    change24h: 0.00,
    active: true,
    closed: false,
  },
];

// Stat card component
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  gradient,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  gradient: string;
}) {
  const isUp = change && change > 0;
  const isDown = change && change < 0;

  return (
    <motion.div
      className="relative rounded-xl p-4 md:p-5 bg-[var(--surface-2)] border border-[var(--border-default)] overflow-hidden group"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient background */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
          gradient
        )}
      />

      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-lg bg-[var(--surface-3)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-[var(--accent)]" />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                isUp && "bg-[var(--up-muted)] text-[var(--up)]",
                isDown && "bg-[var(--down-muted)] text-[var(--down)]",
                !isUp && !isDown && "bg-[var(--surface-3)] text-[var(--text-tertiary)]"
              )}
            >
              {isUp && <TrendingUp className="w-3 h-3" />}
              {isDown && <TrendingDown className="w-3 h-3" />}
              <span>
                {isUp ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tabular-nums">
            {value}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// AI Insight card component
function AIInsightCard({
  title,
  description,
  confidence,
  market,
  type,
}: {
  title: string;
  description: string;
  confidence: number;
  market: string;
  type: "bullish" | "bearish" | "neutral";
}) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-default)] space-y-3"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{market}</p>
          </div>
        </div>
        <Badge
          variant={type === "bullish" ? "success" : type === "bearish" ? "destructive" : "secondary"}
          size="sm"
        >
          {type === "bullish" ? "Bullish" : type === "bearish" ? "Bearish" : "Neutral"}
        </Badge>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
          <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          <span>AI Confidence: {confidence}%</span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
          View Details
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );
}

// Whale activity component
function WhaleActivity({
  wallet,
  action,
  market,
  amount,
  time,
}: {
  wallet: string;
  action: "buy" | "sell";
  market: string;
  amount: number;
  time: string;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-default)]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          action === "buy" ? "bg-[var(--up-muted)]" : "bg-[var(--down-muted)]"
        )}
      >
        <Users
          className={cn(
            "w-5 h-5",
            action === "buy" ? "text-[var(--up)]" : "text-[var(--down)]"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {wallet}
          </span>
          <Badge variant={action === "buy" ? "success" : "destructive"} size="sm">
            {action === "buy" ? "BUY" : "SELL"}
          </Badge>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate">{market}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
          ${formatCompact(amount)}
        </p>
        <p className="text-xs text-[var(--text-muted)]">{time}</p>
      </div>
    </motion.div>
  );
}

// View toggle component
function ViewToggle({
  view,
  setView,
}: {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border-default)]">
      <button
        onClick={() => setView("grid")}
        className={cn(
          "p-2 rounded-md transition-all",
          view === "grid"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        )}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setView("list")}
        className={cn(
          "p-2 rounded-md transition-all",
          view === "list"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [markets, setMarkets] = React.useState<Market[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Simulate loading markets
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMarkets(MOCK_MARKETS);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Get featured market (highest volume)
  const featuredMarket = markets.length > 0 ? markets[0] : null;
  const hotMarkets = markets.slice(1, 5);
  const trendingMarkets = markets.slice(5);

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              AI-powered market intelligence at your fingertips
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <ViewToggle view={view} setView={setView} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={DollarSign}
                label="Total Volume (24h)"
                value="$18.2M"
                change={12.5}
                gradient="bg-gradient-to-br from-[var(--up)] to-transparent"
              />
              <StatCard
                icon={Activity}
                label="Active Markets"
                value="1,247"
                change={3.2}
                gradient="bg-gradient-to-br from-[var(--accent)] to-transparent"
              />
              <StatCard
                icon={Eye}
                label="Markets Watched"
                value="24"
                gradient="bg-gradient-to-br from-[var(--hot)] to-transparent"
              />
              <StatCard
                icon={AlertTriangle}
                label="AI Alerts"
                value="7"
                change={-15}
                gradient="bg-gradient-to-br from-[var(--warning)] to-transparent"
              />
            </>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Featured + Hot Markets (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Market */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[var(--accent)]" />
                  Featured Market
                </h2>
              </div>

              {isLoading ? (
                <Skeleton className="h-72 rounded-2xl" />
              ) : featuredMarket ? (
                <FeaturedMarketCard market={featuredMarket} />
              ) : null}
            </div>

            {/* Hot Markets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--up)]" />
                  Hot Markets
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : (
                <motion.div
                  className={cn(
                    view === "grid"
                      ? "grid sm:grid-cols-2 gap-4"
                      : "space-y-3"
                  )}
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {hotMarkets.map((market) => (
                      <MarketCard key={market.id} market={market} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Trending Markets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[var(--hot)]" />
                  Trending Now
                </h2>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {trendingMarkets.map((market) => (
                      <MarketCard key={market.id} market={market} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar widgets (1/3) */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[var(--accent)]" />
                  AI Insights
                </h2>
                <Badge variant="default" size="sm" className="animate-pulse">
                  Live
                </Badge>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <AIInsightCard
                    title="Mispriced Opportunity"
                    description="AI analysis suggests BTC $100k market is underpriced. Current sentiment indicators and on-chain metrics show 15% edge potential."
                    confidence={87}
                    market="Bitcoin $100k by 2024"
                    type="bullish"
                  />
                  <AIInsightCard
                    title="Resolution Risk"
                    description="Oracle ambiguity detected. Resolution criteria may lead to dispute. Consider reducing exposure."
                    confidence={72}
                    market="Apple Foldable 2025"
                    type="bearish"
                  />
                  <AIInsightCard
                    title="Smart Money Moving"
                    description="3 wallets with >80% win rate just entered positions. Volume spike of 340% in last hour."
                    confidence={91}
                    market="Fed Rate Cut Dec"
                    type="bullish"
                  />
                </div>
              )}
            </div>

            {/* Whale Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--up)]" />
                  Whale Activity
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <WhaleActivity
                    wallet="0x8f23...c4d2"
                    action="buy"
                    market="Trump 2024"
                    amount={125000}
                    time="2m ago"
                  />
                  <WhaleActivity
                    wallet="0xab12...9e8f"
                    action="sell"
                    market="BTC $100k"
                    amount={89000}
                    time="5m ago"
                  />
                  <WhaleActivity
                    wallet="0x3c45...a7b1"
                    action="buy"
                    market="Fed Rate Cut"
                    amount={250000}
                    time="12m ago"
                  />
                  <WhaleActivity
                    wallet="0xd6e7...2f3c"
                    action="buy"
                    market="Starship Orbit"
                    amount={67000}
                    time="18m ago"
                  />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] border border-[var(--border-default)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Brain className="w-4 h-4 text-[var(--accent)]" />
                  Run AI Analysis
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                  Set Price Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Users className="w-4 h-4 text-[var(--up)]" />
                  Track Wallet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
