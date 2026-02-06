'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  TrendingUp,
  ShieldCheck,
  Zap as ZapIcon,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Menu,
  X,
  Lock,
  Activity,
  BarChart3,
  Users,
  Award
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [niftyPrice, setNiftyPrice] = useState<number | null>(null);
  const [niftyChange, setNiftyChange] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch NIFTY 50 index data
  useEffect(() => {
    const fetchNiftyPrice = async () => {
      try {
        const response = await fetch('/api/crypto?endpoint=nifty');
        const data = await response.json();

        if (data.error || !data.price) {
          // Use fallback values
          setNiftyPrice(22147.50);
          setNiftyChange(0.57);
          return;
        }

        setNiftyPrice(data.price);
        setNiftyChange(data.changePercent || 0);
      } catch (error) {
        console.error('Error fetching NIFTY price:', error);
        // Use fallback values
        setNiftyPrice(22147.50);
        setNiftyChange(0.57);
      }
    };

    fetchNiftyPrice();
    const interval = setInterval(fetchNiftyPrice, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setShowAuthModal(true);
    } else {
      router.push('/portfolio');
    }
  };

  const ZapLogo = () => (
    <div className="flex items-center gap-2.5 group cursor-pointer">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 blur-lg rounded-full group-hover:from-primary/50 transition-all" />
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary relative z-10 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-foreground">ZAP Finance</span>
      </div>
    </div>
  );

  const NavItem = ({ label, children }: { label: string, children?: React.ReactNode }) => {
    const isOpen = activeDropdown === label;
    return (
      <div className="relative" onMouseEnter={() => children && setActiveDropdown(label)} onMouseLeave={() => setActiveDropdown(null)}>
        <button
          className={`flex items-center gap-1.5 text-sm font-medium transition-all ${isOpen ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}
          onClick={() => children && setActiveDropdown(isOpen ? null : label)}
        >
          {label}
          {children && <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        <AnimatePresence>
          {isOpen && children && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-4 w-64 p-4 glass rounded-xl z-50 border border-white/10"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-premium bg-trading-lines selection:bg-primary/30 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 backdrop-blur-xl border-b border-white/5 bg-background/80' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <ZapLogo />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              <NavItem label="Products">
                <div className="space-y-3">
                  <Link href="/dashboard" className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg group">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform"><TrendingUp size={18} /></div>
                    <div><div className="text-sm font-medium text-foreground">Trading</div><div className="text-xs text-muted-foreground">Buy & sell assets</div></div>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg group">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><BarChart3 size={18} /></div>
                    <div><div className="text-sm font-medium text-foreground">Analytics</div><div className="text-xs text-muted-foreground">Market insights</div></div>
                  </Link>
                </div>
              </NavItem>
              <button onClick={handlePortfolioClick} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all">Portfolio</button>
              <NavItem label="Resources">
                <div className="space-y-3">
                  <Link href="/education" className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg group">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><LayoutDashboard size={18} /></div>
                    <div><div className="text-sm font-medium text-foreground">Learning Center</div><div className="text-xs text-muted-foreground">Guides & tutorials</div></div>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg group">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform"><Activity size={18} /></div>
                    <div><div className="text-sm font-medium text-foreground">Market News</div><div className="text-xs text-muted-foreground">Latest updates</div></div>
                  </Link>
                </div>
              </NavItem>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="glow-primary px-6 font-medium">
                  Get Started
                  <ChevronRight size={18} className="ml-1" />
                </Button>
              </Link>
              <button className="lg:hidden p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="initial" animate="animate" variants={stagger}>
              <motion.div variants={fadeIn} className="mb-6">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-4 py-2 rounded-full font-medium text-xs">
                  <Activity size={12} className="mr-2 inline" />
                  Trusted by 1M+ Investors
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] mb-8 tracking-tight">
                Invest smarter with <span className="text-gradient">ZAP Finance</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                The modern investment platform that helps you build wealth with confidence. Trade stocks, crypto, and more — all in one place.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-14 px-8 rounded-xl text-base font-semibold bg-primary glow-primary">
                    Start Investing
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={handlePortfolioClick} className="h-14 px-8 rounded-xl text-base font-medium border-white/10 glass">
                  View Demo
                </Button>
              </motion.div>

              <motion.div variants={fadeIn} className="mt-14 flex items-center gap-10 text-muted-foreground">
                <div className="flex flex-col"><span className="text-2xl font-bold text-foreground">₹4L Cr+</span><span className="text-sm">Assets Under Management</span></div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col"><span className="text-2xl font-bold text-foreground">12L+</span><span className="text-sm">Active Investors</span></div>
                <div className="w-px h-10 bg-white/10 hidden sm:block" />
                <div className="flex-col hidden sm:flex"><span className="text-2xl font-bold text-foreground">4.9★</span><span className="text-sm">User Rating</span></div>
              </motion.div>
            </motion.div>

            {/* Terminal Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
              <Card className="glass p-0 border-white/10 shadow-2xl overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Live Market Data</span>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className={niftyChange >= 0 ? "text-emerald-500" : "text-red-500"} />
                        <span className="text-xs font-medium text-muted-foreground">NIFTY 50</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="text-4xl font-bold text-foreground tabular-nums">
                        {niftyPrice ? niftyPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '--,---'}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${niftyChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} border-none px-3 font-medium mb-1`}>
                        {niftyChange >= 0 ? '+' : ''}{niftyChange.toFixed(2)}%
                      </Badge>
                      <div className="text-xs text-muted-foreground">Today's Change (Live)</div>
                    </div>
                  </div>

                  {/* Chart SVG */}
                  <div className="h-40 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      <defs>
                        <linearGradient id="zapGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 130 L40 120 L80 140 L120 100 L160 110 L200 70 L240 90 L280 40 L320 60 L360 20 L400 30" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M0 130 L40 120 L80 140 L120 100 L160 110 L200 70 L240 90 L280 40 L320 60 L360 20 L400 30 L400 150 L0 150 Z" fill="url(#zapGradient)" />
                      <circle cx="400" cy="30" r="5" fill="#3b82f6" />
                      <circle cx="400" cy="30" r="12" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-xs text-muted-foreground mb-1">Execution Speed</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Instant</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <div className="text-xs text-muted-foreground mb-1">Platform Uptime</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">99.99%</span>
                        <ZapIcon size={14} className="text-primary fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-bold mb-4">Why Choose ZAP Finance</motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to invest with confidence and grow your wealth.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Global Markets", desc: "Access stocks, crypto, ETFs, and more from markets around the world — all from one platform." },
              { icon: ShieldCheck, title: "Bank-Level Security", desc: "Your investments are protected with industry-leading encryption and multi-factor authentication." },
              { icon: Activity, title: "Real-Time Data", desc: "Get live market data, instant notifications, and lightning-fast trade execution." }
            ].map((item, i) => (
              <Card key={i} className="glass p-8 group border-white/5 hover:border-primary/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                  <item.icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "12L+", label: "Active Users" },
              { icon: BarChart3, value: "₹4L Cr+", label: "Trading Volume" },
              { icon: Globe, value: "150+", label: "Countries Served" },
              { icon: Award, value: "4.9/5", label: "App Store Rating" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon size={24} className="text-primary mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass p-12 md:p-20 rounded-3xl text-center border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Ready to start investing?</h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join over 1 million investors who trust ZAP Finance for their investment journey.
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="h-14 px-10 rounded-xl text-lg font-semibold bg-primary text-white glow-primary hover:scale-105 active:scale-95 transition-all">
                  Create Free Account
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <ZapLogo />
            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} ZAP Finance. All rights reserved.</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock size={14} />
              <span>Bank-level security with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] glass flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <ZapLogo />
              <button onClick={() => setIsMenuOpen(false)} className="p-2"><X size={28} /></button>
            </div>
            <div className="space-y-6 text-2xl font-semibold">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block hover:text-primary transition-colors">Products</Link>
              <button onClick={(e) => { handlePortfolioClick(e); setIsMenuOpen(false); }} className="block hover:text-primary text-left w-full">Portfolio</button>
              <Link href="/education" onClick={() => setIsMenuOpen(false)} className="block hover:text-primary transition-colors">Resources</Link>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="block hover:text-primary transition-colors">Sign In</Link>
            </div>
            <div className="mt-auto">
              <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-14 rounded-xl text-lg font-semibold">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md"
            >
              <Card className="glass border-white/10 shadow-2xl p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Lock size={32} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Sign In Required</h3>
                <p className="text-muted-foreground mb-8">
                  Please sign in to access your portfolio and account features.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/auth/login" className="w-full">
                    <Button className="w-full h-12 rounded-xl font-semibold glow-primary">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl font-medium glass">
                      Create Account
                    </Button>
                  </Link>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
