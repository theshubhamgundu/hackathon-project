'use client';

import { useState, useEffect, useCallback } from 'react';

export interface StockPrice {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    price_change: number;
    market_cap: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    previous_close: number;
    open: number;
    exchange: string;
    market_state: string;
    last_updated: string;
}

export interface ChartData {
    time: number;
    value: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
}

export interface MarketData {
    prices: StockPrice[];
    chartData: ChartData[];
    loading: boolean;
    chartLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    selectedStock: string;
    setSelectedStock: (stock: string) => void;
    refetch: () => void;
    niftyData: NiftyData | null;
    marketState: string;
    timeRange: string;
    setTimeRange: (range: string) => void;
}

export interface NiftyData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    previousClose: number;
    open: number;
    marketState: string;
    lastUpdated: string;
}

export function useMarketData(): MarketData {
    const [prices, setPrices] = useState<StockPrice[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [selectedStock, setSelectedStock] = useState('RELIANCE.NS');
    const [niftyData, setNiftyData] = useState<NiftyData | null>(null);
    const [marketState, setMarketState] = useState<string>('UNKNOWN');
    const [timeRange, setTimeRange] = useState('5d');

    const fetchPrices = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/crypto?endpoint=stocks', {
                cache: 'no-store',
            });

            const data = await response.json();

            // Check if we got valid data (could be live or fallback)
            if (Array.isArray(data) && data.length > 0) {
                setPrices(data);
                setLastUpdated(new Date());
                setMarketState(data[0].market_state || 'CLOSED');
                setError(null);
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error('No stock data received');
            }
        } catch (err: any) {
            console.error('Error fetching prices:', err);
            setError(err.message || 'Failed to fetch stock prices');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchNifty = useCallback(async () => {
        try {
            const response = await fetch('/api/crypto?endpoint=nifty', {
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch NIFTY');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setNiftyData(data);
        } catch (err: any) {
            console.error('Error fetching NIFTY:', err);
            // Don't set error for NIFTY failure, stocks might still work
        }
    }, []);

    const fetchChartData = useCallback(async (stockId: string, range: string = '5d') => {
        try {
            setChartLoading(true);

            const symbol = stockId.replace('.NS', '');
            const response = await fetch(`/api/crypto?endpoint=chart&symbol=${symbol}&range=${range}`, {
                cache: 'no-store',
            });

            const data = await response.json();

            // Accept data even if it's fallback
            if (data.prices && data.prices.length > 0) {
                setChartData(data.prices);
                // Don't clear error if it's a chart-specific issue
            } else if (data.error) {
                console.error('Chart data error:', data.error);
                setChartData([]);
            } else {
                console.error('No chart data in response');
                setChartData([]);
            }
        } catch (err: any) {
            console.error('Error fetching chart data:', err);
            setChartData([]);
        } finally {
            setChartLoading(false);
        }
    }, []);

    const refetch = useCallback(() => {
        fetchPrices();
        fetchNifty();
        fetchChartData(selectedStock, timeRange);
    }, [fetchPrices, fetchNifty, fetchChartData, selectedStock, timeRange]);

    // Initial fetch
    useEffect(() => {
        fetchPrices();
        fetchNifty();
    }, [fetchPrices, fetchNifty]);

    // Fetch chart when stock or time range changes
    useEffect(() => {
        if (selectedStock) {
            fetchChartData(selectedStock, timeRange);
        }
    }, [selectedStock, timeRange, fetchChartData]);

    // Auto-refresh every 30 seconds during market hours
    useEffect(() => {
        const interval = setInterval(() => {
            fetchPrices();
            fetchNifty();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchPrices, fetchNifty]);

    return {
        prices,
        chartData,
        loading,
        chartLoading,
        error,
        lastUpdated,
        selectedStock,
        setSelectedStock,
        refetch,
        niftyData,
        marketState,
        timeRange,
        setTimeRange,
    };
}

// Helper function to format INR
export function formatINR(value: number): string {
    if (!value || isNaN(value)) return '₹--';

    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)} L`;
    } else if (value >= 1000) {
        return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    } else {
        return `₹${value.toFixed(2)}`;
    }
}

// Format price with rupee symbol
export function formatPrice(value: number): string {
    if (!value || isNaN(value)) return '₹--';
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format time for display
export function formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Format date for display
export function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}
