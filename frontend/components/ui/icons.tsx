'use client';

import { motion } from 'framer-motion';
import {
    Shield,
    Lock,
    TrendingUp,
    Users,
    Globe,
    Wallet,
    CheckCircle,
    AlertTriangle,
    BookOpen,
    Rocket,
    Star,
    Sparkles,
    ArrowRight,
    ChevronRight,
    type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedIconProps {
    icon: LucideIcon;
    className?: string;
    gradient?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    animate?: boolean;
}

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
};

const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 44,
};

export function AnimatedIcon({
    icon: Icon,
    className,
    gradient = 'from-teal-500 to-purple-600',
    size = 'md',
    animate = true
}: AnimatedIconProps) {
    return (
        <motion.div
            whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
            className={cn(
                `${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`,
                className
            )}
        >
            <Icon size={iconSizes[size]} className="text-white" />
        </motion.div>
    );
}

// Common icon exports with gradients
export const icons = {
    Shield,
    Lock,
    TrendingUp,
    Users,
    Globe,
    Wallet,
    CheckCircle,
    AlertTriangle,
    BookOpen,
    Rocket,
    Star,
    Sparkles,
    ArrowRight,
    ChevronRight,
};

// Preset gradient combinations
export const gradients = {
    teal: 'from-teal-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-indigo-500',
    orange: 'from-orange-500 to-yellow-500',
    red: 'from-red-500 to-pink-500',
    gold: 'from-amber-400 to-orange-500',
    premium: 'from-teal-500 to-purple-600',
};
