"use client";

import { motion } from "framer-motion";
import { Cookie, ShieldCheck, Settings } from "lucide-react";

export default function CookiesPage() {
    return (
        <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto text-jakarta">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-extrabold text-sm uppercase tracking-tighter">
                        <Cookie className="w-4 h-4" /> Cookie Policy
                    </div>
                    <h1 className="text-5xl font-black tracking-tight">How we use cookies</h1>
                    <p className="text-xl text-muted-foreground">We value your privacy and aim for full transparency.</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-10">
                    <section className="bg-secondary/30 p-8 rounded-[2.5rem] border">
                        <h2 className="text-foreground font-black text-2xl flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-primary" /> Essential Cookies
                        </h2>
                        <p className="text-sm mt-4">
                            These are strictly necessary for the website to function. We use them for
                            authentication (NextAuth.js sessions) and to remember your currency preference (USD/IDR).
                        </p>
                    </section>

                    <section className="p-8">
                        <h2 className="text-foreground font-black text-2xl flex items-center gap-3">
                            <Settings className="w-6 h-6 text-accent" /> Preferences
                        </h2>
                        <p className="text-sm mt-4">
                            We use cookies to save your settings, such as your dark mode preference
                            and last-used conversion tool, to provide a seamless return experience.
                        </p>
                    </section>

                    <section className="p-8">
                        <h2 className="text-foreground font-black text-2xl">Third-Party Cookies</h2>
                        <p className="text-sm mt-4">
                            We minimize third-party inclusions. We do not use advertising trackers.
                            If you pay via PayPal, they may set their own functional cookies to process the transaction.
                        </p>
                    </section>

                    <section className="p-8 border-t">
                        <h2 className="text-foreground font-black text-2xl">Managing Cookies</h2>
                        <p className="text-sm mt-4">
                            You can control and/or delete cookies as you wish via your browser settings.
                            However, disabling essential cookies may prevent you from logging in or maintaining your Pro status during a session.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
