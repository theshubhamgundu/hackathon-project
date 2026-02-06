'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/ui/stats-card';
import { useMarketData, formatINR, formatPrice } from '@/hooks/useMarketData';
import {
    Activity,
    User,
    LogOut,
    Shield,
    TrendingUp,
    TrendingDown,
    Wallet,
    Zap as ZapIcon,
    ArrowRight,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    BarChart3,
    Bell,
    Settings,
    ChevronRight,
    RefreshCw,
    IndianRupee,
    Clock,
    AlertCircle
} from 'lucide-react';

// Dynamic import for the chart to avoid SSR issues
const TradingChart = dynamic(() => import('@/components/ui/TradingChart'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[350px]">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    ),
});

export default function DashboardPage() {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState('pending');
    const [userEmail, setUserEmail] = useState('');

    const {
        prices,
        chartData,
        loading: marketLoading,
        chartLoading,
        error,
        lastUpdated,
        selectedStock,
        setSelectedStock,
        refetch,
        niftyData,
        marketState,
        timeRange,
        setTimeRange
    } = useMarketData();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        setUserEmail(email || 'user@zapfinance.com');

        setTimeout(() => {
            setPageLoading(false);
            setKycStatus('pending');
        }, 500);
    }, [router]);

    if (pageLoading) {
        return (
            <main className="min-h-screen bg-premium flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium text-sm">Loading your dashboard...</p>
                </div>
            </main>
        );
    }

    const ZapLogo = () => (
        <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 blur-lg rounded-full group-hover:from-primary/50 transition-all" />
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary relative z-10 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-foreground">ZAP Finance</span>
            </div>
        </div>
    );

    const getUserDisplayName = () => {
        if (userEmail.includes('admin')) return 'Administrator';
        if (userEmail.includes('user')) return 'Demo User';
        return userEmail.split('@')[0];
    };

    // Get the selected stock's data
    const selectedStockData = prices.find(p => p.id === selectedStock);

    // Get market status display
    const getMarketStatusBadge = () => {
        if (marketState === 'REGULAR') {
            return <Badge className="bg-emerald-500/20 text-emerald-500 border-none">Market Open</Badge>;
        } else if (marketState === 'CLOSED' || marketState === 'POST') {
            return <Badge className="bg-red-500/20 text-red-500 border-none">Market Closed</Badge>;
        } else if (marketState === 'PRE') {
            return <Badge className="bg-amber-500/20 text-amber-500 border-none">Pre-Market</Badge>;
        }
        return <Badge className="bg-white/10 text-muted-foreground border-none">Loading...</Badge>;
    };

    const timeRangeOptions = [
        { value: '1d', label: '1D' },
        { value: '5d', label: '5D' },
        { value: '1mo', label: '1M' },
    ];

    return (
        <main className="min-h-screen bg-premium p-4 md:p-6 selection:bg-primary/30 selection:text-white">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <div className="flex items-center gap-4 mb-2">
                            <Link href="/">
                                <ZapLogo />
                            </Link>
                            {getMarketStatusBadge()}
                        </div>
                        <div className="flex items-center gap-2 ml-0.5">
                            <div className={`w-2 h-2 rounded-full ${marketState === 'REGULAR' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                            <p className="text-muted-foreground text-sm">
                                Welcome back, <span className="text-foreground font-medium">{getUserDisplayName()}</span>
                            </p>
                            {lastUpdated && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock size={12} />
                                    Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-2 glass p-2 rounded-xl border-white/5"
                    >
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <Bell size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                            <Settings size={18} />
                        </Button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-all">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                                {getUserDisplayName().charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-foreground hidden sm:block">{getUserDisplayName()}</span>
                        </Link>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('userEmail');
                                router.push('/');
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-9 w-9 p-0"
                        >
                            <LogOut size={18} />
                        </Button>
                    </motion.div>
                </header>

                {/* Error Banner */}
                {error && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-6"
                    >
                        <Card className="glass border-l-4 border-red-500 overflow-hidden bg-red-500/5">
                            <div className="flex items-center gap-4 p-4">
                                <AlertCircle className="text-red-500" size={24} />
                                <div className="flex-1">
                                    <p className="text-sm text-red-500 font-medium">{error}</p>
                                    <p className="text-xs text-muted-foreground">Market data may be temporarily unavailable. Click refresh to try again.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={refetch} className="border-red-500/30 text-red-500 hover:bg-red-500/10">
                                    <RefreshCw size={14} className="mr-2" />
                                    Retry
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* NIFTY 50 Banner */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-6"
                >
                    <Card className="glass border-white/10 overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:px-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                    <BarChart3 size={24} className="text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-muted-foreground">NSE</span>
                                        <span className="text-lg font-bold text-foreground">{niftyData?.symbol || 'NIFTY 50'}</span>
                                    </div>
                                    {niftyData ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl font-bold text-foreground">
                                                {niftyData.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                            </span>
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-sm font-semibold ${niftyData.changePercent >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                                                }`}>
                                                {niftyData.changePercent >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                {niftyData.changePercent >= 0 ? '+' : ''}{niftyData.changePercent.toFixed(2)}%
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-6 bg-white/10 rounded animate-pulse" />
                                            <div className="w-16 h-5 bg-white/10 rounded animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            {niftyData && (
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-center">
                                        <div className="text-muted-foreground">Day High</div>
                                        <div className="font-semibold text-emerald-500">{niftyData.high.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-muted-foreground">Day Low</div>
                                        <div className="font-semibold text-red-500">{niftyData.low.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-muted-foreground">Prev Close</div>
                                        <div className="font-semibold text-foreground">{niftyData.previousClose.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* KYC Alert */}
                {kycStatus !== 'approved' && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-8"
                    >
                        <Card className="glass border-l-4 border-amber-500 overflow-hidden bg-amber-500/5">
                            <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <Shield size={32} className="text-amber-500" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <Badge className="bg-amber-500 text-white border-none px-3 font-medium mb-2 text-xs">Action Required</Badge>
                                    <h3 className="text-xl font-bold text-foreground mb-1">Complete KYC Verification</h3>
                                    <p className="text-muted-foreground text-sm max-w-xl">
                                        Complete your KYC to start trading on NSE/BSE. Required for all investment accounts.
                                    </p>
                                </div>
                                <Link href="/kyc">
                                    <Button size="lg" className="h-12 px-6 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600">
                                        Complete KYC
                                        <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <StatsCard
                        title="Current Price"
                        value={selectedStockData ? formatPrice(selectedStockData.current_price) : '₹--'}
                        icon={IndianRupee}
                        trend={selectedStockData ? {
                            value: `${selectedStockData.price_change_percentage_24h >= 0 ? '+' : ''}${selectedStockData.price_change_percentage_24h.toFixed(2)}%`,
                            positive: selectedStockData.price_change_percentage_24h >= 0
                        } : undefined}
                        delay={0.1}
                    />
                    <StatsCard
                        title="Today's Change"
                        value={selectedStockData ? `${selectedStockData.price_change >= 0 ? '+' : ''}₹${Math.abs(selectedStockData.price_change).toFixed(2)}` : '--'}
                        icon={selectedStockData?.price_change >= 0 ? TrendingUp : TrendingDown}
                        trend={selectedStockData ? { value: selectedStockData.market_state === 'REGULAR' ? "Live" : "Closed", positive: selectedStockData.price_change >= 0 } : undefined}
                        delay={0.2}
                    />
                    <StatsCard
                        title="Market Cap"
                        value={selectedStockData ? formatINR(selectedStockData.market_cap) : '₹--'}
                        icon={BarChart3}
                        description={selectedStockData?.name || 'Loading...'}
                        delay={0.3}
                    />
                    <StatsCard
                        title="Volume"
                        value={selectedStockData ? selectedStockData.total_volume.toLocaleString('en-IN') : '--'}
                        icon={Activity}
                        description="Shares traded today"
                        delay={0.4}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Stock Chart */}
                    <Card className="lg:col-span-2 glass overflow-hidden border-white/5">
                        <CardHeader className="p-6 border-b border-white/5 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    {selectedStockData?.symbol || 'Stock'} Chart
                                    <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-500">NSE</Badge>
                                </CardTitle>
                                <CardDescription className="text-sm flex items-center gap-2">
                                    {selectedStockData?.name || 'Loading...'}
                                    {selectedStockData?.last_updated && (
                                        <span className="text-xs text-muted-foreground">
                                            • Updated: {new Date(selectedStockData.last_updated).toLocaleTimeString('en-IN')}
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={refetch}
                                    disabled={marketLoading || chartLoading}
                                    className="h-8 w-8 p-0"
                                >
                                    <RefreshCw size={16} className={(marketLoading || chartLoading) ? 'animate-spin' : ''} />
                                </Button>
                                <div className="flex gap-1">
                                    {timeRangeOptions.map((option) => (
                                        <Badge
                                            key={option.value}
                                            variant={timeRange === option.value ? 'default' : 'outline'}
                                            className={`rounded-lg px-3 py-1.5 font-medium cursor-pointer text-xs ${timeRange === option.value
                                                    ? 'bg-primary text-white'
                                                    : 'border-white/10 hover:bg-white/5'
                                                }`}
                                            onClick={() => setTimeRange(option.value)}
                                        >
                                            {option.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 relative h-[350px] bg-black/5">
                            {chartLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">Loading chart data...</p>
                                    </div>
                                </div>
                            ) : chartData.length > 0 ? (
                                <TradingChart
                                    data={chartData}
                                    loading={false}
                                    height={350}
                                    coinName={selectedStockData?.symbol || 'STOCK'}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <AlertCircle size={40} className="text-muted-foreground mx-auto mb-3" />
                                        <p className="text-sm text-muted-foreground">No chart data available</p>
                                        <Button variant="outline" size="sm" onClick={refetch} className="mt-3">
                                            <RefreshCw size={14} className="mr-2" />
                                            Retry
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stock List & Quick Actions */}
                    <div className="space-y-6">
                        <Card className="glass p-6 bg-primary/5 border-primary/20 border relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ZapIcon size={100} className="fill-current text-primary" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-lg font-bold text-primary">Top Stocks</h3>
                                    <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-500">
                                        NSE Live
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mb-6">Click to view chart</p>

                                <div className="space-y-2 mb-6">
                                    {marketLoading ? (
                                        // Loading skeleton
                                        [...Array(5)].map((_, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 border border-white/5 rounded-xl animate-pulse">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/10 rounded-lg" />
                                                    <div>
                                                        <div className="w-16 h-4 bg-white/10 rounded mb-1" />
                                                        <div className="w-24 h-3 bg-white/10 rounded" />
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="w-16 h-4 bg-white/10 rounded mb-1" />
                                                    <div className="w-12 h-3 bg-white/10 rounded" />
                                                </div>
                                            </div>
                                        ))
                                    ) : prices.length > 0 ? (
                                        prices.map((stock) => (
                                            <div
                                                key={stock.id}
                                                onClick={() => setSelectedStock(stock.id)}
                                                className={`flex justify-between items-center text-sm border rounded-xl p-3 cursor-pointer transition-all ${selectedStock === stock.id
                                                        ? 'bg-primary/10 border-primary/30'
                                                        : 'border-white/5 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-orange-500">{stock.symbol.slice(0, 3)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-foreground block">{stock.symbol}</span>
                                                        <span className="text-xs text-muted-foreground">{stock.name.slice(0, 18)}...</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-semibold text-foreground block">₹{stock.current_price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                                    <span className={`text-xs font-medium ${stock.price_change_percentage_24h >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {stock.price_change_percentage_24h >= 0 ? '+' : ''}{stock.price_change_percentage_24h.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <AlertCircle size={32} className="text-muted-foreground mx-auto mb-2" />
                                            <p className="text-xs text-muted-foreground">Unable to load stocks</p>
                                            <Button variant="ghost" size="sm" onClick={refetch} className="mt-2">
                                                Retry
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Button className="w-full h-11 rounded-xl font-semibold glow-primary">
                                    Start Trading
                                    <ChevronRight size={18} className="ml-1" />
                                </Button>
                            </div>
                        </Card>

                        <Card className="glass p-6 border-white/5">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-primary" />
                                Stock Stats
                            </h4>
                            <div className="space-y-3">
                                {selectedStockData ? (
                                    <>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-sm text-muted-foreground">Day High</span>
                                            <span className="text-sm font-semibold text-emerald-500">₹{selectedStockData.high_24h.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-sm text-muted-foreground">Day Low</span>
                                            <span className="text-sm font-semibold text-red-500">₹{selectedStockData.low_24h.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-sm text-muted-foreground">Open</span>
                                            <span className="text-sm font-semibold text-foreground">₹{selectedStockData.open.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-sm text-muted-foreground">Prev Close</span>
                                            <span className="text-sm font-semibold text-foreground">₹{selectedStockData.previous_close.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </>
                                ) : (
                                    [...Array(4)].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 animate-pulse">
                                            <div className="w-16 h-4 bg-white/10 rounded" />
                                            <div className="w-20 h-4 bg-white/10 rounded" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
