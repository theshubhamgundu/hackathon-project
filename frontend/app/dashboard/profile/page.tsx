'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
    User,
    Wallet,
    Settings,
    Bell,
    History,
    ChevronLeft,
    CheckCircle,
    AlertCircle,
    Clock,
    LogOut,
    Shield,
    Mail
} from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState('');
    const [user, setUser] = useState({
        name: 'Demo User',
        email: 'user@zapfinance.com',
        walletAddress: '0x71C7...5ad8',
        kycStatus: 'approved',
        joinedDate: 'Feb 2026',
        accountType: 'Standard'
    });

    useEffect(() => {
        setMounted(true);
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUserEmail(email);
            setUser(prev => ({
                ...prev,
                email: email,
                name: email.includes('admin') ? 'Administrator' : 'Demo User',
                accountType: email.includes('admin') ? 'Administrator' : 'Standard'
            }));
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        router.push('/');
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-premium p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="flex items-center gap-2 group">
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                            <LogOut size={18} className="mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Info */}
                    <div className="space-y-6">
                        <Card className="glass text-center p-6">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl shadow-xl">
                                    <User size={48} className="text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                            <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                            <div className="flex justify-center gap-2 mb-4 flex-wrap">
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                    <CheckCircle size={12} className="mr-1" />
                                    Verified
                                </Badge>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {user.accountType}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                                <div>
                                    <div className="text-xl font-bold text-primary">₹2,08,000</div>
                                    <div className="text-xs text-muted-foreground">Total Invested</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-emerald-500">+12%</div>
                                    <div className="text-xs text-muted-foreground">All-time Return</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="glass">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Wallet size={18} className="text-primary" />
                                    Linked Wallet
                                </CardTitle>
                                <CardDescription>Your connected Web3 wallet</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-medium">Active</span>
                                    </div>
                                    <div className="font-mono text-xs text-muted-foreground">
                                        {user.walletAddress}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Connected via MetaMask on Ethereum Mainnet
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="glass">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Account Settings</CardTitle>
                                        <CardDescription>Manage your profile information</CardDescription>
                                    </div>
                                    <Settings className="text-primary" size={20} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        label="Full Name"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                                        <div className="relative">
                                            <Input
                                                value={user.email}
                                                disabled
                                                className="pr-10"
                                            />
                                            <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex items-center gap-2">
                                            <AlertCircle size={14} className="text-amber-500" />
                                            Email address cannot be changed after identity verification.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <Button className="glow-primary">Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="glass">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Bell size={18} className="text-primary" />
                                        Notifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { label: 'Investment Alerts', active: true },
                                        { label: 'Market Updates', active: true },
                                        { label: 'Login Notifications', active: false },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-sm font-medium">{item.label}</span>
                                            <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${item.active ? 'bg-primary' : 'bg-white/20'}`}>
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${item.active ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="glass">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <History size={18} className="text-primary" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        { action: 'Portfolio Deposit', date: '2 hours ago', amount: '+ ₹41,600' },
                                        { action: 'Successful Login', date: '5 hours ago', status: 'Web' },
                                        { action: 'Wallet Connected', date: '1 day ago', status: 'Verified' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div>
                                                <div className="text-sm font-medium">{item.action}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock size={10} /> {item.date}
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-primary">{item.amount || item.status}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="glass">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Shield size={18} className="text-primary" />
                                    Security
                                </CardTitle>
                                <CardDescription>Manage your account security settings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-12 justify-start">
                                        <Shield size={18} className="mr-2" />
                                        Change Password
                                    </Button>
                                    <Button variant="outline" className="h-12 justify-start">
                                        <Wallet size={18} className="mr-2" />
                                        Manage Wallet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
