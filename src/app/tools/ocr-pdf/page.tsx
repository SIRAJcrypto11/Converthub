"use client";

import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import * as pdfjs from "pdfjs-dist";
import { motion, AnimatePresence } from "framer-motion";
import { ScanText, Download, Plus, X, File as FileIcon, Loader2, AlertCircle, CheckCircle2, Copy, Languages } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


// Initialize PDF.js worker
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function OcrPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState("eng");
    const [success, setSuccess] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setExtractedText("");
            setProgress(0);
            setSuccess(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const runOcr = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        setExtractedText("");
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;

            const worker = await createWorker(language, 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        // m.progress is 0-1
                    }
                }
            });

            let fullText = "";
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context!,
                    viewport,
                    canvas: canvas as any
                } as any).promise;

                const { data: { text } } = await worker.recognize(canvas);
                fullText += `--- Page ${i} ---\n${text}\n\n`;

                setProgress(Math.round((i / numPages) * 100));
                setExtractedText(fullText);
            }

            setSuccess(true);
            await worker.terminate();
        } catch (err) {
            console.error("OCR failed:", err);
            setError("Failed to perform OCR. The PDF might be corrupted or protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadText = () => {
        if (!extractedText || !file) return;
        const filename = `converthub_ocr_${file.name.replace(/\.[^/.]+$/, "")}.txt`;
        import("@/lib/download").then(({ downloadFile }) => {
            downloadFile(extractedText, filename, "text/plain;charset=utf-8");
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText);
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <ScanText className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#202124]">OCR PDF</h1>
                <p className="text-muted-foreground text-lg text-balance">Extract selectable and searchable text from scanned PDF documents using AI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-4 border-dashed rounded-[3.5rem] p-20 text-center transition-all cursor-pointer group h-[400px] flex flex-col items-center justify-center relative overflow-hidden",
                                isDragActive ? "border-indigo-500 bg-indigo-50" : "border-[#DADCE0] hover:border-indigo-500/50 hover:bg-secondary/30"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <Plus className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black italic mb-2">Select Scanned PDF</h3>
                            <p className="text-muted-foreground font-medium">or drag and drop here</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-[#DADCE0] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setFile(null)} className="absolute top-8 right-8 p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
                                    <FileIcon className="w-10 h-10" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-black italic truncate max-w-[200px]">{file.name}</h3>
                                    <p className="text-[#5F6368] font-bold">PDF • AI Ready</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-center gap-4">
                                    <Languages className="w-6 h-6 text-indigo-600" />
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-transparent font-bold text-indigo-900 outline-none w-full"
                                    >
                                        <option value="eng">English</option>
                                        <option value="ind">Indonesian</option>
                                        <option value="fra">French</option>
                                        <option value="spa">Spanish</option>
                                    </select>
                                </div>

                                {isProcessing && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">
                                            <span>Processing AI...</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="w-full bg-indigo-50 h-3 rounded-full overflow-hidden">
                                            <motion.div
                                                className="bg-indigo-600 h-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={runOcr}
                                    disabled={isProcessing}
                                    className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 italic"
                                >
                                    {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <ScanText className="w-7 h-7" />}
                                    Start AI Extraction
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="h-full min-h-[500px]">
                    <AnimatePresence>
                        {extractedText ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#1A1C1E] text-white rounded-[3.5rem] p-10 h-full flex flex-col shadow-2xl relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black italic flex items-center gap-2">
                                        <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                                        Extracted Text
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={copyToClipboard} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                                            <Copy className="w-5 h-5" />
                                        </button>
                                        <button onClick={downloadText} className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    readOnly
                                    value={extractedText}
                                    className="flex-1 bg-transparent border-none outline-none font-mono text-sm leading-relaxed resize-none text-indigo-50"
                                    placeholder="Text will appear here..."
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1A1C1E] to-transparent pointer-events-none" />
                            </motion.div>
                        ) : (
                            <div className="h-full border-4 border-dashed border-[#DADCE0] rounded-[3.5rem] flex flex-col items-center justify-center text-center p-10 opacity-50">
                                <ScanText className="w-16 h-16 text-muted-foreground mb-4" />
                                <p className="text-xl font-bold italic">Extracted text will appear here</p>
                                <p className="text-sm font-medium text-muted-foreground mt-2">Upload a file and start extraction to see results.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
