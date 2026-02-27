"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm">
                        <Lock className="w-4 h-4" /> Privacy-First Architecture
                    </div>
                    <h1 className="text-5xl font-black">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground">Last updated: February 27, 2026</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-card border rounded-3xl p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold">No Data Storage</h3>
                        <p className="text-xs text-muted-foreground">Files are processed in-memory and never stored on our servers.</p>
                    </div>
                    <div className="bg-card border rounded-3xl p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold">End-to-End Local</h3>
                        <p className="text-xs text-muted-foreground">Your raw data stays in your browser. We only see anonymized usage stats.</p>
                    </div>
                    <div className="bg-card border rounded-3xl p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold">Zero Tracking</h3>
                        <p className="text-xs text-muted-foreground">We don&apos;t use third-party tracking cookies or sell your profile.</p>
                    </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                    <h2 className="text-foreground font-black text-3xl">1. Information We Collect</h2>
                    <p>
                        ConvertHub is designed to be a Zero-Knowledge platform. For standard conversion tools,
                        we do not collect any content you upload. If you create an account, we store:
                    </p>
                    <ul>
                        <li>Email address for authentication.</li>
                        <li>Subscription status and transaction history.</li>
                        <li>Anonymized tool usage stats (e.g., &quot;Markdown converted 5 times&quot;).</li>
                    </ul>

                    <h2 className="text-foreground font-black text-3xl">2. How We Process Files</h2>
                    <p>
                        Unlike traditional SaaS converters, our logic runs locally using Web Workers and
                        client-side libraries like `jspdf` and `mermaid.js`. This means your sensitive documentation
                        never crosses the network until you decide to download the result.
                    </p>

                    <h2 className="text-foreground font-black text-3xl">3. Payments</h2>
                    <p>
                        Payment processing is handled manually via PayPal or local bank transfers.
                        We do not store credit card numbers on our infrastructure.
                    </p>

                    <h2 className="text-foreground font-black text-3xl">4. Your Rights</h2>
                    <p>
                        You have the right to request deletion of your account at any time.
                        Simply contact our support team to purge your association with our service.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
