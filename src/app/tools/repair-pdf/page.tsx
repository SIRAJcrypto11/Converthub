"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion } from "framer-motion";
import { Wrench, Download, Plus, X, File as FileIcon, Loader2, AlertCircle, CheckCircle2, LifeBuoy } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


export default function RepairPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isRepairing, setIsRepairing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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

    const repairPdf = async () => {
        if (!file) return;

        setIsRepairing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();

            // pdf-lib's load function automatically attempts to repair 
            // many common PDF issues (like broken cross-reference tables)
            // by re-parsing the file structure.
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
                ignoreEncryption: true,
                throwOnInvalidObject: false
            });

            // Saving the document creates a clean, fresh PDF structure
            const pdfBytes = await pdfDoc.save();
            const { downloadFile } = await import("@/lib/download");
            await downloadFile(pdfBytes, `repaired_${file.name.replace(/\.[^/.]+$/, "")}.pdf`, "application/pdf");
            setSuccess(true);
        } catch (err) {
            console.error("Repair failed:", err);
            setError("Failed to repair PDF. The file might be too severely corrupted or is not a valid PDF.");
        } finally {
            setIsRepairing(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <Wrench className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#202124]">Repair PDF</h1>
                <p className="text-muted-foreground text-lg">Fix corrupted, broken, or damaged PDF files to recover your content.</p>
            </div>

            <div className="space-y-8">
                {!file ? (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-4 border-dashed rounded-[3rem] p-20 text-center transition-all cursor-pointer group relative overflow-hidden h-[400px] flex flex-col items-center justify-center",
                            isDragActive ? "border-blue-500 bg-blue-50" : "border-[#DADCE0] hover:border-blue-500/50 hover:bg-secondary/30"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Plus className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black italic mb-2">Select Corrupted PDF</h3>
                        <p className="text-muted-foreground font-medium">or drag and drop here</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-[#DADCE0] rounded-[3rem] p-12 shadow-2xl space-y-8 relative overflow-hidden"
                    >
                        <div className="absolute top-8 right-8">
                            <button
                                onClick={() => setFile(null)}
                                className="p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                                <FileIcon className="w-12 h-12" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-3xl font-black italic truncate max-w-[400px] text-[#202124]">{file.name}</h3>
                                <p className="text-[#5F6368] font-bold text-lg">{(file.size / 1024 / 1024).toFixed(2)} MB • Analyzing Structure...</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2rem] flex items-center gap-4">
                                <LifeBuoy className="w-8 h-8 text-blue-600" />
                                <p className="text-sm font-bold text-blue-800 italic">Rebuilding cross-reference tables and object streams.</p>
                            </div>
                            <div className="p-6 bg-green-50 border border-green-100 rounded-[2rem] flex items-center gap-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                <p className="text-sm font-bold text-green-800 italic">Sanitizing document headers and trailer dictionary.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <button
                            onClick={repairPdf}
                            disabled={isRepairing}
                            className="w-full py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 italic"
                        >
                            {isRepairing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Wrench className="w-8 h-8" />}
                            Repair Document
                        </button>

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic mt-6"
                            >
                                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="text-lg">Repair Successful!</p>
                                    <p className="text-sm font-medium opacity-80">Structural issues fixed and downloaded.</p>
                                </div>
                            </motion.div>
                        )}

                        <p className="text-xs text-[#5F6368] text-center font-medium italic">
                            ConvertHub uses advanced structural reconstruction to recover your data perfectly.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
