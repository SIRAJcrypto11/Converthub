"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ArrowLeft, Users, Shield, User, Mail, Search, MoreVertical, XCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Mocking data for UI verification
                setUsers([
                    { id: "u_1", name: "Siraj Nur Ihrom", email: "siraj@example.com", role: "OWNER", joined: "2026-02-20" },
                    { id: "u_2", name: "Alice Admin", email: "alice@converthub.com", role: "ADMIN", joined: "2026-02-21" },
                    { id: "u_3", name: "Bob User", email: "bob@gmail.com", role: "USER", joined: "2026-02-25" },
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const role = session?.user?.role || "USER";

    if (role !== "OWNER") {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center space-y-4">
                <XCircle className="w-16 h-16 text-destructive" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">Only the system owner can access user management.</p>
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
                    <h1 className="text-3xl font-bold tracking-tight text-jakarta">User Management</h1>
                    <p className="text-muted-foreground">Manage roles and permissions for all platform members.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-secondary/50 border rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-3xl border shadow-lg flex items-center gap-4 bg-gradient-to-br from-white/50 to-primary/5">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Total Users</div>
                        <div className="text-2xl font-black">{users.length}</div>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border shadow-lg flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Admins</div>
                        <div className="text-2xl font-black">{users.filter(u => u.role === 'ADMIN').length}</div>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-3xl border shadow-lg flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Active Today</div>
                        <div className="text-2xl font-black">12</div>
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-[32px] border shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-xs uppercase text-muted-foreground border-b tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse h-20 bg-secondary/10" />
                                ))
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs border">
                                                    {u.name?.[0] || u.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold">{u.name || "Anonymous User"}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'OWNER' ? 'bg-primary/10 text-primary' :
                                                    u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-secondary text-muted-foreground'
                                                }`}>
                                                <Shield className="w-3 h-3" />
                                                {u.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium">{u.joined}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-secondary rounded-xl transition-colors">
                                                <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                            </button>
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
