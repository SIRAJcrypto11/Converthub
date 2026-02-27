"use client";

import { motion } from "framer-motion";
import { Scale, CheckCircle, AlertTriangle, ScrollText } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm">
                        <Scale className="w-4 h-4" /> Legal Framework
                    </div>
                    <h1 className="text-5xl font-black">Terms of Service</h1>
                    <p className="text-xl text-muted-foreground">Effective Date: February 27, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-10">
                    <section>
                        <h2 className="text-foreground font-black text-3xl flex items-center gap-3">
                            <CheckCircle className="w-7 h-7 text-primary" /> 1. Acceptance
                        </h2>
                        <p>
                            By accessing ConvertHub, you agree to be bound by these Terms.
                            If you do not agree to these terms, please do not use our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground font-black text-3xl flex items-center gap-3">
                            <ScrollText className="w-7 h-7 text-primary" /> 2. Fair Usage
                        </h2>
                        <p>
                            Free users are limited to 10 conversions per day. Premium users enjoy
                            limitless transformations. We reserve the right to block automated
                            scraping or abusive patterns that degrade service quality for others.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground font-black text-3xl flex items-center gap-3">
                            <AlertTriangle className="w-7 h-7 text-primary" /> 3. No Warranty
                        </h2>
                        <p>
                            Our tools are provided &quot;as-is&quot;. While we strive for 100% accuracy in transforms,
                            we are not liable for any data loss, formatting errors, or business disruptions
                            caused by the use of our software.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground font-black text-3xl">4. Intellectual Property</h2>
                        <p>
                            The content you convert remains 100% yours. We claim no ownership over
                            your PDF outputs, graphs, or source documentation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-foreground font-black text-3xl">5. Termination</h2>
                        <p>
                            We may terminate or suspend access to our service immediately,
                            without prior notice, for conduct that we believe violates these Terms
                            or is harmful to other users of the service.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
