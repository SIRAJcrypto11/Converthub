import Logo from "@/components/shared/Logo";
import Link from "next/link";
import { Twitter, Github, Linkedin, Mail, ExternalLink } from "lucide-react";

const footerLinks = [
    {
        title: "Product",
        links: [
            { name: "Evolution", href: "/about#how-it-works" },
            { name: "Premium Plans", href: "/pricing" },
            { name: "Live Engine", href: "/" },
            { name: "Developer Support", href: "/contact" },
        ],
    },
    {
        title: "Engines",
        links: [
            { name: "Markdown to PDF", href: "/tools/markdown-to-pdf" },
            { name: "Markdown to Graph", href: "/tools/markdown-to-graph" },
            { name: "Merge Engine", href: "/tools/merge-pdf" },
            { name: "Split Engine", href: "/tools/split-pdf" },
            { name: "Compressor", href: "/tools/compress-pdf" },
        ],
    },
    {
        title: "Ecosystem",
        links: [
            { name: "About Hub", href: "/about" },
            { name: "Privacy Shield", href: "/privacy" },
            { name: "Trust & Safety", href: "/terms" },
            { name: "Enterprise Contact", href: "/contact" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-background border-t py-24 px-6 relative overflow-hidden font-jakarta">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
                <div className="lg:col-span-2 space-y-8">
                    <Logo />
                    <p className="text-muted-foreground max-w-sm leading-relaxed font-medium">
                        The ultimate high-performance transformation hub.
                        Safe, private, and 100% client-side document processing for the modern web.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="https://twitter.com/snishop" target="_blank" className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm hover:-translate-y-1">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="https://github.com/snishop" target="_blank" className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm hover:-translate-y-1">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://linkedin.com/company/snishop" target="_blank" className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all shadow-sm hover:-translate-y-1">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link href="mailto:support@converthub.id" className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:-translate-y-1">
                            <Mail className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {footerLinks.map((section) => (
                    <div key={section.title} className="space-y-8">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">{section.title}</h4>
                        <ul className="space-y-4">
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-all font-bold text-sm flex items-center gap-2 group">
                                        {link.name}
                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground">
                <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-bold tracking-tight">
                    <p>© 2026 ConvertHub System. Architected by Snishop ID.</p>
                    <span className="hidden md:block opacity-30">•</span>
                    <p className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[10px] uppercase font-black">All Systems Operational</p>
                </div>
                <div className="flex gap-8 text-xs font-black uppercase tracking-widest">
                    <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Shield</Link>
                    <Link href="/terms" className="hover:text-primary transition-colors">Trust Center</Link>
                    <Link href="/cookies" className="hover:text-primary transition-colors">Token Policy</Link>
                </div>
            </div>
        </footer>
    );
}
