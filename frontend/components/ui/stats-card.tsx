'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    description?: string;
    icon: LucideIcon;
    gradient?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    delay?: number;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    gradient = 'from-primary/20 to-primary/0',
    trend,
    delay = 0,
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.01 }}
            className={cn(
                "group relative p-8 rounded-xl",
                "bg-white dark:bg-gray-900",
                "border border-gray-100 dark:border-gray-800 hover:border-primary/30",
                "shadow-lg shadow-black/[0.02] hover:shadow-primary/5",
                "transition-all duration-500",
                "overflow-hidden"
            )}
        >
            {/* Soft background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.05] rounded-full blur-3xl group-hover:opacity-[0.1] transition-opacity`} />

            <div className="flex items-start justify-between mb-8">
                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">
                    {title}
                </span>
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                    "bg-primary/5 border border-primary/10",
                )}>
                    <Icon size={20} className="text-primary" />
                </div>
            </div>

            <div className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                {value}
            </div>

            <div className="flex items-center gap-3">
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                        trend.positive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                    )}>
                        <svg
                            className={cn("w-3 h-3", !trend.positive && "rotate-180")}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {trend.value}
                    </div>
                )}

                {description && (
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{description}</p>
                )}
            </div>
        </motion.div>
    );
}
