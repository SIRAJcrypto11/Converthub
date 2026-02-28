"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileDown, Plus, X, File as FileIcon, Loader2,
    AlertCircle, FileText, CheckCircle2, BookOpen, Search, Cog
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { convertPdfToDocx, type ConversionProgress } from "@/lib/pdf-to-word-engine";

const stageIcons: Record<ConversionProgress["stage"], React.ReactNode> = {
    reading: <BookOpen className="w-4 h-4" />,
    analyzing: <Search className="w-4 h-4" />,
    building: <Cog className="w-4 h-4 animate-spin" />,
    complete: <CheckCircle2 className="w-4 h-4" />,
};

const stageLabels: Record<ConversionProgress["stage"], string> = {
    reading: "Reading PDF",
    analyzing: "Analyzing Layout",
    building: "Building Word Document",
    complete: "Complete",
};

export default function PdfToWordPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState<ConversionProgress>({
        stage: "reading", percent: 0, message: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setSuccess(false);
            setProgress({ stage: "reading", percent: 0, message: "" });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
    });

    const convertToWord = async () => {
        if (!file) return;

        setIsConverting(true);
        setError(null);
        setSuccess(false);

        try {
            const blob = await convertPdfToDocx(file, (p) => {
                setProgress(p);
            });

            const filename = `${file.name.replace(/\.pdf$/i, "")}.docx`;
            const { downloadBlob } = await import("@/lib/download");
            downloadBlob(blob, filename);

            setSuccess(true);
        } catch (err: any) {
            console.error("Conversion failed:", err);
            const message = err?.message || "";
            if (message.includes("password") || message.includes("encrypted")) {
                setError("This PDF is password-protected. Please unlock it first using our Unlock PDF tool.");
            } else if (message.includes("Invalid PDF")) {
                setError("This file appears to be corrupted or is not a valid PDF.");
            } else {
                setError("Failed to convert PDF to Word. The file might be protected, corrupted, or too complex.");
            }
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <FileDown className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#202124]">PDF to Word</h1>
                <p className="text-muted-foreground text-lg">Convert your PDF documents to editable DOCX files with high accuracy.</p>
            </div>

            <div className="space-y-8">
                {!file ? (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "border-4 border-dashed rounded-[3.5rem] p-20 text-center transition-all cursor-pointer group h-[400px] flex flex-col items-center justify-center relative overflow-hidden",
                            isDragActive ? "border-blue-500 bg-blue-50" : "border-[#DADCE0] hover:border-blue-500/50 hover:bg-secondary/30"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                            <Plus className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black italic mb-2">Select PDF file</h3>
                        <p className="text-muted-foreground font-medium">or drag and drop here</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-[#DADCE0] rounded-[3rem] p-12 shadow-2xl space-y-8 relative overflow-hidden"
                    >
                        <button onClick={() => { setFile(null); setError(null); setSuccess(false); }} className="absolute top-8 right-8 p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                                <FileIcon className="w-12 h-12" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-3xl font-black italic truncate max-w-[400px] text-[#202124]">{file.name}</h3>
                                <p className="text-[#5F6368] font-bold text-lg">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Conversion</p>
                            </div>
                        </div>

                        {/* Multi-Stage Progress */}
                        {isConverting && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600">
                                        {stageIcons[progress.stage]}
                                        <span>{stageLabels[progress.stage]}</span>
                                    </div>
                                    <span className="text-xs font-black text-blue-600">{progress.percent}%</span>
                                </div>
                                <div className="w-full bg-blue-50 h-4 rounded-full overflow-hidden border border-blue-100">
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress.percent}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <p className="text-xs text-[#5F6368] font-medium">{progress.message}</p>
                            </div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic"
                            >
                                <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                <div>
                                    <p className="text-lg">Conversion Complete!</p>
                                    <p className="text-sm font-medium opacity-80">Your editable Word file has been downloaded with formatting preserved.</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic"
                            >
                                <AlertCircle className="w-8 h-8 flex-shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        <button
                            onClick={convertToWord}
                            disabled={isConverting}
                            className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 italic"
                        >
                            {isConverting ? <Loader2 className="w-9 h-9 animate-spin" /> : <FileText className="w-9 h-9" />}
                            Convert to Word (DOCX)
                        </button>

                        <p className="text-xs text-[#5F6368] text-center font-medium italic px-10">
                            ConvertHub reconstructs your PDF's layout — preserving paragraphs, headings, bold, italic, and font sizes — for the cleanest Word output possible.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
