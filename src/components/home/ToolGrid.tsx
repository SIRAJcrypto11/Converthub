"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText, BarChart3, Layers, Scissors, Minimize2,
    Image as ImageIcon, FileType, FileCode, Layout, Hash,
    Lock, Unlock as UnlockIcon, Wrench, Stamp, ScanText, Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tools = [
    {
        id: "md-pdf", title: "Markdown to PDF",
        description: "Convert markdown files into professional PDF documents with custom styling.",
        icon: FileText, href: "/tools/markdown-to-pdf",
        category: "Convert", color: "from-purple-500 to-purple-700", badge: "NEW",
    },
    {
        id: "md-graph", title: "Markdown to Graph",
        description: "Generate beautiful Mermaid diagrams and charts from simple text descriptions.",
        icon: BarChart3, href: "/tools/markdown-to-graph",
        category: "Convert", color: "from-blue-500 to-blue-700", badge: "NEW",
    },
    {
        id: "merge", title: "Merge PDF",
        description: "Combine multiple PDF files into one document seamlessly.",
        icon: Layers, href: "/tools/merge-pdf",
        category: "PDF", color: "from-green-500 to-green-700", badge: "POPULAR",
    },
    {
        id: "split", title: "Split PDF",
        description: "Split a PDF into multiple files by page ranges or individual pages.",
        icon: Scissors, href: "/tools/split-pdf",
        category: "PDF", color: "from-orange-500 to-orange-700", badge: "",
    },
    {
        id: "compress", title: "Compress PDF",
        description: "Reduce PDF file size while maintaining quality for faster sharing.",
        icon: Minimize2, href: "/tools/compress-pdf",
        category: "Optimize", color: "from-yellow-500 to-yellow-700", badge: "POPULAR",
    },
    {
        id: "img-pdf", title: "Image to PDF",
        description: "Convert JPG, PNG, and other image formats to PDF documents.",
        icon: ImageIcon, href: "/tools/image-to-pdf",
        category: "Convert", color: "from-pink-500 to-pink-700", badge: "",
    },
    {
        id: "pdf-word", title: "PDF to Word",
        description: "Convert PDF files to editable Word documents (.docx) instantly.",
        icon: FileType, href: "/tools/pdf-to-word",
        category: "Convert", color: "from-blue-600 to-blue-800", badge: "POPULAR",
    },
    {
        id: "word-pdf", title: "Word to PDF",
        description: "Convert Word documents (.docx) to PDF format while preserving layout.",
        icon: FileCode, href: "/tools/word-to-pdf",
        category: "Convert", color: "from-indigo-500 to-indigo-700", badge: "",
    },
    {
        id: "organize", title: "Organize PDF",
        description: "Rearrange, rotate, and delete pages in your PDF visually.",
        icon: Layout, href: "/tools/organize-pdf",
        category: "PDF", color: "from-teal-500 to-teal-700", badge: "",
    },
    {
        id: "page-num", title: "Page Numbers",
        description: "Add customizable page numbers to your PDF documents.",
        icon: Hash, href: "/tools/page-numbers",
        category: "PDF", color: "from-cyan-500 to-cyan-700", badge: "",
    },
    {
        id: "protect", title: "Protect PDF",
        description: "Add password protection and encryption to your PDF files.",
        icon: Lock, href: "/tools/protect-pdf",
        category: "Security", color: "from-red-500 to-red-700", badge: "",
    },
    {
        id: "unlock", title: "Unlock PDF",
        description: "Remove password protection from encrypted PDF files.",
        icon: UnlockIcon, href: "/tools/unlock-pdf",
        category: "Security", color: "from-rose-500 to-rose-700", badge: "",
    },
    {
        id: "repair", title: "Repair PDF",
        description: "Fix corrupted or damaged PDF files to restore your content.",
        icon: Wrench, href: "/tools/repair-pdf",
        category: "Optimize", color: "from-amber-500 to-amber-700", badge: "",
    },
    {
        id: "watermark", title: "Watermark PDF",
        description: "Add text or image watermarks to protect your PDF documents.",
        icon: Stamp, href: "/tools/watermark-pdf",
        category: "Security", color: "from-violet-500 to-violet-700", badge: "",
    },
    {
        id: "ocr", title: "OCR PDF",
        description: "Extract text from scanned PDFs using optical character recognition.",
        icon: ScanText, href: "/tools/ocr-pdf",
        category: "Convert", color: "from-emerald-500 to-emerald-700", badge: "NEW",
    },
    {
        id: "web-pdf", title: "Web to PDF",
        description: "Convert any webpage to a PDF by simply entering its URL.",
        icon: Globe, href: "/tools/web-to-pdf",
        category: "Convert", color: "from-sky-500 to-sky-700", badge: "",
    },
    {
        id: "pdf-img", title: "PDF to Image",
        description: "Convert PDF pages to high-quality PNG or JPG images.",
        icon: ImageIcon, href: "/tools/pdf-to-image",
        category: "Convert", color: "from-fuchsia-500 to-fuchsia-700", badge: "",
    },
];

const categories = ["All", "PDF", "Convert", "Optimize", "Security"];

export default function ToolGrid() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = activeCategory === "All"
        ? tools
        : tools.filter((t) => t.category === activeCategory);

    return (
        <section id="tools" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-extrabold mb-4"
                    >
                        All{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Tools
                        </span>
                    </motion.h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        {tools.length} professional tools to handle all your document conversion needs
                    </p>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                                activeCategory === cat
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700 border border-gray-700"
                            )}
                        >
                            {cat}
                            {cat !== "All" && (
                                <span className="ml-2 text-xs opacity-60">
                                    ({tools.filter((t) => t.category === cat).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tool Cards Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((tool) => {
                            const Icon = tool.icon;
                            return (
                                <motion.div
                                    key={tool.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    className="group relative"
                                >
                                    <Link href={tool.href}>
                                        <div className="relative h-full bg-gray-900 border border-gray-800 rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-300 group-hover:border-gray-600 group-hover:shadow-xl group-hover:shadow-black/30">
                                            {/* Gradient background on hover */}
                                            <div className={cn(
                                                "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                                                tool.color
                                            )} />

                                            {/* Badge */}
                                            {tool.badge && (
                                                <span className={cn(
                                                    "absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                    tool.badge === "NEW"
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                                )}>
                                                    {tool.badge}
                                                </span>
                                            )}

                                            {/* Icon */}
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                                                tool.color
                                            )}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Content */}
                                            <h3 className="font-bold text-gray-100 mb-1 group-hover:text-white transition-colors">
                                                {tool.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                                {tool.description}
                                            </p>

                                            {/* Category Tag */}
                                            <div className="mt-4">
                                                <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-md">
                                                    {tool.category}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                        No tools found in this category.
                    </div>
                )}
            </div>
        </section>
    );
}