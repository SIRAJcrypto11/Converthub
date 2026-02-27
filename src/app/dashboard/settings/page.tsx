"use client";

import { useSession } from "next-auth/react";
import { ArrowLeft, Settings, ShieldAlert, Database, Globe, Lock, Save, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const role = session?.user?.role || "USER";

    const [sysInfo, setSysInfo] = useState({
        paypalEmail: "paypal@converthub.id",
        bcaAccount: "1234567890 (A/N Snishop ID)",
        maintenanceMode: false,
        apiLimit: 50000,
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate production API latency
        setTimeout(() => {
            setIsLoading(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1200);
    };

    if (role !== "OWNER") {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 max-w-2xl mx-auto space-y-8 font-jakarta">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-2 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight mb-2">Account Settings</h1>
                    <p className="text-muted-foreground text-sm">Manage your personal profile and security preferences.</p>
                </div>

                <div className="glass-card p-10 rounded-[3rem] border shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                                <input type="text" defaultValue={session?.user?.name || ""} className="w-full bg-secondary/30 border rounded-2xl py-4 px-5 font-bold focus:border-primary/50 outline-none transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email (Immutable)</label>
                                <input type="email" defaultValue={session?.user?.email || ""} className="w-full bg-secondary/50 border rounded-2xl py-4 px-5 font-bold opacity-70 cursor-not-allowed" disabled />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Update Password</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-secondary/30 border rounded-2xl py-4 px-5 focus:border-primary/50 outline-none transition-all" />
                        </div>
                    </div>

                    <button onClick={handleSave} disabled={isLoading} className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        Save Changes
                    </button>
                </div>

                <AnimatePresence>
                    {showToast && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 z-50 border border-emerald-400/20"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Settings updated successfully
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-10 font-jakarta">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-2 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Platform Engine</h1>
                    <p className="text-muted-foreground text-sm">Central command for ConvertHub production operations.</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-inner">
                    <ShieldAlert className="w-4 h-4" />
                    Owner Master Control
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Config */}
                <div className="glass-card p-10 rounded-[3rem] border shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <Globe className="w-6 h-6 text-primary" />
                        Financial Routing
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">PayPal Gateway Email</label>
                            <input
                                type="email"
                                value={sysInfo.paypalEmail}
                                onChange={(e) => setSysInfo({ ...sysInfo, paypalEmail: e.target.value })}
                                className="w-full bg-secondary/30 border rounded-2xl py-4 px-5 font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bank Transfer Payload</label>
                            <textarea
                                value={sysInfo.bcaAccount}
                                onChange={(e) => setSysInfo({ ...sysInfo, bcaAccount: e.target.value })}
                                className="w-full bg-secondary/30 border rounded-2xl py-4 px-5 font-bold focus:ring-4 focus:ring-primary/10 outline-none h-32 resize-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Infrastructure */}
                <div className="glass-card p-10 rounded-[3rem] border shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-teal-500" />
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <Database className="w-6 h-6 text-teal-500" />
                        SysOps Intelligence
                    </h2>
                    <div className="space-y-6">
                        <div className="p-6 bg-secondary/20 border-2 border-emerald-500/10 rounded-[2.5rem] space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Database Clusters</span>
                                <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase">Healthy</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-2 flex-grow bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[12%]" />
                                </div>
                                <span className="text-xs font-black">PostgreSQL</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed pt-1 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> US-East-1 AWS Region (Production)
                            </p>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-secondary/20 border rounded-[2.5rem] hover:border-primary/20 transition-all group">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Global Maintenance</div>
                                <div className="text-[10px] text-muted-foreground leading-tight">Freeze all file processing nodes</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sysInfo.maintenanceMode}
                                    onChange={(e) => setSysInfo({ ...sysInfo, maintenanceMode: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-[3rem] flex items-center gap-8 shadow-inner">
                <div className="w-14 h-14 rounded-[1.25rem] bg-destructive/10 text-destructive flex items-center justify-center shrink-0 shadow-lg">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="flex-grow">
                    <h4 className="font-extrabold text-destructive text-lg">Nuclear Reset Option</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase tracking-wider">Flush cache, reset logs, purge temporary vectors. Irreversible operation.</p>
                </div>
                <button className="px-8 py-4 border-2 border-destructive/30 text-destructive font-black text-xs rounded-2xl hover:bg-destructive hover:text-white hover:border-destructive transition-all active:scale-95">
                    Execute Purge
                </button>
            </div>

            <button onClick={handleSave} disabled={isLoading} className="w-full bg-primary text-primary-foreground py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 border-t-2 border-white/10">
                {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
                Sync Production Registry
            </button>

            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-primary text-white px-10 py-5 rounded-full font-black shadow-2xl flex items-center gap-4 z-50 border-2 border-white/20"
                    >
                        <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                        System configuration synchronized
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
