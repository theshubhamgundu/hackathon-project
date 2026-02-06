'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Shield, Lock, ArrowRight, User, Briefcase } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo login validation
        const validCredentials = [
            { email: 'user@zapfinance.com', password: 'demo123' },
            { email: 'admin@zapfinance.com', password: 'admin123' }
        ];

        const isValid = validCredentials.some(
            cred => cred.email === formData.email && cred.password === formData.password
        );

        setTimeout(() => {
            if (isValid || (formData.email && formData.password)) {
                localStorage.setItem('token', 'demo-token-' + Date.now());
                localStorage.setItem('userEmail', formData.email);
                router.push('/dashboard');
            } else {
                setError('Invalid credentials. Please try again or use demo accounts.');
                setLoading(false);
            }
        }, 1200);
    };

    const ZapLogo = () => (
        <div className="flex items-center gap-3 mb-10 group justify-center">
            <div className="relative w-14 h-14 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 blur-xl rounded-full group-hover:from-primary/50 group-hover:to-primary/20 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full" />
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-primary relative z-10 fill-current drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-foreground">ZAP Finance</span>
                <span className="text-xs font-medium text-muted-foreground tracking-wide">Investment Platform</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-premium bg-trading-lines flex flex-col items-center justify-center p-6 selection:bg-primary/30 selection:text-white">
            <div className="fixed top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <Link href="/" className="block">
                    <ZapLogo />
                </Link>

                <Card className="glass border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl font-bold mb-2 tracking-tight text-foreground">Welcome Back</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="flex justify-end">
                                    <Link href="/auth/forgot-password" className="text-sm text-primary font-medium hover:underline underline-offset-2 transition-all">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3"
                                >
                                    <Shield size={18} /> {error}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl font-semibold text-base glow-primary transition-all duration-300 hover:scale-[1.02]"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight size={18} />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Demo Accounts Section */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="text-center mb-5">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Quick Access Demo Accounts</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-auto py-4 px-3 rounded-xl flex flex-col items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                                        onClick={() => setFormData({ email: 'user@zapfinance.com', password: 'demo123' })}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User size={20} className="text-primary" />
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-sm text-foreground">Standard User</div>
                                            <div className="text-[10px] text-muted-foreground mt-0.5">View dashboard & analytics</div>
                                        </div>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-auto py-4 px-3 rounded-xl flex flex-col items-center gap-2 border-secondary/20 hover:border-secondary/40 hover:bg-secondary/5 transition-all"
                                        onClick={() => setFormData({ email: 'admin@zapfinance.com', password: 'admin123' })}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                                            <Briefcase size={20} className="text-secondary" />
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-sm text-foreground">Administrator</div>
                                            <div className="text-[10px] text-muted-foreground mt-0.5">Full platform access</div>
                                        </div>
                                    </Button>
                                </motion.div>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-4">
                                Click a demo account to auto-fill credentials
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 pb-8">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-primary font-semibold hover:underline underline-offset-2 transition-all">
                                Create Account
                            </Link>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                            <Lock size={12} />
                            <span>256-bit SSL Encrypted Connection</span>
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-xs text-muted-foreground/50 mt-6">
                    © {new Date().getFullYear()} ZAP Finance. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
