"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    FileText, Clock, Settings, Zap, Users, BarChart3,
    ArrowRight, Download, Layers, Scissors, Minimize2,
    Lock, Globe, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const quickActions = [
    { label: "PDF to Word", href: "/tools/pdf-to-word", icon: FileText, color: "from-blue-500 to-blue-700" },
    { label: "Merge PDF", href: "/tools/merge-pdf", icon: Layers, color: "from-green-500 to-green-700" },
    { label: "Compress PDF", href: "/tools/compress-pdf", icon: Minimize2, color: "from-yellow-500 to-yellow-700" },
    { label: "Split PDF", href: "/tools/split-pdf", icon: Scissors, color: "from-orange-500 to-orange-700" },
    { label: "Protect PDF", href: "/tools/protect-pdf", icon: Lock, color: "from-red-500 to-red-700" },
    { label: "Web to PDF", href: "/tools/web-to-pdf", icon: Globe, color: "from-sky-500 to-sky-700" },
];

const mockHistory = [
    { id: 1, filename: "Report_Q4_2025.pdf", tool: "Compress PDF", date: "27 Feb 2026", size: "2.4 MB", status: "success" },
    { id: 2, filename: "Contract_Draft.docx", tool: "Word to PDF", date: "26 Feb 2026", size: "856 KB", status: "success" },
    { id: 3, filename: "Invoice_Jan.pdf", tool: "PDF to Word", date: "26 Feb 2026", size: "1.1 MB", status: "success" },
    { id: 4, filename: "Presentation.pdf", tool: "Split PDF", date: "25 Feb 2026", size: "5.2 MB", status: "failed" },
    { id: 5, filename: "Scanned_Doc.pdf", tool: "OCR PDF", date: "25 Feb 2026", size: "3.7 MB", status: "success" },
    { id: 6, filename: "merged_output.pdf", tool: "Merge PDF", date: "24 Feb 2026", size: "7.8 MB", status: "success" },
];

const statCards = [
    { label: "Total Conversions", value: "248", icon: BarChart3, change: "+12 this week", color: "text-blue-400" },
    { label: "Files Processed", value: "1.2 GB", icon: FileText, change: "+340 MB today", color: "text-purple-400" },
    { label: "Success Rate", value: "97.5%", icon: CheckCircle2, change: "Excellent", color: "text-green-400" },
    { label: "Tools Used", value: "11", icon: Zap, change: "out of 17", color: "text-orange-400" },
];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-semibold text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-foreground">
                            Welcome back, <span className="text-primary">{session?.user?.name?.split(" ")[0] ?? "User"}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1 font-medium">Here's an overview of your conversion activity.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <Link href="/tools">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">
                                <Zap className="w-4 h-4" /> Convert File
                            </button>
                        </Link>
                        <Link href="/dashboard/settings">
                            <button className="p-2.5 bg-secondary border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors shadow-sm">
                                <Settings className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                                <span className="text-xs text-muted-foreground font-semibold">{stat.change}</span>
                            </div>
                            <div className="text-2xl font-black text-foreground mb-1">{stat.value}</div>
                            <div className="text-xs text-muted-foreground/80 font-bold uppercase tracking-wider">{stat.label}</div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-foreground">Quick Actions</h2>
                    <Link href="/" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        All Tools <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.href} href={action.href}>
                                <div className="group bg-card border border-border rounded-xl p-4 text-center hover:border-primary/50 hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-2`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-bold leading-tight">{action.label}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* Recent Conversions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-foreground">Recent Conversions</h2>
                    <Link href="/dashboard/transactions" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-secondary/30">
                                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">File</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Tool</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Size</th>
                                    <th className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {mockHistory.map((item, i) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="hover:bg-secondary/20 transition-colors"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-secondary border border-border rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="text-foreground text-sm font-bold truncate max-w-[120px]">{item.filename}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-muted-foreground font-semibold text-sm">{item.tool}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-muted-foreground font-medium text-sm flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />{item.date}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-muted-foreground font-medium text-sm">{item.size}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            {item.status === "success" ? (
                                                <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                                                    <CheckCircle2 className="w-3 h-3" /> Done
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
                                                    <XCircle className="w-3 h-3" /> Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.status === "success" && (
                                                <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}