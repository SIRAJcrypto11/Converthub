"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Crown, Building2, Flame, DollarSign, Wallet, ArrowRight, ShieldCheck, ZapIcon, Globe2, Sparkles, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

const comparisonFeatures = [
    { name: "Access to all tools", free: true, pro: true, biz: true },
    { name: "Bulk document processing", free: "Limited", pro: "Unlimited", biz: "Unlimited" },
    { name: "Max Filesize per task", free: "25 MB", pro: "4 GB", biz: "Custom" },
    { name: "Concurrent tasks", free: "1", pro: "10", biz: "Unlimited" },
    { name: "No Advertisements", free: false, pro: true, biz: true },
    { name: "Customer Support", free: "Community", pro: "Priority", biz: "Dedicated Account Manager" },
    { name: "Custom API Integration", free: false, pro: false, biz: true },
    { name: "AI Diagram Credits (Monthly)", free: "5", pro: "500", biz: "Unlimited" },
    { name: "Digital Signatures", free: false, pro: true, biz: true },
];

export default function PricingPage() {
    const { data: session } = useSession();
    const [currency, setCurrency] = useState<"IDR" | "USD">("IDR"); // Default to IDR as requested
    const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("yearly");

    // Prices (Cheaper than iLovePDF)
    const prices = {
        IDR: {
            pro: { monthly: 49000, yearly: 24500 },
            biz: { monthly: 299000, yearly: 199000 },
        },
        USD: {
            pro: { monthly: 3.15, yearly: 1.58 },
            biz: { monthly: 19.99, yearly: 13.99 },
        }
    };

    const getPrice = (plan: "pro" | "biz") => {
        const p = prices[currency][plan][billingInterval];
        if (currency === "IDR") return `Rp ${p.toLocaleString('id-ID')}`;
        return `$${p.toFixed(2)}`;
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
            {/* Hero & Toggles */}
            <div className="text-center mb-20 space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full font-black text-[10px] uppercase tracking-widest border border-primary/20"
                >
                    <Crown className="w-3 h-3" /> The Most Affordable Premium Hub
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none italic">
                    Power features, <br className="hidden md:block" /> smarter prices.
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    Industry-leading document processing at a fraction of the cost.
                    Simple, transparent, and always client-side.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                    {/* Interval Toggle */}
                    <div className="bg-secondary/40 p-1.5 rounded-2xl border flex items-center gap-1 shadow-inner">
                        <button
                            onClick={() => setBillingInterval("monthly")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                billingInterval === "monthly" ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval("yearly")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all relative group",
                                billingInterval === "yearly" ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Yearly
                            <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full shadow-lg border border-white/20 animate-pulse"> -50% </span>
                        </button>
                    </div>

                    {/* Currency Toggle */}
                    <div className="bg-secondary/40 p-1.5 rounded-2xl border flex items-center gap-1 shadow-inner">
                        <button
                            onClick={() => setCurrency("USD")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                currency === "USD" ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            USD ($)
                        </button>
                        <button
                            onClick={() => setCurrency("IDR")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all",
                                currency === "IDR" ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            IDR (Rp)
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                {/* Free Tier */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-12 rounded-[3.5rem] border shadow-2xl space-y-8 flex flex-col hover:border-primary/20 transition-all"
                >
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary group">
                            <ZapIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight pt-4">Free Plan</h3>
                        <p className="text-muted-foreground text-sm font-medium">Casual tools for personal one-off projects.</p>
                    </div>

                    <div className="text-5xl font-black italic">
                        Rp 0 <span className="text-sm font-bold text-muted-foreground not-italic uppercase tracking-widest">/ forever</span>
                    </div>

                    <ul className="space-y-4 flex-grow pt-4">
                        {[
                            "Essential transformation tools",
                            "Up to 25MB processing",
                            "Standard processing queue",
                            "Browser-based local security",
                            "5 AI Diagram credits",
                        ].map((f) => (
                            <li key={f} className="flex items-center gap-3 text-sm font-bold opacity-80">
                                <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>

                    <Link href="/signup" className="block transform transition-all active:scale-95">
                        <button className="w-full py-6 bg-secondary text-primary font-black rounded-3xl hover:bg-primary hover:text-white border-2 border-transparent transition-all shadow-xl">
                            Start Computing
                        </button>
                    </Link>
                </motion.div>

                {/* Premium Tier */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 rounded-[4rem] border-4 border-primary/50 shadow-[0_32px_128px_-16px_rgba(59,130,246,0.2)] space-y-8 flex flex-col relative scale-105 z-10 bg-background"
                >
                    <div className="absolute top-0 right-12 transform -translate-y-1/2 px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full shadow-2xl border-2 border-white/10 z-20">
                        Recommend
                    </div>

                    <div className="space-y-2">
                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 group">
                            <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                        </div>
                        <h3 className="text-4xl font-black tracking-tight pt-4">Premium</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">The professional standard for high-performance conversion.</p>
                    </div>

                    <div className="space-y-1">
                        <div className="text-6xl font-black italic text-primary">
                            {getPrice("pro")}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
                            {billingInterval === "yearly" ? "Billed annually" : "Billed monthly"}
                        </div>
                    </div>

                    <ul className="space-y-5 flex-grow pt-4">
                        {[
                            "Unlimited processing power",
                            "Up to 4GB huge file uploads",
                            "Instant processing (Priority #1)",
                            "No advertisements forever",
                            "500 AI Diagram credits/mo",
                            "Premium digital signatures",
                        ].map((f) => (
                            <li key={f} className="flex items-center gap-4 text-sm font-extrabold">
                                <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3" />
                                </div>
                                {f}
                            </li>
                        ))}
                    </ul>

                    <Link href={`/checkout?plan=pro&interval=${billingInterval}&currency=${currency}`} className="block transform transition-all active:scale-95">
                        <button className="w-full py-6 bg-primary text-white font-black rounded-[2rem] hover:shadow-2xl hover:shadow-primary/30 transition-all text-xl shadow-primary/10 shadow-lg">
                            Go Premium Now
                        </button>
                    </Link>
                </motion.div>

                {/* Business Tier */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-12 rounded-[3.5rem] border shadow-2xl space-y-8 flex flex-col hover:border-purple-500/20 transition-all opacity-90 hover:opacity-100"
                >
                    <div className="space-y-2">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center group">
                            <Building2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight pt-4">Business</h3>
                        <p className="text-muted-foreground text-sm font-medium">Scalable automation for growing organizations.</p>
                    </div>

                    <div className="space-y-1">
                        <div className="text-5xl font-black italic text-purple-600">
                            {getPrice("biz")}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">
                            Per 5-User Cluster
                        </div>
                    </div>

                    <ul className="space-y-4 flex-grow pt-4">
                        {[
                            "Everything in Premium",
                            "Platform API integration",
                            "SSO & Security controls",
                            "Unlimited AI intelligence",
                            "Team collaboration suite",
                            "Dedicated account engineer",
                        ].map((f) => (
                            <li key={f} className="flex items-center gap-3 text-sm font-bold opacity-80">
                                <Check className="w-4 h-4 text-purple-500 shrink-0" /> {f}
                            </li>
                        ))}
                    </ul>

                    <Link href="/contact" className="block transform transition-all active:scale-95">
                        <button className="w-full py-6 bg-secondary text-foreground font-black rounded-3xl hover:bg-purple-600 hover:text-white border-2 border-transparent transition-all shadow-xl">
                            Deploy Enterprise
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* Feature Comparison Table */}
            <section className="mt-32 space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black tracking-tight italic">Compare Engines</h2>
                    <p className="text-muted-foreground font-medium">Detailed breakdown of cross-tier capabilities.</p>
                </div>

                <div className="overflow-x-auto glass-card rounded-[3rem] border shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b transition-colors bg-secondary/20">
                                <th className="p-8 font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Functional Features</th>
                                <th className="p-8 font-black text-center text-primary">Free</th>
                                <th className="p-8 font-black text-center text-primary relative">
                                    Premium
                                    <span className="block text-[8px] uppercase tracking-widest text-muted-foreground mt-1 underline decoration-primary/30 underline-offset-4 font-black">Unlimited Power</span>
                                </th>
                                <th className="p-8 font-black text-center text-purple-600">Business</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonFeatures.map((f, i) => (
                                <tr key={f.name} className={cn("border-b hover:bg-secondary/10 transition-colors", i % 2 === 0 ? "" : "bg-primary/[0.02]")}>
                                    <td className="p-8 font-black text-sm">{f.name}</td>
                                    <td className="p-8 text-center text-sm font-bold">
                                        {typeof f.free === "boolean" ? (f.free ? <Check className="w-5 h-5 mx-auto text-emerald-500" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/30" />) : f.free}
                                    </td>
                                    <td className="p-8 text-center text-sm font-black text-primary">
                                        {typeof f.pro === "boolean" ? (f.pro ? <Check className="w-6 h-6 mx-auto" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/30" />) : f.pro}
                                    </td>
                                    <td className="p-8 text-center text-sm font-bold text-purple-600/70">
                                        {typeof f.biz === "boolean" ? (f.biz ? <Check className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto text-muted-foreground/30" />) : f.biz}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Bottom CTA */}
            <div className="mt-32 p-16 rounded-[4rem] bg-primary relative overflow-hidden shadow-[0_48px_128px_-16px_rgba(59,130,246,0.5)]">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none">Ready to automate?</h2>
                        <p className="text-white/80 text-lg font-bold">Join 50,000+ professionals worldwide using ConvertHub to dominate their documentation workflow.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Link href="/signup">
                            <button className="px-10 py-5 bg-white text-primary font-black rounded-2xl hover:scale-105 transition-transform shadow-2xl active:scale-95">Get Started Free</button>
                        </Link>
                        <Link href="/contact">
                            <button className="px-10 py-5 bg-primary border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition-all active:scale-95">View Enterprise</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
