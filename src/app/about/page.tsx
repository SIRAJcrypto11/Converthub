"use client";

import { motion } from "framer-motion";
import { FileText, Shield, Zap, Globe, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const stats = [
        { label: "Files Processed", value: "10M+" },
        { label: "Happy Users", value: "500K+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Countries", value: "150+" },
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 font-jakarta">
            <div className="max-w-4xl mx-auto space-y-24">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4"
                    >
                        <Shield className="w-4 h-4" />
                        Empowering Digital Workflows
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent"
                    >
                        About ConvertHub
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        We&apos;re building the next generation of file transformation tools.
                        Fast, secure, and processing 100% in your browser.
                    </motion.p>
                </section>

                {/* Vision & Values */}
                <section id="how-it-works" className="grid md:grid-cols-3 gap-8">
                    <div className="glass-card p-8 rounded-3xl border space-y-4 shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Privacy First</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Your files never leave your device. All processing happens locally in your browser to ensure maximum data sovereignty.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-3xl border space-y-4 shadow-xl shadow-amber-500/5 hover:shadow-amber-500/10 transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Lightning Fast</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Engineered for speed. Convert documents and images in milliseconds without the lag of server-side wait times.
                        </p>
                    </div>
                    <div className="glass-card p-8 rounded-3xl border space-y-4 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold">Open Standards</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Supporting Markdown, Mermaid, and industry-standard PDF formats for maximum cross-platform compatibility.
                        </p>
                    </div>
                </section>

                {/* Stats */}
                <section className="bg-primary/5 rounded-[40px] p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border shadow-inner">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="text-4xl font-black text-primary">{stat.value}</div>
                            <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </section>

                {/* Story Section */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-extrabold text-center tracking-tight">Our Mission</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed text-center">
                        <p className="mb-6">
                            Founded in 2024, ConvertHub was born out of a simple frustration: file converters were too slow,
                            cluttered with ads, and raised significant privacy concerns. We envisioned a tool that
                            could handle complex transformations like **Markdown-to-PDF** and **Markdown-to-Graph**
                            without ever compromising the user&apos;s data.
                        </p>
                        <p>
                            By leveraging modern web technologies like WebAssembly and client-side PDF rendering,
                            we&apos;ve eliminated the need for server-side processing. This allows for a faster,
                            safer, and more cost-effective solution for everyone from individual developers
                            to large enterprises.
                        </p>
                    </div>
                </section>

                {/* Contact/Social */}
                <section id="contact" className="text-center space-y-10 pt-16 border-t border-secondary/50">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight">Connect with the Team</h3>
                        <p className="text-muted-foreground">Stay updated on our latest releases and features</p>
                    </div>
                    <div className="flex justify-center gap-8">
                        <Link href="https://github.com/snishop" target="_blank" className="p-4 rounded-3xl bg-secondary hover:bg-primary hover:text-white transition-all hover:-translate-y-2 shadow-lg">
                            <Github className="w-8 h-8" />
                        </Link>
                        <Link href="https://twitter.com/snishop" target="_blank" className="p-4 rounded-3xl bg-secondary hover:bg-sky-500 hover:text-white transition-all hover:-translate-y-2 shadow-lg">
                            <Twitter className="w-8 h-8" />
                        </Link>
                        <Link href="https://linkedin.com/company/snishop" target="_blank" className="p-4 rounded-3xl bg-secondary hover:bg-blue-700 hover:text-white transition-all hover:-translate-y-2 shadow-lg">
                            <Linkedin className="w-8 h-8" />
                        </Link>
                    </div>
                    <div className="pt-8">
                        <Link href="mailto:support@converthub.id" className="text-primary font-bold hover:underline decoration-2 underline-offset-8">
                            support@converthub.id
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
