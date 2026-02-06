'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
    BookOpen,
    Search,
    ShieldAlert,
    TrendingUp,
    ChevronLeft,
    CheckCircle,
    ArrowRight,
    Gem,
    Award,
    Zap,
    Lock,
    Flag
} from 'lucide-react';

export default function EducationPage() {
    const [completedModules, setCompletedModules] = useState<string[]>([]);

    const modules = [
        {
            id: 'platform-verification',
            title: 'Verify Legitimacy',
            icon: Search,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            description: 'Learn to identify legitimate investment platforms and avoid high-tech scams.',
            lessons: [
                'Check for regulatory licenses',
                'Verify SSL certificates',
                'Research company background',
                'Read user reviews carefully',
            ],
        },
        {
            id: 'common-scams',
            title: 'Common Scams',
            icon: ShieldAlert,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            description: 'Recognize and avoid common fraud patterns like Ponzi and Phishing.',
            lessons: [
                'Ponzi & Pyramid structures',
                'Pump & Dump patterns',
                'Phishing & Fake websites',
                'Unrealistic return claims',
            ],
        },
        {
            id: 'risk-management',
            title: 'Risk Mastery',
            icon: TrendingUp,
            color: 'text-teal-400',
            bg: 'bg-teal-500/10',
            description: 'Understand risk levels and how to balance growth with security.',
            lessons: [
                'Types of financial risks',
                'Diversification strategies',
                'Risk vs. Return ratio',
                'Realistic growth goals',
            ],
        },
        {
            id: 'blockchain-basics',
            title: 'Blockchain Guard',
            icon: Lock,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            description: 'Learn how smart contracts protect your funds from manual tampering.',
            lessons: [
                'What is Decentralization',
                'How Smart Contracts work',
                'Verifying on Etherscan',
                'Wallet safety protocols',
            ],
        },
    ];

    const toggleModule = (id: string) => {
        if (completedModules.includes(id)) {
            setCompletedModules(completedModules.filter((m) => m !== id));
        } else {
            setCompletedModules([...completedModules, id]);
        }
    };

    const progress = Math.round((completedModules.length / modules.length) * 100);

    return (
        <div className="min-h-screen bg-premium bg-grid p-6">
            <div className="mx-auto max-w-6xl">
                {/* Navigation */}
                <div className="flex items-center justify-between mb-10">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="flex items-center gap-2 group">
                            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-gradient">Investor Education</h1>
                    </div>
                    <p className="text-gray-400 max-w-2xl">
                        Master the art of secure investing. Our modules are designed to help you identify scams and manage risk like a professional.
                    </p>
                </div>

                {/* Progress Card */}
                <Card className="glass mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Award size={120} className="text-teal-500" />
                    </div>
                    <CardContent className="pt-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-black mb-1">Learning Progress</h3>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
                                    {completedModules.length} Modules Completed
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-black text-gradient">{progress}%</div>
                                <div className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">Consistency</div>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-teal-500 to-purple-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Warning Bar */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="p-6 mb-10 rounded-2xl border-l-4 border-red-500 bg-red-500/5 backdrop-blur-md flex items-start gap-4"
                >
                    <Flag className="text-red-500 shrink-0" size={24} />
                    <div>
                        <h4 className="text-lg font-bold text-red-400 mb-2 uppercase tracking-wide">Investment Red Flags</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2">
                            {[
                                'Guaranteed "High Returns"',
                                'Unsolicited DM offers',
                                'Pressure to act fast',
                                'No official whitepaper',
                                'Opaque team details',
                                'Complex "hidden" fees'
                            ].map((flag) => (
                                <div key={flag} className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="w-1 h-1 rounded-full bg-red-500" />
                                    {flag}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {modules.map((module, i) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className={`glass h-full hover:border-${module.color.split('-')[1]}-500/30 transition-all group`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className={`w-14 h-14 rounded-2xl ${module.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                            <module.icon className={module.color} size={28} />
                                        </div>
                                        {completedModules.includes(module.id) && (
                                            <Badge variant="success" className="animate-pulse">Completed</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-black mt-6">{module.title}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {module.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {module.lessons.map((lesson, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm text-gray-400 group/item">
                                                <Zap size={14} className="text-teal-500 opacity-50 group-hover/item:opacity-100" />
                                                {lesson}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-6 border-t border-gray-800/30">
                                    <Button
                                        onClick={() => toggleModule(module.id)}
                                        variant={completedModules.includes(module.id) ? 'outline' : 'default'}
                                        className="w-full"
                                    >
                                        {completedModules.includes(module.id) ? (
                                            <>Reset Module</>
                                        ) : (
                                            <>Start Learning <ArrowRight size={18} /></>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Achievement */}
                {progress === 100 && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="card-featured text-center p-12"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <Award size={48} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-black mb-4 text-gradient">Master Investor</h2>
                        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
                            Congratulations! You've unlocked the Master Investor badge. Your knowledge is now your greatest security asset.
                        </p>
                        <Link href="/dashboard">
                            <Button size="xl" className="glow-teal">Return to Investing</Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
