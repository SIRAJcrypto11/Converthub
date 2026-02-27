"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Scissors, Download, File as FileIcon, Loader2, Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import FileUploadZone from "@/components/tools/FileUploadZone";
import { motion } from "framer-motion";


export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("1-");
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const splitPdf = async () => {
    if (!file) return;
    setIsSplitting(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      const [start, end] = range.split("-").map((n) => parseInt(n));
      const startIndex = isNaN(start) ? 0 : start - 1;
      const endIndex = isNaN(end) ? totalPages - 1 : end - 1;

      if (startIndex < 0 || endIndex >= totalPages || startIndex > endIndex) {
        throw new Error("Invalid page range specified.");
      }

      const newPdf = await PDFDocument.create();
      const indices: number[] = [];
      for (let i = Math.max(0, startIndex); i <= Math.min(totalPages - 1, endIndex); i++) {
        indices.push(i);
      }

      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const filename = `converthub_split_${range.replace("-", "_")}.pdf`;
      const { downloadFile } = await import("@/lib/download");
      downloadFile(pdfBytes, filename, "application/pdf");
      setSuccess(true);
    } catch (err: any) {
      console.error("Splitting failed:", err);
      setError(err.message || "Failed to split PDF. Please check your page range (e.g., 1-3).");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-3xl mx-auto font-jakarta">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-red-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
          <Scissors className="w-9 h-9" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Split PDF</h1>
        <p className="text-muted-foreground text-lg">Extract pages from your PDF or split into individual files.</p>
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
          onFileSelect={(f) => { setFile(f); setError(null); }}
          accept={{ "application/pdf": [".pdf"] }}
          label="Select PDF to split"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border rounded-[3rem] p-12 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-3xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
              <FileIcon className="w-8 h-8" />
            </div>
            <div className="min-w-0 flex-grow">
              <p className="font-bold text-xl truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">Ready to split</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-2">Page Range</label>
            <div className="relative">
              <input
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. 1-5"
                className="w-full p-6 bg-background border-2 rounded-2xl text-2xl font-bold focus:border-red-500 outline-none transition-all pr-32"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Range
              </div>
            </div>
            <p className="text-xs text-muted-foreground px-2">{"Use format like '1-3' for a range or just '2' for a single page."}</p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic mb-6"
            >
              <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
              <div>
                <p className="text-lg">Split Complete!</p>
                <p className="text-sm font-medium opacity-80">Your split PDF has been downloaded.</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setFile(null); setError(null); setSuccess(false); }}
              className="py-5 bg-secondary text-secondary-foreground rounded-[2rem] font-bold text-lg hover:bg-secondary/80 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={splitPdf}
              disabled={isSplitting}
              className="py-5 bg-red-500 text-white rounded-[2rem] font-extrabold text-xl shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSplitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scissors className="w-6 h-6" />}
              Split PDF
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
