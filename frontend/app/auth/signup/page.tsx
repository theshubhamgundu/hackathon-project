'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Shield, Lock, Wallet, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        walletAddress: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const nextStep = () => {
        if (step === 1 && (!formData.email || !formData.password || formData.password !== formData.confirmPassword)) {
            setError('Please fill all fields correctly');
            return;
        }
        if (step === 1 && formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        setStep(2);
    };

    const connectWallet = async () => {
        setLoading(true);
        setTimeout(() => {
            setFormData({ ...formData, walletAddress: '0x7F4e...9a3B' });
            setLoading(false);
        }, 1200);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('token', 'demo-token-' + Date.now());
            localStorage.setItem('userEmail', formData.email);
            router.push('/dashboard');
        }, 1500);
    };

    const ZapLogo = () => (
        <div className="flex items-center gap-3 group justify-center mb-10">
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
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-full border border-white/5">
                                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${step === 1 ? 'bg-primary scale-125' : 'bg-white/20'}`} />
                                <div className="w-8 h-0.5 bg-white/10 rounded" />
                                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${step === 2 ? 'bg-primary scale-125' : 'bg-white/20'}`} />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold mb-2 tracking-tight">Create Account</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            {step === 1 ? 'Enter your details to get started' : 'Connect your wallet (optional)'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-5"
                                >
                                    <Input
                                        label="Full Name"
                                        name="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Input
                                        label="Password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password (min. 8 characters)"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Input
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        error={formData.password !== formData.confirmPassword && formData.confirmPassword ? 'Passwords do not match' : ''}
                                    />

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
                                        onClick={nextStep}
                                        className="w-full h-12 rounded-xl font-semibold text-base glow-primary transition-all duration-300 hover:scale-[1.02]"
                                        size="lg"
                                    >
                                        Continue
                                        <ArrowRight size={18} className="ml-2" />
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6 text-center"
                                >
                                    <div className="py-6 flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 shadow-xl">
                                            <Wallet size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2">Connect Wallet</h3>
                                        <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                                            Link your Web3 wallet for enhanced security and crypto trading features.
                                        </p>
                                    </div>

                                    {formData.walletAddress ? (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <CheckCircle size={18} className="text-white" />
                                                </div>
                                                <span className="font-mono text-sm font-medium text-foreground">{formData.walletAddress}</span>
                                            </div>
                                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none font-medium">Connected</Badge>
                                        </motion.div>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-dashed border-2 h-16 rounded-xl bg-white/5 hover:bg-white/10 transition-all font-medium"
                                            size="lg"
                                            onClick={connectWallet}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Connecting...
                                                </span>
                                            ) : (
                                                'Connect Wallet'
                                            )}
                                        </Button>
                                    )}

                                    <div className="flex gap-3 mt-6">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="flex-1 rounded-xl font-medium h-11"
                                            onClick={() => setStep(1)}
                                        >
                                            <ArrowLeft size={18} className="mr-2" /> Back
                                        </Button>
                                        <Button
                                            className="flex-[2] rounded-xl font-semibold glow-primary h-11 transition-all duration-300 hover:scale-[1.02]"
                                            onClick={handleSignup}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Creating Account...
                                                </span>
                                            ) : (
                                                formData.walletAddress ? 'Create Account' : 'Skip & Create Account'
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 border-t border-white/5 pt-6 pb-8">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-primary font-semibold hover:underline underline-offset-2 transition-all">
                                Sign In
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
