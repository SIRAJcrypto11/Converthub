"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { motion } from "framer-motion";
import { Hash, Download, Plus, X, File as FileIcon, Loader2, AlertCircle, Settings2, Type, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


export default function PageNumbersPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Settings
    const [position, setPosition] = useState("bottom-center");
    const [startNumber, setStartNumber] = useState(1);
    const [format, setFormat] = useState("Page {n}");
    const [fontSize, setFontSize] = useState(12);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setSuccess(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const addPageNumbers = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                const text = format.replace("{n}", (startNumber + i).toString());
                const textWidth = font.widthOfTextAtSize(text, fontSize);

                let x = width / 2 - textWidth / 2;
                let y = 20;

                // Position logic
                if (position.includes("top")) y = height - 40;
                if (position.includes("bottom")) y = 30;
                if (position.includes("left")) x = 40;
                if (position.includes("right")) x = width - textWidth - 40;
                if (position.includes("center")) x = width / 2 - textWidth / 2;

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                    opacity: 0.8
                });
            }

            const pdfBytes = await pdfDoc.save();
            const filename = `numbered_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
            const { downloadFile } = await import("@/lib/download");
            downloadFile(pdfBytes, filename, "application/pdf");
            setSuccess(true);
        } catch (err) {
            console.error("Numbering failed:", err);
            setError("Failed to add page numbers. The file might be protected or corrupted.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-pink-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <Hash className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Page Numbers</h1>
                <p className="text-muted-foreground text-lg italic">Add professional page numbers to your PDF with custom styles and positioning.</p>
            </div>

            {error && (
                <div className="mb-8 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-3xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-4 border-dashed rounded-[3.5rem] p-20 text-center transition-all cursor-pointer group relative overflow-hidden h-[400px] flex items-center justify-center",
                                isDragActive ? "border-pink-500 bg-pink-50" : "border-border hover:border-pink-500/50 hover:bg-secondary/30"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                    <Plus className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-2xl font-black italic">Select PDF file</p>
                                    <p className="text-muted-foreground">or drag and drop it here</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border rounded-[3rem] p-12 shadow-2xl space-y-8 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setFile(null)} className="p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center shadow-inner">
                                    <FileIcon className="w-10 h-10" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black italic truncate max-w-[400px]">{file.name}</h3>
                                    <p className="text-muted-foreground font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                                </div>
                            </div>

                            <div className="bg-secondary/20 rounded-[2rem] p-8 border border-dashed text-center">
                                <Type className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                                <p className="text-sm font-bold text-muted-foreground">Ready to number this document. Configure your settings on the right.</p>
                            </div>

                            <button
                                onClick={addPageNumbers}
                                disabled={isProcessing}
                                className="w-full py-6 bg-pink-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 italic"
                            >
                                {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Download className="w-7 h-7" />}
                                Apply & Download
                            </button>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic mt-6"
                                >
                                    <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg">Process Complete!</p>
                                        <p className="text-sm font-medium opacity-80">Your numbered PDF has been downloaded.</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="bg-card border rounded-[3rem] p-10 shadow-xl space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings2 className="w-6 h-6 text-pink-500" />
                            <h3 className="text-xl font-black italic">Settings</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Position</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        "top-left", "top-center", "top-right",
                                        "bottom-left", "bottom-center", "bottom-right"
                                    ].map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={cn(
                                                "p-3 rounded-xl border text-[10px] font-bold uppercase transition-all",
                                                position === pos ? "bg-pink-500 text-white border-pink-500 shadow-lg" : "bg-secondary/40 hover:bg-secondary"
                                            )}
                                        >
                                            {pos.replace("-", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Starting Number</label>
                                <input
                                    type="number"
                                    value={startNumber}
                                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                                    className="w-full bg-secondary/40 border rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-pink-500/20"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Format</label>
                                <input
                                    type="text"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    placeholder="Page {n}"
                                    className="w-full bg-secondary/40 border rounded-2xl p-4 font-bold outline-none focus:ring-2 ring-pink-500/20"
                                />
                                <p className="text-[10px] text-muted-foreground italic font-medium px-2">* use {"{n}"} for page number</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
