"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRightLeft, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TransactionsPage() {
    const { data: session } = useSession();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/transactions");
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user) {
            fetchTransactions();
        }
    }, [session]);

    const handleVerify = async (id: string) => {
        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "SUCCESS" }),
            });
            if (res.ok) {
                fetchTransactions();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const role = session?.user?.role || "USER";

    if (role === "USER") {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center space-y-4">
                <XCircle className="w-16 h-16 text-destructive" />
                <h1 className="text-2xl font-bold">Unauthorized</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <Link href="/dashboard" className="text-primary font-bold hover:underline">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-2 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">System Transactions</h1>
                    <p className="text-muted-foreground">Monitor and verify all user payments.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            className="bg-secondary/50 border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
                        />
                    </div>
                    <button className="p-2 bg-secondary/50 border rounded-xl hover:bg-secondary transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="glass-card rounded-[32px] border shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-xs uppercase text-muted-foreground border-b tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-8 h-16 bg-secondary/10" />
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground uppercase">{tx.id}</td>
                                        <td className="px-6 py-4 font-medium">{tx.user?.email || tx.userEmail || "—"}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                                                {tx.planName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {tx.currency === "USD" ? `$${tx.amount}` : `Rp${tx.amount.toLocaleString('id-ID')}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 font-bold text-[10px] uppercase ${tx.status === "SUCCESS" ? "text-emerald-500" : tx.status === "FAILED" ? "text-red-500" : "text-amber-500"}`}>
                                                {tx.status === "SUCCESS" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {tx.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {tx.status === "PENDING" && (
                                                <button onClick={() => handleVerify(tx.id)} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                                                    Verify
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
