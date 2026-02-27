"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, Reorder } from "framer-motion";
import { Layers, Download, Plus, X, File as FileIcon, Loader2, GripVertical, AlertCircle, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


export default function MergePdfPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setFiles([...files, ...acceptedFiles]);
        setError(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setIsMerging(true);
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const { downloadFile } = await import("@/lib/download");
            downloadFile(pdfBytes, "converthub_merged.pdf", "application/pdf");
            setSuccess(true);
        } catch (err) {
            console.error("Merging failed:", err);
            setError("Failed to merge PDFs. One of the files may be corrupted, encrypted, or too large.");
        } finally {
            setIsMerging(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-orange-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <Layers className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Merge PDF</h1>
                <p className="text-muted-foreground text-lg">Combine multiple PDF files into one in any order you want.</p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-3xl flex items-center gap-3 text-sm mb-8"
                >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                </motion.div>
            )}

            <div className="space-y-8">
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-4 border-dashed rounded-[3rem] p-16 text-center transition-all cursor-pointer group relative overflow-hidden",
                        isDragActive ? "border-orange-500 bg-orange-50" : "border-border hover:border-orange-500/50 hover:bg-secondary/30"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xl font-bold">Select PDF files</p>
                            <p className="text-muted-foreground">or drag and drop them here</p>
                        </div>
                    </div>
                </div>

                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between px-4">
                            <p className="font-bold text-lg">{files.length} files selected</p>
                            <p className="text-sm text-muted-foreground">Drag to reorder</p>
                        </div>

                        <Reorder.Group
                            axis="y"
                            values={files}
                            onReorder={setFiles}
                            className="space-y-3"
                        >
                            {files.map((file, index) => (
                                <Reorder.Item
                                    key={file.name + index}
                                    value={file}
                                    className="bg-card border rounded-2xl p-4 flex items-center gap-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-orange-200 transition-colors group"
                                >
                                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                                        <FileIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors md:opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <button
                            onClick={mergePdfs}
                            disabled={files.length < 2 || isMerging}
                            className="w-full py-5 bg-orange-500 text-white rounded-[2rem] font-extrabold text-xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isMerging ? <Loader2 className="w-6 h-6 animate-spin" /> : <Layers className="w-6 h-6" />}
                            Merge PDF Files
                        </button>

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic"
                            >
                                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="text-lg">Merge Complete!</p>
                                    <p className="text-sm font-medium opacity-80">Combined PDF has been downloaded.</p>
                                </div>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic"
                            >
                                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="text-lg">Merge Complete!</p>
                                    <p className="text-sm font-medium opacity-80">Combined PDF has been downloaded.</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
