"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    Settings,
    CreditCard,
    BarChart3,
    Rocket,
    ShieldCheck,
    Zap,
    Users,
    Database,
    ShieldAlert,
    ArrowRightLeft,
    DollarSign
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState({ users: "12,482", revenue: "$0", load: "24%" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const fetchDashboardData = async () => {
        try {
            const txRes = await fetch("/api/transactions");
            const txData = await txRes.json();
            if (Array.isArray(txData)) {
                setTransactions(txData);

                if (session?.user?.role === "OWNER" || session?.user?.role === "ADMIN") {
                    const totalRevenue = txData
                        .filter((t: any) => t.status === "SUCCESS")
                        .reduce((acc: number, t: any) => acc + t.amount, 0);

                    setStats(prev => ({
                        ...prev,
                        revenue: `$${totalRevenue.toLocaleString()}`
                    }));
                }
            }
        } catch (error) {
            console.error("DASHBOARD_FETCH_ERROR", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user && (status === "authenticated")) {
            fetchDashboardData();
        }
    }, [session, status]);

    const handleVerify = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "SUCCESS" }),
            });
            if (res.ok) {
                fetchDashboardData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const role = session?.user?.role || "USER";

    const activities = [
        { title: "Dashboard ready for production", time: "Just now", icon: Zap, color: "text-amber-500" },
    ];

    const adminStats = [
        { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-500" },
        { label: "Revenue", value: stats.revenue, icon: DollarSign, color: "text-emerald-500" },
        { label: "System Load", value: stats.load, icon: Database, color: "text-amber-500" },
    ];

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-background/50">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 rounded-3xl border shadow-xl flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                            <span className="text-2xl font-bold text-primary">
                                {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
                            </span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">{session?.user?.name || "Premium User"}</h2>
                            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3 h-3" />
                            {role === "OWNER" ? "System Owner" : role === "ADMIN" ? "Admin Support" : "Pro Member"}
                        </div>
                    </div>

                    <nav className="glass-card p-2 rounded-3xl border shadow-lg space-y-1 font-jakarta">
                        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-2xl bg-secondary text-primary font-bold transition-all">
                            <BarChart3 className="w-5 h-5" />
                            Overview
                        </Link>

                        {(role === "ADMIN" || role === "OWNER") && (
                            <>
                                <Link href="/dashboard/transactions" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                                    <ArrowRightLeft className="w-5 h-5" />
                                    Transactions
                                </Link>
                                <Link href="/dashboard/users" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                                    <Users className="w-5 h-5" />
                                    User List
                                </Link>
                            </>
                        )}

                        {role === "OWNER" && (
                            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                                <ShieldAlert className="w-5 h-5" />
                                System Config
                            </Link>
                        )}

                        <Link href="/pricing" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                            <CreditCard className="w-5 h-5" />
                            Subscription
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all">
                            <Settings className="w-5 h-5" />
                            Settings
                        </Link>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8 font-jakarta">
                    {/* Welcome Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                            <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your files.</p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
                        >
                            <Rocket className="w-4 h-4" />
                            New Conversion
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(role === "OWNER" || role === "ADMIN") ? (
                            adminStats.map((stat, idx) => (
                                <div key={idx} className="glass-card p-6 rounded-3xl border shadow-lg bg-gradient-to-br from-white/50 to-primary/5">
                                    <div className="text-muted-foreground text-sm font-medium mb-1 flex items-center justify-between">
                                        {stat.label}
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="glass-card p-6 rounded-3xl border shadow-lg bg-gradient-to-br from-white/50 to-primary/5">
                                    <div className="text-muted-foreground text-sm font-medium mb-1">Total Conversions</div>
                                    <div className="text-3xl font-bold">0</div>
                                    <div className="mt-4 text-[10px] text-emerald-500 font-bold bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full">
                                        New Account
                                    </div>
                                </div>
                                <div className="glass-card p-6 rounded-3xl border shadow-lg">
                                    <div className="text-muted-foreground text-sm font-medium mb-1">Storage Used</div>
                                    <div className="text-3xl font-bold">0 MB</div>
                                    <div className="mt-2 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[0%]" />
                                    </div>
                                </div>
                                <div className="glass-card p-6 rounded-3xl border shadow-lg">
                                    <div className="text-muted-foreground text-sm font-medium mb-1">Plan Limit</div>
                                    <div className="text-3xl font-bold">Pro</div>
                                    <p className="mt-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                        Unlimited for early adopters
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Role specific content */}
                    {(role === "OWNER" || role === "ADMIN") && (
                        <div className="glass-card p-8 rounded-[32px] border border-primary/20 bg-primary/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold">Pending verifications</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase text-muted-foreground border-b uppercase tracking-widest font-bold">
                                        <tr>
                                            <th className="pb-4">User</th>
                                            <th className="pb-4">Plan</th>
                                            <th className="pb-4">Method</th>
                                            <th className="pb-4">Amount</th>
                                            <th className="pb-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {transactions.filter(t => t.status === "PENDING").length === 0 ? (
                                            <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No pending verifications</td></tr>
                                        ) : (
                                            transactions.filter(t => t.status === "PENDING").map((tx) => (
                                                <tr key={tx.id} className="group">
                                                    <td className="py-4 font-medium">{tx.user?.email || "Unknown"}</td>
                                                    <td className="py-4">{tx.planName}</td>
                                                    <td className="py-4">{tx.paymentMethod}</td>
                                                    <td className="py-4 font-bold text-primary italic">
                                                        {tx.currency === "USD" ? `$${tx.amount}` : `Rp${tx.amount.toLocaleString()}`}
                                                    </td>
                                                    <td className="py-4">
                                                        <button
                                                            onClick={() => handleVerify(tx.id)}
                                                            className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95"
                                                        >
                                                            Verify
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Recent Activity</h3>
                            <Link href="/dashboard/transactions" className="text-primary text-sm font-bold hover:underline">View All</Link>
                        </div>
                        <div className="glass-card rounded-[32px] border shadow-xl divide-y divide-border overflow-hidden">
                            {activities.map((activity, idx) => (
                                <div key={idx} className="p-5 flex items-center justify-between group hover:bg-secondary/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-secondary ${activity.color}`}>
                                            <activity.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{activity.title}</h4>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <Clock className="w-3 h-3" />
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-secondary rounded-xl transition-all">
                                        <FileText className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
