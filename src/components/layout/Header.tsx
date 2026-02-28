"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown, Menu, X, Rocket, LogOut, User as UserIcon,
    FileDown, Layers, Scissors, Minimize2, Image, FileText,
    FileCode, Layout, Hash, Lock, Unlock as UnlockIcon,
    Wrench, Stamp, ScanText, Globe, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

const toolCategories = [
    {
        label: "Convert",
        tools: [
            { name: "PDF to Word", href: "/tools/pdf-to-word", icon: FileDown },
            { name: "Word to PDF", href: "/tools/word-to-pdf", icon: FileCode },
            { name: "Image to PDF", href: "/tools/image-to-pdf", icon: Image },
            { name: "PDF to Image", href: "/tools/pdf-to-image", icon: Image },
            { name: "Markdown to PDF", href: "/tools/markdown-to-pdf", icon: FileText },
            { name: "Web to PDF", href: "/tools/web-to-pdf", icon: Globe },
            { name: "OCR PDF", href: "/tools/ocr-pdf", icon: ScanText },
            { name: "Markdown to Graph", href: "/tools/markdown-to-graph", icon: BarChart3 },
        ],
    },
    {
        label: "PDF Tools",
        tools: [
            { name: "Merge PDF", href: "/tools/merge-pdf", icon: Layers },
            { name: "Split PDF", href: "/tools/split-pdf", icon: Scissors },
            { name: "Organize PDF", href: "/tools/organize-pdf", icon: Layout },
            { name: "Page Numbers", href: "/tools/page-numbers", icon: Hash },
        ],
    },
    {
        label: "Optimize & Security",
        tools: [
            { name: "Compress PDF", href: "/tools/compress-pdf", icon: Minimize2 },
            { name: "Protect PDF", href: "/tools/protect-pdf", icon: Lock },
            { name: "Unlock PDF", href: "/tools/unlock-pdf", icon: UnlockIcon },
            { name: "Watermark PDF", href: "/tools/watermark-pdf", icon: Stamp },
            { name: "Repair PDF", href: "/tools/repair-pdf", icon: Wrench },
        ],
    },
];

export default function Header() {
    const { data: session } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-extrabold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                ConvertHub
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {/* Tools Dropdown */}
                            <div className="relative">
                                <button
                                    onMouseEnter={() => setToolsOpen(true)}
                                    onMouseLeave={() => setToolsOpen(false)}
                                    className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-primary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Tools
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", toolsOpen && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {toolsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.15 }}
                                            onMouseEnter={() => setToolsOpen(true)}
                                            onMouseLeave={() => setToolsOpen(false)}
                                            className="absolute top-full left-0 mt-1 w-[680px] bg-white border border-gray-100 rounded-2xl shadow-xl p-5 grid grid-cols-3 gap-6"
                                        >
                                            {toolCategories.map((cat) => (
                                                <div key={cat.label}>
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{cat.label}</p>
                                                    <div className="space-y-1">
                                                        {cat.tools.map((tool) => {
                                                            const Icon = tool.icon;
                                                            return (
                                                                <Link
                                                                    key={tool.href}
                                                                    href={tool.href}
                                                                    onClick={() => setToolsOpen(false)}
                                                                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg text-sm font-semibold transition-all"
                                                                >
                                                                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                                                                    {tool.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link href="/pricing" className="px-4 py-2 text-gray-600 hover:text-primary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                Pricing
                            </Link>
                            <Link href="/about" className="px-4 py-2 text-gray-600 hover:text-primary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                About
                            </Link>
                        </nav>

                        {/* Auth / User Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {session ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors text-sm shadow-sm"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                            {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                                        </div>
                                        <span className="text-gray-900 font-bold max-w-24 truncate">{session.user?.name}</span>
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 8 }}
                                                className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
                                            >
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary font-bold text-sm transition-colors"
                                                >
                                                    <UserIcon className="w-4 h-4" /> Dashboard
                                                </Link>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 font-bold text-sm w-full transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <button className="px-4 py-2 text-gray-600 hover:text-primary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                                            Log in
                                        </button>
                                    </Link>
                                    <Link href="/signup">
                                        <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                                            Get Started
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-inner"
                        >
                            <div className="px-4 py-4 space-y-1">
                                {toolCategories.map((cat) => (
                                    <div key={cat.label}>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">{cat.label}</p>
                                        {cat.tools.map((tool) => {
                                            const Icon = tool.icon;
                                            return (
                                                <Link
                                                    key={tool.href}
                                                    href={tool.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-primary hover:bg-blue-50/50 rounded-xl text-sm font-bold transition-all"
                                                >
                                                    <Icon className="w-4 h-4 text-primary" />
                                                    {tool.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ))}
                                <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
                                    {session ? (
                                        <>
                                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="w-full">
                                                <button className="w-full py-3 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl text-sm font-black transition-colors">Dashboard</button>
                                            </Link>
                                            <button onClick={() => signOut()} className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-black transition-colors">Sign Out</button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                                                <button className="w-full py-3 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-xl text-sm font-black transition-colors">Log in</button>
                                            </Link>
                                            <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full">
                                                <button className="w-full py-3 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-black shadow-lg shadow-primary/20 transition-all">Sign Up</button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Backdrop for user menu */}
            {userMenuOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                />
            )}
        </>
    );
}