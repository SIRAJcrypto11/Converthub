"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Rocket, Crown, LogOut, User as UserIcon, FileDown, Layers, Scissors, Minimize2, Image, FileText, FileCode, BarChart3, Layout, Hash, Lock, Unlock as UnlockIcon, Wrench, Stamp, ScanText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const tools = [
    { name: "Organize PDF", href: "/tools/organize-pdf", icon: Layout },
    { name: "Protect PDF", href: "/tools/protect-pdf", icon: Lock },
    { name: "Unlock PDF", href: "/tools/unlock-pdf", icon: UnlockIcon },
    { name: "Repair PDF", href: "/tools/repair-pdf", icon: Wrench },
    { name: "Watermark", href: "/tools/watermark-pdf", icon: Stamp },
    { name: "OCR PDF", href: "/tools/ocr-pdf", icon: ScanText },
    { name: "PDF to Word", href: "/tools/pdf-to-word", icon: FileText },
    { name: "HTML to PDF", href: "/tools/web-to-pdf", icon: Globe },
    { name: "Page Numbers", href: "/tools/page-numbers", icon: Hash },
    { name: "Markdown to PDF", href: "/tools/markdown-to-pdf", icon: FileText },
    { name: "Markdown to Graph", href: "/tools/markdown-to-graph", icon: BarChart3 },
    { name: "Merge PDF", href: "/tools/merge-pdf", icon: Layers },
    { name: "Split PDF", href: "/tools/split-pdf", icon: Scissors },
    { name: "Compress PDF", href: "/tools/compress-pdf", icon: Minimize2 },
    { name: "PDF to Image", href: "/tools/pdf-to-image", icon: Image },
    { name: "Image to PDF", href: "/tools/image-to-pdf", icon: FileDown },
    { name: "Word to PDF", href: "/tools/word-to-pdf", icon: FileCode },
];

export default function Header() {
    const { data: session, status } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                isScrolled
                    ? "bg-background/80 backdrop-blur-lg border-b shadow-sm py-3"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    <div className="relative group">
                        <button className="flex items-center gap-1 font-bold text-sm tracking-tight hover:text-primary transition-colors">
                            TRANSFORM <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                        </button>
                        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <div className="bg-popover border rounded-[2rem] shadow-2xl p-3 min-w-[280px] grid gap-1">
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.name}
                                        href={tool.href}
                                        className="px-4 py-3 rounded-2xl hover:bg-secondary flex items-center justify-between group/item transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <tool.icon className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                                            <span className="text-sm font-semibold">{tool.name}</span>
                                        </div>
                                        <Rocket className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:-translate-y-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Link href="/pricing" className="text-sm font-bold tracking-tight hover:text-primary transition-colors uppercase">Pricing</Link>
                    <Link href="/about" className="text-sm font-bold tracking-tight hover:text-primary transition-colors uppercase">About</Link>
                    <Link href="/contact" className="text-sm font-bold tracking-tight hover:text-primary transition-colors uppercase">Contact</Link>
                </nav>

                <div className="hidden lg:flex items-center gap-4">
                    {status === "authenticated" ? (
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-primary hover:text-white rounded-full border transition-all active:scale-95 group shadow-sm">
                                <UserIcon className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                                <span className="font-extrabold text-[11px] uppercase tracking-wider">
                                    {session?.user?.role === "OWNER" ? "Owner Access" : session?.user?.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
                                </span>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="p-2.5 text-muted-foreground hover:text-destructive transition-colors group"
                                title="Secure Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link href="/login" className="px-5 py-2.5 font-bold text-sm tracking-tight hover:text-primary transition-colors hover:bg-secondary rounded-full">Log In</Link>
                            <Link
                                href="/signup"
                                className="px-7 py-3 bg-primary text-primary-foreground rounded-full font-black text-sm tracking-tight hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Crown className="w-4 h-4" />
                                JOIN NOW
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2.5 hover:bg-secondary rounded-2xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b p-8 shadow-2xl overflow-y-auto max-h-[80vh]"
                    >
                        <div className="grid gap-6">
                            <div className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-2">Transformation Engines</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {tools.map((tool) => (
                                    <Link
                                        key={tool.name}
                                        href={tool.href}
                                        className="text-sm font-bold p-4 bg-secondary/50 rounded-2xl flex items-center gap-3 active:bg-primary active:text-white transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <tool.icon className="w-4 h-4" />
                                        {tool.name}
                                    </Link>
                                ))}
                            </div>
                            <hr className="border-secondary" />
                            <div className="grid gap-4">
                                <Link href="/pricing" className="text-xl font-black tracking-tight flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                                    Pricing <ChevronDown className="w-4 h-4 -rotate-90" />
                                </Link>
                                <Link href="/about" className="text-xl font-black tracking-tight flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                                    About <ChevronDown className="w-4 h-4 -rotate-90" />
                                </Link>
                                <Link href="/contact" className="text-xl font-black tracking-tight flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                                    Contact <ChevronDown className="w-4 h-4 -rotate-90" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <Link href="/login" className="px-4 py-4 text-center border-2 rounded-[1.5rem] font-black text-sm uppercase tracking-wider shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                                <Link href="/signup" className="px-4 py-4 text-center bg-primary text-primary-foreground rounded-[1.5rem] font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
