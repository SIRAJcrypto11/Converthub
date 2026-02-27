"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate API latency
        setTimeout(() => {
            setSending(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto font-jakarta">
            <div className="grid lg:grid-cols-2 gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                            Connect
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">Get in Touch</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Have a feature request, found a bug, or need enterprise support?
                            Our team is here to help you transform your documentation.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 p-8 bg-secondary/30 rounded-[2.5rem] border hover:border-primary/20 transition-all group shadow-inner">
                            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                <Mail className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-lg">Email Us</p>
                                <p className="text-muted-foreground font-medium">hello@converthub.id</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-8 bg-secondary/30 rounded-[2.5rem] border hover:border-accent/20 transition-all group shadow-inner text-accent">
                            <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-lg">Live Chat</p>
                                <p className="text-muted-foreground font-medium">Mon-Fri, 9am - 5pm WIB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 p-8 bg-secondary/30 rounded-[2.5rem] border hover:border-purple-300 transition-all group shadow-inner">
                            <div className="w-14 h-14 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="font-black text-lg">Headquarters</p>
                                <p className="text-muted-foreground font-medium">Jakarta, Indonesia</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10 font-jakarta">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Full Name</label>
                                <input required className="w-full p-5 bg-secondary/30 rounded-[1.5rem] border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold" placeholder="John Doe" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Email Address</label>
                                <input required type="email" className="w-full p-5 bg-secondary/30 rounded-[1.5rem] border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Subject</label>
                            <input required className="w-full p-5 bg-secondary/30 rounded-[1.5rem] border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all font-bold" placeholder="How can we help?" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-3">Message Body</label>
                            <textarea required className="w-full p-6 bg-secondary/30 rounded-[1.5rem] border-2 border-transparent focus:border-primary/50 focus:bg-background outline-none transition-all h-40 resize-none font-bold" placeholder="Describe your needs in detail..." />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="w-full py-6 bg-primary text-white rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 relative overflow-hidden group active:scale-[0.98]"
                        >
                            {sending ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            {sending ? "Delivering..." : "Send Secure Message"}
                        </button>

                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center gap-2 text-emerald-500 font-bold text-sm"
                                >
                                    <CheckCircle2 className="w-4 h-4" /> Message delivered successfully!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
