'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, AreaData, Time, AreaSeries } from 'lightweight-charts';

interface ChartDataPoint {
    time: number;
    value: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
    volume?: number;
}

interface TradingChartProps {
    data: ChartDataPoint[];
    loading?: boolean;
    height?: number;
    coinName?: string;
}

export default function TradingChart({ data, loading = false, height = 350, coinName = 'STOCK' }: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [priceChangeAbs, setPriceChangeAbs] = useState<number>(0);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return;

        // Calculate price change from first to last data point
        if (data.length > 1) {
            const firstPrice = data[0].value;
            const lastPrice = data[data.length - 1].value;
            const change = ((lastPrice - firstPrice) / firstPrice) * 100;
            const changeAbs = lastPrice - firstPrice;
            setPriceChange(change);
            setPriceChangeAbs(changeAbs);
            setCurrentPrice(lastPrice);
        } else if (data.length === 1) {
            setCurrentPrice(data[0].value);
            setPriceChange(0);
            setPriceChangeAbs(0);
        }

        // Create or update chart
        if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: 'transparent' },
                    textColor: 'rgba(255, 255, 255, 0.5)',
                },
                grid: {
                    vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                    horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
                },
                width: chartContainerRef.current.clientWidth,
                height: height,
                rightPriceScale: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    scaleMargins: {
                        top: 0.15,
                        bottom: 0.1,
                    },
                },
                timeScale: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    timeVisible: true,
                    secondsVisible: false,
                    tickMarkFormatter: (time: any) => {
                        const date = new Date(time * 1000);
                        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
                    },
                },
                crosshair: {
                    vertLine: {
                        color: 'rgba(59, 130, 246, 0.5)',
                        width: 1,
                        style: 2,
                        labelBackgroundColor: 'rgba(59, 130, 246, 0.8)',
                    },
                    horzLine: {
                        color: 'rgba(59, 130, 246, 0.5)',
                        width: 1,
                        style: 2,
                        labelBackgroundColor: 'rgba(59, 130, 246, 0.8)',
                    },
                },
                handleScroll: {
                    mouseWheel: true,
                    pressedMouseMove: true,
                },
                handleScale: {
                    axisPressedMouseMove: true,
                    mouseWheel: true,
                    pinch: true,
                },
            });

            const isPositive = priceChange >= 0;
            seriesRef.current = chartRef.current.addSeries(AreaSeries, {
                lineColor: isPositive ? '#10b981' : '#ef4444',
                topColor: isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                bottomColor: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)',
                lineWidth: 2,
                priceFormat: {
                    type: 'custom',
                    formatter: (price: number) => {
                        return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    },
                },
            });
        }

        // Update series data
        if (seriesRef.current && data.length > 0) {
            const formattedData: AreaData[] = data.map(d => ({
                time: d.time as Time,
                value: d.value,
            }));
            seriesRef.current.setData(formattedData);

            // Update series colors based on price change
            const isPositive = priceChange >= 0;
            seriesRef.current.applyOptions({
                lineColor: isPositive ? '#10b981' : '#ef4444',
                topColor: isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                bottomColor: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)',
            });

            chartRef.current?.timeScale().fitContent();
        }

        // Handle resize
        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data, height, priceChange]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
            }
        };
    }, []);

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ height }}>
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Loading chart data...</p>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center" style={{ height }}>
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">No data available</p>
                </div>
            </div>
        );
    }

    // Get time range display
    const getTimeRange = () => {
        if (data.length < 2) return '';
        const firstTime = new Date(data[0].time * 1000);
        const lastTime = new Date(data[data.length - 1].time * 1000);

        const diffDays = Math.ceil((lastTime.getTime() - firstTime.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            return `${firstTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - ${lastTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return `${firstTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${lastTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        }
    };

    return (
        <div className="relative w-full">
            {/* Price Display */}
            <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground uppercase">{coinName}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-500 font-medium">NSE</span>
                </div>
                {currentPrice && (
                    <div className="text-2xl font-bold text-foreground mb-1">
                        {formatPrice(currentPrice)}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {priceChangeAbs >= 0 ? '+' : ''}{formatPrice(Math.abs(priceChangeAbs))}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${priceChange >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">{getTimeRange()}</div>
            </div>

            <div ref={chartContainerRef} className="w-full" style={{ height }} />
        </div>
    );
}
