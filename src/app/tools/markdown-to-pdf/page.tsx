"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Download, FileText, Settings2, Eye, Code2, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import FileUploadZone from "@/components/tools/FileUploadZone";
import { cn } from "@/lib/utils";

const DEFAULT_MARKDOWN = `# Welcome to ConvertHub

## Markdown to PDF Transformer

Type your content here or upload an existing .md file.

### Features
- **Live Preview**: See changes instantly
- **GFM Support**: Tables, checklists, and more
- **Custom Styling**: Professional defaults
- **Client-Side**: 100% secure processing

| Feature | Support |
| :--- | :--- |
| Live Preview | Yes |
| Themes | Yes |
| GFM | Yes |

> Use the settings panel to adjust font size and margins.
`;

const previewStyles: Record<string, React.CSSProperties> = {
    h1: { fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" },
    h2: { fontSize: "1.8rem", fontWeight: 700, marginTop: "2rem", marginBottom: "1rem" },
    h3: { fontSize: "1.4rem", fontWeight: 600, marginTop: "1.5rem", marginBottom: "0.75rem" },
    p: { lineHeight: 1.8, marginBottom: "1.25rem" },
    table: { width: "100%", borderCollapse: "collapse" as const, marginTop: "1.5rem", marginBottom: "1.5rem" },
    th: { border: "1px solid #ddd", padding: "12px", textAlign: "left" as const, backgroundColor: "#f8f9fa", fontWeight: "bold" },
    td: { border: "1px solid #ddd", padding: "12px", textAlign: "left" as const },
    blockquote: { borderLeft: "4px solid #6C5CE7", paddingLeft: "1.5rem", margin: "2rem 0", fontStyle: "italic", color: "#555" },
    code: { background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" },
    pre: { background: "#1e1e1e", color: "#fff", padding: "1.5rem", borderRadius: "1rem", overflowX: "auto" as const, margin: "1.5rem 0" },
    ul: { listStyle: "disc", marginLeft: "1.5rem", marginBottom: "1.25rem" },
    ol: { listStyle: "decimal", marginLeft: "1.5rem", marginBottom: "1.25rem" },
};

export default function MarkdownToPdfPage() {
    const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
    const [success, setSuccess] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsProcessing(true);
        setError(null);

        try {
            const html2pdf = (await import("html2pdf.js")).default;
            const element = previewRef.current;
            const opt = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: "converthub_export.pdf",
                image: { type: "jpeg" as any, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as any },
            };
            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            const { downloadBlob } = await import("@/lib/download");
            downloadBlob(new Blob([pdfBlob], { type: "application/pdf" }), "converthub_export.pdf");
            setSuccess(true);
        } catch (err) {
            console.error("PDF generation failed:", err);
            setError("Failed to generate PDF. Please check your content and try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileSelect = async (file: File) => {
        try {
            const text = await file.text();
            setMarkdown(text);
            setError(null);
            setSuccess(false);
        } catch (err) {
            setError("Failed to read file. Please ensure it is a valid markdown document.");
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <FileText className="w-7 h-7" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Markdown to PDF</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">Create professional PDF documents from plain text.</p>
                </div>

                <div className="flex items-center gap-3 p-1.5 bg-secondary/50 rounded-2xl border">
                    <button
                        onClick={() => setViewMode("edit")}
                        className={cn(
                            "p-2 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm",
                            viewMode === "edit" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Code2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                        onClick={() => setViewMode("preview")}
                        className={cn(
                            "p-2 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm",
                            viewMode === "preview" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button
                        onClick={() => setViewMode("split")}
                        className={cn(
                            "p-2 rounded-xl transition-all items-center gap-2 font-semibold text-sm hidden md:flex",
                            viewMode === "split" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"
                        )}
                    >
                        <Settings2 className="w-4 h-4" /> Split View
                    </button>
                </div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-3xl flex items-center gap-3 text-sm mb-8 font-jakarta"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px] font-jakarta">
                {/* Editor Side */}
                {(viewMode === "edit" || viewMode === "split") && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex-grow bg-card border rounded-[2rem] overflow-hidden shadow-xl">
                            <textarea
                                value={markdown}
                                onChange={(e) => {
                                    setMarkdown(e.target.value);
                                    setSuccess(false);
                                }}
                                className="w-full h-full p-8 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                                placeholder="Start typing your markdown..."
                            />
                        </div>
                        <FileUploadZone
                            label="Import .md file"
                            accept={{ "text/markdown": [".md"] }}
                            onFileSelect={handleFileSelect}
                        />
                    </motion.div>
                )}

                {/* Preview Side */}
                {(viewMode === "preview" || viewMode === "split") && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex-grow bg-white text-black border rounded-[2rem] overflow-hidden shadow-xl relative">
                            <div className="absolute top-4 right-4 z-10">
                                <div className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full flex items-center gap-1 border border-primary/20">
                                    <Sparkles className="w-3 h-3" /> Live Preview
                                </div>
                            </div>
                            <div
                                ref={previewRef}
                                className="h-full overflow-y-auto p-12 bg-white"
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ children }) => <h1 style={previewStyles.h1}>{children}</h1>,
                                        h2: ({ children }) => <h2 style={previewStyles.h2}>{children}</h2>,
                                        h3: ({ children }) => <h3 style={previewStyles.h3}>{children}</h3>,
                                        p: ({ children }) => <p style={previewStyles.p}>{children}</p>,
                                        table: ({ children }) => <table style={previewStyles.table}>{children}</table>,
                                        th: ({ children }) => <th style={previewStyles.th}>{children}</th>,
                                        td: ({ children }) => <td style={previewStyles.td}>{children}</td>,
                                        blockquote: ({ children }) => <blockquote style={previewStyles.blockquote}>{children}</blockquote>,
                                        code: ({ children }) => <code style={previewStyles.code}>{children}</code>,
                                        pre: ({ children }) => <pre style={previewStyles.pre}>{children}</pre>,
                                        ul: ({ children }) => <ul style={previewStyles.ul}>{children}</ul>,
                                        ol: ({ children }) => <ol style={previewStyles.ol}>{children}</ol>,
                                    }}
                                >
                                    {markdown}
                                </ReactMarkdown>
                            </div>
                        </div>

                        <button
                            disabled={isProcessing}
                            onClick={handleDownload}
                            className="w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-extrabold text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 group"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                                    Download Professional PDF
                                </>
                            )}
                        </button>

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic"
                            >
                                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="text-lg">Export Complete!</p>
                                    <p className="text-sm font-medium opacity-80">Professional PDF has been downloaded.</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
