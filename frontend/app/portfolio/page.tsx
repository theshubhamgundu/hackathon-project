'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
    PieChart,
    TrendingUp,
    TrendingDown,
    ArrowLeft,
    Activity,
    Wallet,
    BarChart3,
    History,
    Zap as ZapIcon,
    Globe,
    ArrowRight
} from 'lucide-react';

export default function PortfolioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        setTimeout(() => setLoading(false), 800);
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-screen bg-premium flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-primary font-black uppercase tracking-widest text-[10px] animate-pulse">Decrypting Portfolio Architecture...</p>
                </div>
            </main>
        );
    }

    const ZapLogo = () => (
        <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary relative z-10 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground">ZAP</span>
        </div>
    );

    return (
        <main className="min-h-screen bg-premium bg-trading-lines p-6 selection:bg-primary/30 selection:text-white pb-32">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="rounded-xl font-bold group">
                                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                                BACK
                            </Button>
                        </Link>
                        <div className="h-8 w-px bg-white/10" />
                        <ZapLogo />
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full font-black text-[10px] tracking-widest">PORTFOLIO v4.0</Badge>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Performance */}
                    <Card className="lg:col-span-2 glass p-10 flex flex-col gap-10" hover={false}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter mb-2 italic">Asset Distribution</h2>
                                <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Total Terminal Value</p>
                                <div className="text-6xl font-black text-foreground mt-4 tracking-tighter tabular-nums">$124,500.20</div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-emerald-500 font-black text-2xl mb-1">
                                    <TrendingUp size={24} />
                                    +12.4%
                                </div>
                                <div className="text-[10px] font-black uppercase text-foreground/40 tracking-widest">Since Inception</div>
                            </div>
                        </div>

                        {/* Abstract Chart Container */}
                        <div className="h-[300px] w-full bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 opacity-10">
                                <svg className="w-full h-full" viewBox="0 0 800 300">
                                    <path d="M0 250 Q100 230 200 260 T400 200 T600 220 T800 150" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" />
                                </svg>
                            </div>
                            <div className="relative text-center">
                                <BarChart3 size={64} className="text-primary/20 mx-auto mb-6 animate-float" />
                                <h4 className="text-xl font-black opacity-40 uppercase tracking-widest">Active Analysis Feed</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                            {[
                                { label: 'Crypto Assets', val: '65%', color: 'from-primary to-blue-600' },
                                { label: 'Stock Synthetics', val: '20%', color: 'from-emerald-500 to-teal-600' },
                                { label: 'Fixed Yield', val: '10%', color: 'from-purple-500 to-indigo-600' },
                                { label: 'Fiat Reserve', val: '5%', color: 'from-amber-500 to-orange-600' },
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{stat.label}</span>
                                        <span className="text-sm font-black text-foreground">{stat.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full`} style={{ width: stat.val }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Breakdown Sidebar */}
                    <div className="space-y-8">
                        <Card className="glass p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500"><TrendingDown size={20} /></div>
                                <h3 className="text-xl font-black tracking-tight">Risk Exposure</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div>
                                        <div className="text-xs font-black text-foreground uppercase tracking-widest">Volatility Index</div>
                                        <div className="text-sm font-bold text-foreground/40">Medium-High</div>
                                    </div>
                                    <Badge className="bg-amber-500/20 text-amber-500 border-none px-3 font-black">64.5</Badge>
                                </div>
                                <p className="text-xs text-foreground/40 font-bold leading-relaxed italic">
                                    "Your current allocation has a high correlation with the BTC index. Diversification into Z-Yield pools recommended."
                                </p>
                                <Button variant="outline" className="w-full rounded-xl border-white/10 font-black">Optimise Allocation</Button>
                            </div>
                        </Card>

                        <Card className="glass p-8 bg-blue-600/5 border-primary/20 overflow-hidden relative group">
                            <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <Globe size={120} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-black mb-4 relative z-10">Governance Rights</h3>
                            <p className="text-sm text-foreground/50 font-medium mb-8 relative z-10 leading-relaxed">
                                As a Level 4 ZAP Trader, you hold 1,200 Z-Voters. Use them to influence terminal updates.
                            </p>
                            <Button className="w-full font-black rounded-xl bg-primary relative z-10">Cast Vote <ZapIcon size={14} className="ml-2 fill-current" /></Button>
                        </Card>
                    </div>
                </div>

                {/* Performance History */}
                <Card className="glass mt-12 overflow-hidden border-white/5" hover={false}>
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight">Sequence Execution History</h2>
                        <Button variant="outline" className="rounded-lg font-bold border-white/10 text-xs px-6">EXPORT DATA</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Protocol ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Action</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Magnification</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Delta</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {[
                                    { id: '#ZAP-49204', action: 'BTC Buy', mag: '12x', delta: '+$240.20', status: 'SYNCHRONIZED' },
                                    { id: '#ZAP-49192', action: 'ETH Yield Harvest', mag: '1x', delta: '+$1,290.00', status: 'SYNCHRONIZED' },
                                    { id: '#ZAP-48201', action: 'SOL Withdrawal', mag: '-', delta: '-$402.10', status: 'PENDING HUB' },
                                    { id: '#ZAP-47120', action: 'Asset Swap', mag: '1x', delta: '+$12.40', status: 'SYNCHRONIZED' },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                        <td className="px-10 py-8 font-mono text-xs font-black text-foreground/60">{row.id}</td>
                                        <td className="px-10 py-8 font-black text-foreground">{row.action}</td>
                                        <td className="px-10 py-8 text-foreground/40 font-bold">{row.mag}</td>
                                        <td className={`px-10 py-8 font-black ${row.delta.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{row.delta}</td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'SYNCHRONIZED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{row.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </main>
    );
}
