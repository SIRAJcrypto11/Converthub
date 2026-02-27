"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { Unlock, Download, Plus, X, File as FileIcon, Loader2, AlertCircle, Eye, EyeOff, LockOpen, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


export default function UnlockPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
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

    const unlockPdf = async () => {
        if (!file || !password) return;

        setIsUnlocking(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Attempt to load the PDF with the provided password
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
                password,
                ignoreEncryption: false
            } as any);

            // To "unlock", we simply save it without a password
            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
            const filename = `unlocked_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
            const { downloadFile } = await import("@/lib/download");
            downloadFile(pdfBytes, filename, "application/pdf");
            setSuccess(true);
        } catch (err: any) {
            console.error("Unlock failed:", err);
            if (err.message?.includes("password")) {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Failed to unlock PDF. The file might not be encrypted or is corrupted.");
            }
        } finally {
            setIsUnlocking(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-green-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <Unlock className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#202124]">Unlock PDF</h1>
                <p className="text-muted-foreground text-lg">Remove password protection from your PDF files if you know the password.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-4 border-dashed rounded-[3rem] p-16 text-center transition-all cursor-pointer group relative overflow-hidden h-[400px] flex flex-col items-center justify-center",
                                isDragActive ? "border-green-500 bg-green-50" : "border-[#DADCE0] hover:border-green-500/50 hover:bg-secondary/30"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Plus className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black italic mb-2">Select Protected PDF</h3>
                            <p className="text-muted-foreground font-medium">or drag and drop here</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-[#DADCE0] rounded-[3rem] p-10 shadow-xl space-y-8 relative overflow-hidden"
                        >
                            <div className="absolute top-6 right-6">
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-3 hover:bg-green-50 text-green-500 rounded-2xl transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center shadow-inner">
                                    <FileIcon className="w-10 h-10" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black italic truncate max-w-[250px]">{file.name}</h3>
                                    <p className="text-[#5F6368] font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB • Encrypted PDF</p>
                                </div>
                            </div>

                            <div className="p-6 bg-green-50 border border-green-100 rounded-[2rem] flex items-center gap-4">
                                <LockOpen className="w-8 h-8 text-green-600" />
                                <p className="text-sm font-bold text-green-800 italic">Enter the password to remove encryption permanently.</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className={cn(
                        "bg-white border rounded-[3rem] p-10 shadow-2xl transition-all duration-500",
                        !file ? "opacity-30 pointer-events-none scale-95" : "opacity-100 scale-100 border-green-500/30"
                    )}>
                        <h2 className="text-2xl font-black italic mb-8 flex items-center gap-3">
                            <Unlock className="w-7 h-7 text-green-600" />
                            Unlock File
                        </h2>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#5F6368] ml-2">PDF Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 ring-green-500/10 focus:border-green-500 transition-all"
                                        placeholder="Enter password..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6368] hover:text-green-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-600 text-sm font-bold flex items-center gap-2 px-2"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}

                            <button
                                onClick={unlockPdf}
                                disabled={isUnlocking || !password}
                                className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 italic"
                            >
                                {isUnlocking ? <Loader2 className="w-7 h-7 animate-spin" /> : <Unlock className="w-7 h-7" />}
                                Unlock PDF
                            </button>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic"
                                >
                                    <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg">File Unlocked!</p>
                                        <p className="text-sm font-medium opacity-80">Encryption removed and downloaded.</p>
                                    </div>
                                </motion.div>
                            )}

                            <p className="text-[10px] text-[#5F6368] text-center font-medium px-4">
                                Note: This tool will only work if you know the current password of the PDF.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
