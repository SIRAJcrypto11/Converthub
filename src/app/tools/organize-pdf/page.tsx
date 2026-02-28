"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { Layout, Download, Plus, X, File as FileIcon, Loader2, GripVertical, AlertCircle, RotateCcw, Trash2, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface PDFPageItem {
    id: string;
    pdfIndex: number;
    pageIndex: number;
    thumbnail: string;
    pdfName: string;
}

export default function OrganizePdfPage() {
    const [pages, setPages] = useState<PDFPageItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileBuffers, setFileBuffers] = useState<Map<number, ArrayBuffer>>(new Map());
    const [success, setSuccess] = useState(false);

    const generateThumbnails = async (file: File, pdfIndex: number) => {
        setIsLoadingThumbnails(true);
        try {
            const pdfjsLib = await import("pdfjs-dist");
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
            }

            const arrayBuffer = await file.arrayBuffer();
            setFileBuffers(prev => new Map(prev).set(pdfIndex, arrayBuffer));

            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const newPages: PDFPageItem[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.3 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await (page as any).render({ canvasContext: context, viewport, intent: 'display' }).promise;
                    newPages.push({
                        id: `${file.name}-${pdfIndex}-${i}-${Math.random()}`,
                        pdfIndex,
                        pageIndex: i - 1,
                        thumbnail: canvas.toDataURL(),
                        pdfName: file.name
                    });
                }
            }
            return newPages;
        } catch (err) {
            console.error("Thumbnail generation failed:", err);
            throw new Error(`Failed to process ${file.name}`);
        } finally {
            setIsLoadingThumbnails(false);
        }
    };

    const onDrop = async (acceptedFiles: File[]) => {
        setError(null);
        setSuccess(false);
        const startIndex = pages.length;
        const allNewPages: PDFPageItem[] = [];

        for (let i = 0; i < acceptedFiles.length; i++) {
            try {
                const p = await generateThumbnails(acceptedFiles[i], startIndex + i);
                allNewPages.push(...p);
            } catch (err: any) {
                setError(err.message);
            }
        }
        setPages(prev => [...prev, ...allNewPages]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });

    const removePage = (id: string) => {
        setPages(pages.filter(p => p.id !== id));
    };

    const organizePdf = async () => {
        if (pages.length === 0) return;
        setIsProcessing(true);
        setError(null);

        try {
            const organizedPdf = await PDFDocument.create();
            const loadedPdfs = new Map<number, PDFDocument>();

            for (const item of pages) {
                let sourcePdf = loadedPdfs.get(item.pdfIndex);
                if (!sourcePdf) {
                    const buffer = fileBuffers.get(item.pdfIndex);
                    if (!buffer) continue;
                    sourcePdf = await PDFDocument.load(buffer);
                    loadedPdfs.set(item.pdfIndex, sourcePdf);
                }

                const [copiedPage] = await organizedPdf.copyPages(sourcePdf, [item.pageIndex]);
                organizedPdf.addPage(copiedPage);
            }

            const pdfBytes = await organizedPdf.save();
            const { downloadFile } = await import("@/lib/download");
            downloadFile(pdfBytes, "organized_converthub.pdf", "application/pdf");
            setSuccess(true);
        } catch (err) {
            console.error("Organization failed:", err);
            setError("Failed to generate PDF. Some files might be encrypted.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <Layout className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Organize PDF</h1>
                <p className="text-muted-foreground text-lg italic">Rearrange, delete, or merge pages across multiple PDFs with a visual interface.</p>
            </div>

            {error && (
                <div className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-3xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="space-y-12">
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-4 border-dashed rounded-[3rem] p-12 text-center transition-all cursor-pointer group relative overflow-hidden",
                        isDragActive ? "border-blue-500 bg-blue-50" : "border-border hover:border-blue-500/50 hover:bg-secondary/30"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">Select PDF files to organize</p>
                            <p className="text-muted-foreground">Drag and drop pages to reorder them</p>
                        </div>
                    </div>
                </div>

                {isLoadingThumbnails && (
                    <div className="flex items-center justify-center gap-3 text-muted-foreground animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating page previews...
                    </div>
                )}

                {pages.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-black italic">{pages.length} Pages Loaded</p>
                            <button
                                onClick={() => setPages([])}
                                className="px-6 py-2 bg-secondary text-primary font-bold rounded-full hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset All
                            </button>
                        </div>

                        <Reorder.Group
                            axis="x"
                            values={pages}
                            onReorder={setPages}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
                        >
                            <AnimatePresence>
                                {pages.map((page) => (
                                    <Reorder.Item
                                        key={page.id}
                                        value={page}
                                        className="relative group cursor-grab active:cursor-grabbing bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/50 transition-all"
                                    >
                                        <div className="aspect-[3/4] p-2 bg-secondary/20">
                                            <img
                                                src={page.thumbnail}
                                                alt={`Page ${page.pageIndex + 1}`}
                                                className="w-full h-full object-contain shadow-sm rounded-lg"
                                            />
                                        </div>
                                        <div className="p-3 bg-card border-t flex items-center justify-between bg-white">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground truncate">{page.pdfName}</p>
                                                <p className="text-xs font-bold">Page {page.pageIndex + 1}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removePage(page.id);
                                                }}
                                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>

                        <button
                            onClick={organizePdf}
                            disabled={isProcessing}
                            className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 italic"
                        >
                            {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7" />}
                            Process & Download Organized PDF
                        </button>

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic mt-6"
                            >
                                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="text-lg">Organize Complete!</p>
                                    <p className="text-sm font-medium opacity-80">Your custom PDF has been downloaded.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
