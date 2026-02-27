"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, DollarSign, Wallet, CheckCircle2, Info, Copy, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { PLANS, getPaymentInstructions } from "@/lib/payments";
import { useState, Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    const planId = searchParams.get("plan");
    const currency = (searchParams.get("currency") as "USD" | "IDR") || "USD";
    const plan = PLANS.find(p => p.id === planId) || PLANS[1]; // Default to Pro

    const [copied, setCopied] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const instructions = getPaymentInstructions(currency, plan);

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planName: plan.name,
                    amount: instructions.amount,
                    currency: instructions.currency,
                    paymentMethod: instructions.method,
                }),
            });
            if (res.ok) {
                router.push("/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error(error);
            router.push("/dashboard");
        } finally {
            setIsConfirming(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!session) {
        router.push("/login?callbackUrl=/checkout");
        return null;
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-background relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to pricing
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-jakarta">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 rounded-[2rem] border shadow-xl space-y-6"
                    >
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            Order Summary
                        </h2>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Plan</span>
                                <span className="font-bold">{plan.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Billing Cycle</span>
                                <span className="font-bold">Monthly</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Currency</span>
                                <span className="font-bold">{currency}</span>
                            </div>
                            <div className="pt-6 border-t flex justify-between items-center">
                                <span className="text-lg font-bold">Total Due</span>
                                <span className="text-2xl font-black text-primary">
                                    {currency === "USD" ? `$${plan.priceUSD}` : `Rp${plan.priceIDR.toLocaleString('id-ID')}`}
                                </span>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 border border-primary/10">
                            <Zap className="w-5 h-5 text-primary shrink-0" />
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Unlock unlimited conversions, priority processing, and high-res graph exports immediately after payment verification.
                            </p>
                        </div>
                    </motion.div>

                    {/* Payment Instructions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 rounded-[2rem] border shadow-xl space-y-6"
                    >
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {currency === "USD" ? <DollarSign className="w-5 h-5 text-primary" /> : <Wallet className="w-5 h-5 text-primary" />}
                            Payment Details
                        </h2>

                        <div className="space-y-6 pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Payment Method</label>
                                <div className="w-full bg-secondary/50 border rounded-2xl py-3 px-4 font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    {instructions.method}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Instructions</label>
                                <div className="relative group">
                                    <div className="w-full bg-secondary/50 border rounded-2xl py-4 px-4 font-medium text-sm leading-relaxed pr-12">
                                        {instructions.details}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(instructions.details)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-background/80 rounded-xl transition-all"
                                    >
                                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-amber-500/5 p-4 rounded-2xl flex gap-3 border border-amber-500/10">
                                <Info className="w-5 h-5 text-amber-500 shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-tight">Manual Verification Required</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        Please upload your proof of payment or contact @support via Telegram after transfer. Verification usually takes 5-30 mins.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={isConfirming}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isConfirming ? <Loader2 className="w-5 h-5 animate-spin" /> : "Go to Dashboard & Confirm"}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* FAQ/Help */}
                <div className="text-center pt-8">
                    <p className="text-sm text-muted-foreground">
                        Having trouble? <Link href="/about" className="text-primary font-bold hover:underline">Contact our 24/7 support team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
