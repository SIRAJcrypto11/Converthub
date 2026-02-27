"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    BarChart3,
    Layers,
    Scissors,
    Minimize2,
    Image as ImageIcon,
    FileType,
    FileCode,
    Layout,
    Hash,
    Lock,
    Unlock as UnlockIcon,
    Wrench,
    Stamp,
    ScanText,
    Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tools = [
    {
        id: "md-pdf",
        title: "Markdown to PDF",
        description: "Convert your markdown files into professional PDF documents with custom styling.",
        icon: FileText,
        href: "/tools/markdown-to-pdf",
        category: "Markdown",
        color: "bg-purple-500",
        badge: "NEW",
    },
    {
        id: "md-graph",
        title: "Markdown to Graph",
        description: "Generate beautiful Mermaid diagrams and charts from simple text descriptions.",
        icon: BarChart3,
        href: "/tools/markdown-to-graph",
        category: "Markdown",
        color: "bg-teal-500",
        badge: "NEW",
    },
    {
        id: "ocr-pdf",
        title: "OCR PDF",
        description: "Extract text from scanned PDFs using advanced AI recognition.",
        icon: ScanText,
        href: "/tools/ocr-pdf",
        category: "AI",
        color: "bg-indigo-600",
        badge: "AI",
    },
    {
        id: "pdf-to-word",
        title: "PDF to Word",
        description: "Convert PDF documents to editable Word files with high accuracy.",
        icon: FileText,
        href: "/tools/pdf-to-word",
        category: "Convert",
        color: "bg-blue-500",
    },
    {
        id: "web-to-pdf",
        title: "HTML to PDF",
        description: "Convert any webpage into a PDF document by simply entering the URL.",
        icon: Globe,
        href: "/tools/web-to-pdf",
        category: "Convert",
        color: "bg-emerald-600",
    },
    {
        id: "watermark-pdf",
        title: "Watermark PDF",
        description: "Stamp text or image watermarks over your PDF documents.",
        icon: Stamp,
        href: "/tools/watermark-pdf",
        category: "Optimize",
        color: "bg-amber-500",
        badge: "NEW",
    },
    {
        id: "organize-pdf",
        title: "Organize PDF",
        description: "Rearrange, rotate, or delete pages from your PDF with a visual drag-and-drop interface.",
        icon: Layout,
        href: "/tools/organize-pdf",
        category: "PDF Tools",
        color: "bg-blue-600",
        badge: "HOT",
    },
    {
        id: "page-numbers",
        title: "Page Numbers",
        description: "Add professional page numbers to your PDF with custom styles and positioning.",
        icon: Hash,
        href: "/tools/page-numbers",
        category: "PDF Tools",
        color: "bg-pink-500",
        badge: "NEW",
    },
    {
        id: "protect-pdf",
        title: "Protect PDF",
        description: "Encrypt your PDF with a password to prevent unauthorized access.",
        icon: Lock,
        href: "/tools/protect-pdf",
        category: "Security",
        color: "bg-red-600",
    },
    {
        id: "unlock-pdf",
        title: "Unlock PDF",
        description: "Remove password protection from your PDF files if you know the password.",
        icon: UnlockIcon,
        href: "/tools/unlock-pdf",
        category: "Security",
        color: "bg-green-600",
    },
    {
        id: "repair-pdf",
        title: "Repair PDF",
        description: "Fix corrupted, broken, or damaged PDF files to recover your content.",
        icon: Wrench,
        href: "/tools/repair-pdf",
        category: "PDF Tools",
        color: "bg-blue-600",
    },
    {
        id: "merge-pdf",
        title: "Merge PDF",
        description: "Combine multiple PDF files into one single document in seconds.",
        icon: Layers,
        href: "/tools/merge-pdf",
        category: "PDF Tools",
        color: "bg-orange-500",
    },
    {
        id: "split-pdf",
        title: "Split PDF",
        description: "Separate one page or a whole set for easy conversion into independent PDF files.",
        icon: Scissors,
        href: "/tools/split-pdf",
        category: "PDF Tools",
        color: "bg-red-500",
    },
    {
        id: "compress-pdf",
        title: "Compress PDF",
        description: "Perfectly optimize your PDF files by reducing size without losing quality.",
        icon: Minimize2,
        href: "/tools/compress-pdf",
        category: "Optimize",
        color: "bg-green-500",
    },
    {
        id: "img-pdf",
        title: "Image to PDF",
        description: "Convert JPG, PNG, and WebP images to high-quality PDF documents.",
        icon: ImageIcon,
        href: "/tools/image-to-pdf",
        category: "Convert",
        color: "bg-blue-500",
    },
    {
        id: "pdf-img",
        title: "PDF to Image",
        description: "Extract every page from a PDF and convert it into a high-quality image.",
        icon: FileType,
        href: "/tools/pdf-to-image",
        category: "Convert",
        color: "bg-rose-500",
    },
    {
        id: "word-pdf",
        title: "Word to PDF",
        description: "Make DOCX files easy to read by converting them to PDF format.",
        icon: FileCode,
        href: "/tools/word-to-pdf",
        category: "Convert",
        color: "bg-sky-500",
    },
];

const categories = ["All", "Markdown", "PDF Tools", "Convert", "Optimize", "Security", "AI"];

export default function ToolGrid() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredTools = activeCategory === "All"
        ? tools
        : tools.filter(tool => tool.category === activeCategory);

    return (
        <section id="tools" className="py-24 px-6 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold mb-4">Every tool you need</h2>
                    <p className="text-muted-foreground text-lg">Choose from our wide range of professional file transformers.</p>
                </div>

                {/* Categories Bar */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-full font-semibold transition-all duration-300",
                                activeCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                    : "bg-background border hover:border-primary/50 text-muted-foreground hover:text-primary"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Tools Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredTools.map((tool) => (
                            <motion.div
                                key={tool.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link
                                    href={tool.href}
                                    className="group block h-full p-8 bg-card rounded-3xl border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg",
                                        tool.color
                                    )}>
                                        <tool.icon className="w-8 h-8" />
                                    </div>

                                    {tool.badge && (
                                        <span className="absolute top-6 right-6 px-3 py-1 bg-accent/20 text-accent font-bold text-xs rounded-full">
                                            {tool.badge}
                                        </span>
                                    )}

                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{tool.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {tool.description}
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        Try now <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    );
}
