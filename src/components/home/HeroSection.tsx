"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Search, FileText, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const tools = [
    { name: "PDF to Word", href: "/tools/pdf-to-word" },
    { name: "Word to PDF", href: "/tools/word-to-pdf" },
    { name: "Compress PDF", href: "/tools/compress-pdf" },
    { name: "Merge PDF", href: "/tools/merge-pdf" },
    { name: "Split PDF", href: "/tools/split-pdf" },
    { name: "Image to PDF", href: "/tools/image-to-pdf" },
    { name: "OCR PDF", href: "/tools/ocr-pdf" },
    { name: "Protect PDF", href: "/tools/protect-pdf" },
    { name: "Unlock PDF", href: "/tools/unlock-pdf" },
    { name: "Watermark PDF", href: "/tools/watermark-pdf" },
    { name: "Markdown to PDF", href: "/tools/markdown-to-pdf" },
    { name: "Web to PDF", href: "/tools/web-to-pdf" },
    { name: "PDF to Image", href: "/tools/pdf-to-image" },
    { name: "Organize PDF", href: "/tools/organize-pdf" },
    { name: "Repair PDF", href: "/tools/repair-pdf" },
    { name: "Page Numbers", href: "/tools/page-numbers" },
    { name: "Markdown to Graph", href: "/tools/markdown-to-graph" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, target]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection() {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<typeof tools>([]);
    const router = useRouter();

    useEffect(() => {
        if (search.trim() === "") {
            setSuggestions([]);
            return;
        }
        const filtered = tools.filter((t) =>
            t.name.toLowerCase().includes(search.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
    }, [search]);

    const handleSelect = (href: string) => {
        setSearch("");
        setSuggestions([]);
        router.push(href);
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[160px] -z-10" />

            <div className="max-w-5xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold text-sm mb-8 rounded-full border border-primary/20"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>17 Professional Conversion Tools</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
                >
                    Convert Documents
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Instantly & Free
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    PDF, Word, Image, Markdown — convert, compress, merge, split & protect your files with professional-grade tools. No installation needed.
                </motion.p>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative max-w-lg mx-auto mb-10"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari tool... (PDF to Word, Compress, Merge...)"
                            className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        />
                    </div>
                    {suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                            {suggestions.map((s) => (
                                <button
                                    key={s.href}
                                    onClick={() => handleSelect(s.href)}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors text-sm"
                                >
                                    <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    {s.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link href="#tools">
                        <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105">
                            <Zap className="w-5 h-5" />
                            Explore All Tools
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                    <Link href="/pricing">
                        <button className="flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-2xl border border-gray-700 hover:border-gray-500 transition-all">
                            <Shield className="w-5 h-5" />
                            View Pricing
                        </button>
                    </Link>
                </motion.div>

                {/* Animated Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                >
                    {[
                        { icon: FileText, label: "Files Converted", value: 250000, suffix: "+" },
                        { icon: Zap, label: "Tools Available", value: 17, suffix: "" },
                        { icon: Users, label: "Happy Users", value: 12000, suffix: "+" },
                        { icon: Shield, label: "Uptime", value: 99, suffix: "%" },
                    ].map(({ icon: Icon, label, value, suffix }) => (
                        <div
                            key={label}
                            className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 backdrop-blur-sm"
                        >
                            <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">
                                <AnimatedCounter target={value} suffix={suffix} />
                            </div>
                            <div className="text-gray-500 text-xs mt-1">{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}