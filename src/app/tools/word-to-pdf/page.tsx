"use client";

import { useState, useRef } from "react";
import mammoth from "mammoth";
import { FileCode, Download, File as FileIcon, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

import FileUploadZone from "@/components/tools/FileUploadZone";
import { motion } from "framer-motion";

export default function WordToPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [html, setHtml] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const convertWordToHtml = async (selectedFile: File) => {
        setIsProcessing(true);
        setError(null);
        try {
            const arrayBuffer = await selectedFile.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setHtml(result.value);
            if (result.messages.length > 0) {
                console.warn("MAMMOTH_MESSAGES", result.messages);
            }
        } catch (err) {
            console.error("DOCX conversion failed:", err);
            setError("Failed to parse Word document. Ensure it's a valid .docx file.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsProcessing(true);
        setError(null);

        try {
            const html2pdf = (await import("html2pdf.js")).default;
            const element = previewRef.current;
            const opt = {
                margin: [15, 15, 15, 15] as [number, number, number, number],
                filename: `converthub_${file?.name.split('.')[0] || 'export'}.pdf`,
                image: { type: "jpeg" as any, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as any },
            };
            const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
            const { downloadBlob } = await import("@/lib/download");
            downloadBlob(new Blob([pdfBlob], { type: "application/pdf" }), opt.filename);
            setSuccess(true);
        } catch (err) {
            console.error("PDF generation failed:", err);
            setError("Failed to generate PDF from preview. Try a simpler document.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setError(null);
        setSuccess(false);
        convertWordToHtml(selectedFile);
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-sky-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <FileCode className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Word to PDF</h1>
                <p className="text-muted-foreground text-lg">Convert your DOCX documents to professional PDF files instantly.</p>
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

            {!file ? (
                <FileUploadZone
                    onFileSelect={handleFileSelect}
                    accept={{ "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }}
                    label="Select Word document"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="bg-card border rounded-[3.5rem] p-10 shadow-2xl overflow-hidden relative flex-grow flex flex-col items-center justify-center text-center">
                            <div className="absolute top-0 left-0 w-full h-1 bg-sky-500" />
                            <div className="w-24 h-24 bg-sky-50 text-sky-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
                                <FileIcon className="w-12 h-12" />
                            </div>
                            <h2 className="text-3xl font-black mb-4 truncate w-full px-4">{file.name}</h2>
                            <p className="text-muted-foreground mb-10 max-w-xs mx-auto text-sm leading-relaxed">
                                Successfully parsed document. Review the preview and click download.
                            </p>

                            <button
                                onClick={handleDownload}
                                disabled={isProcessing || !html}
                                className="w-full py-6 bg-sky-500 text-white rounded-[2rem] font-extrabold text-2xl shadow-2xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Download className="w-8 h-8" />}
                                Download PDF
                            </button>

                            <button
                                onClick={() => { setFile(null); setHtml(""); setError(null); }}
                                className="mt-8 text-sm font-bold text-muted-foreground hover:text-sky-500 hover:underline transition-colors"
                            >
                                Convert another file
                            </button>
                        </div>

                        <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 flex gap-4 text-xs text-sky-800 leading-relaxed">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>Note: Complex Word formatting like floating text boxes or some charts might not render perfectly in this client-side preview.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border rounded-[3.5rem] shadow-2xl overflow-hidden h-[700px] relative"
                    >
                        <div className="absolute top-6 left-6 z-10">
                            <div className="px-4 py-1.5 bg-sky-500 text-white font-black text-xs rounded-full flex items-center gap-2 shadow-lg shadow-sky-500/20">
                                <Sparkles className="w-3 h-3" /> Live Preview
                            </div>
                        </div>
                        <div
                            ref={previewRef}
                            className="h-full overflow-y-auto p-16 text-black"
                            style={{ lineHeight: 1.6 }}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
}
