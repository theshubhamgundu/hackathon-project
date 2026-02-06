'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
    Shield,
    User,
    Briefcase,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Lock,
    AlertTriangle,
    Activity,
    Globe,
    ChevronLeft
} from 'lucide-react';

export default function KYCPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        address: '',
        city: '',
        country: '',
        income: '',
        investmentExperience: 'beginner',
        riskTolerance: 'low',
        termsAccepted: false,
        dataConsent: false,
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.termsAccepted || !formData.dataConsent) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

            const response = await fetch(`${API_BASE}/api/kyc/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    encryptedData: btoa(JSON.stringify(formData)),
                }),
            });

            if (response.ok) {
                router.push('/dashboard');
            } else {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'KYC submission failed');
            }
        } catch (error) {
            console.error('KYC submission error:', error);
        } finally {
            setLoading(false);
        }
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

    const stepTitles = [
        'Personal Information',
        'Financial Profile',
        'Risk Assessment',
        'Review & Submit'
    ];

    return (
        <div className="min-h-screen bg-premium bg-trading-lines p-6 flex flex-col items-center justify-center selection:bg-primary/30">
            <div className="fixed top-8 left-8 z-50">
                <Link href="/dashboard">
                    <Button variant="ghost" className="flex items-center gap-2 group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
            <div className="fixed top-8 right-8 z-50">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl relative z-10"
            >
                <ZapLogo />

                <Card className="glass border-white/10 shadow-2xl overflow-hidden">
                    <CardHeader className="pb-6">
                        <div className="flex items-center justify-between mb-4">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-lg font-medium text-xs">
                                Step {step} of {totalSteps}
                            </Badge>
                            <div className="text-sm font-medium text-muted-foreground">
                                {Math.round((step / totalSteps) * 100)}% Complete
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight mb-2">Identity Verification</CardTitle>
                        <CardDescription className="text-base">
                            Complete your verification to unlock all platform features.
                        </CardDescription>

                        {/* Progress Steps */}
                        <div className="mt-6 flex items-center justify-between">
                            {stepTitles.map((title, i) => (
                                <div key={i} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${i + 1 < step ? 'bg-primary text-white' :
                                        i + 1 === step ? 'bg-primary text-white ring-4 ring-primary/20' :
                                            'bg-white/10 text-muted-foreground'
                                        }`}>
                                        {i + 1 < step ? <CheckCircle size={16} /> : i + 1}
                                    </div>
                                    {i < stepTitles.length - 1 && (
                                        <div className={`w-12 h-0.5 mx-2 transition-all ${i + 1 < step ? 'bg-primary' : 'bg-white/10'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-center">
                            <span className="text-sm font-medium text-foreground">{stepTitles[step - 1]}</span>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold">Personal Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Full Legal Name"
                                                placeholder="Enter your name as shown on ID"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <Input
                                            label="Date of Birth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Country"
                                            placeholder="e.g. United States"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            required
                                        />
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Residential Address"
                                                placeholder="Street address, City, State, ZIP"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Briefcase size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold">Financial Information</h3>
                                    </div>

                                    <div className be="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground ml-1">Annual Income Range</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['₹0 - ₹5L', '₹5L - ₹15L', '₹15L - ₹50L', '₹50L+'].map((range) => (
                                                    <Button
                                                        key={range}
                                                        type="button"
                                                        variant={formData.income === range ? 'default' : 'outline'}
                                                        className={`h-12 rounded-xl font-medium transition-all ${formData.income === range ? 'bg-primary glow-primary' : 'glass'}`}
                                                        onClick={() => setFormData({ ...formData, income: range })}
                                                    >
                                                        {range}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground ml-1">Investment Experience</label>
                                            <select
                                                value={formData.investmentExperience}
                                                onChange={(e) => setFormData({ ...formData, investmentExperience: e.target.value })}
                                                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-foreground font-medium focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 backdrop-blur-md"
                                            >
                                                <option value="beginner">Beginner — New to investing</option>
                                                <option value="intermediate">Intermediate — 1-3 years experience</option>
                                                <option value="advanced">Advanced — 3+ years experience</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                            <Activity size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold">Risk Tolerance</h3>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Select the investment approach that best matches your financial goals and comfort level.
                                    </p>

                                    <div className="space-y-3">
                                        {[
                                            { id: 'low', label: 'Conservative', desc: 'Prioritize capital preservation with stable, lower-risk investments', color: 'text-emerald-500' },
                                            { id: 'medium', label: 'Balanced', desc: 'Mix of growth and stability for moderate returns', color: 'text-primary' },
                                            { id: 'high', label: 'Aggressive', desc: 'Higher risk tolerance for potentially greater returns', color: 'text-purple-500' },
                                        ].map((risk) => (
                                            <div
                                                key={risk.id}
                                                onClick={() => setFormData({ ...formData, riskTolerance: risk.id })}
                                                className={`p-5 rounded-xl border transition-all cursor-pointer ${formData.riskTolerance === risk.id
                                                    ? 'bg-primary/10 border-primary/50 shadow-lg'
                                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className={`text-lg font-semibold ${risk.color}`}>{risk.label}</div>
                                                        <div className="text-sm text-muted-foreground mt-1">{risk.desc}</div>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.riskTolerance === risk.id ? 'border-primary bg-primary' : 'border-white/20'}`}>
                                                        {formData.riskTolerance === risk.id && <CheckCircle size={12} className="text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Shield size={20} />
                                        </div>
                                        <h3 className="text-xl font-bold">Terms & Agreements</h3>
                                    </div>

                                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
                                        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
                                            Please review and accept the following agreements to complete your verification.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className={`p-5 rounded-xl border transition-all cursor-pointer ${formData.dataConsent ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}
                                            onClick={() => setFormData({ ...formData, dataConsent: !formData.dataConsent })}>
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.dataConsent ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                                    {formData.dataConsent && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <div className="text-sm">
                                                    <div className="font-semibold text-foreground">Privacy & Data Policy</div>
                                                    <div className="text-muted-foreground mt-1 leading-relaxed">I consent to ZAP Finance collecting and processing my personal data in accordance with the Privacy Policy.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-5 rounded-xl border transition-all cursor-pointer ${formData.termsAccepted ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'}`}
                                            onClick={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}>
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${formData.termsAccepted ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                                    {formData.termsAccepted && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <div className="text-sm">
                                                    <div className="font-semibold text-foreground">Terms of Service</div>
                                                    <div className="text-muted-foreground mt-1 leading-relaxed">I have read and agree to the Terms of Service and understand the risks associated with investing.</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex gap-3 border-t border-white/5 pt-6 mt-4 p-6">
                        {step > 1 && (
                            <Button variant="outline" onClick={handleBack} className="flex-1 h-11 rounded-xl font-medium glass">
                                <ArrowLeft size={18} className="mr-2" /> Back
                            </Button>
                        )}
                        {step < totalSteps ? (
                            <Button onClick={handleNext} className="flex-[2] h-11 rounded-xl font-semibold glow-primary">
                                Continue <ArrowRight size={18} className="ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className="flex-[2] h-11 rounded-xl font-semibold glow-primary"
                                disabled={loading || !formData.termsAccepted || !formData.dataConsent}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    <>Submit Verification <CheckCircle size={18} className="ml-2" /></>
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-6 mt-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Lock size={18} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">ISO 27001 Certified</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Shield size={18} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Regulatory Compliant</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Globe size={18} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">GDPR Protected</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
