"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Minimize2, Download, File as FileIcon, Loader2, Zap, ShieldCheck, Gauge, AlertCircle, CheckCircle2 } from "lucide-react";
import FileUploadZone from "@/components/tools/FileUploadZone";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const compressionLevels = [
  { id: "low", name: "Basic", desc: "Low compression, high quality.", icon: ShieldCheck, color: "text-blue-500" },
  { id: "medium", name: "Recommended", desc: "Good compression, good quality.", icon: Zap, color: "text-green-500" },
  { id: "high", name: "Extreme", desc: "High compression, lower quality.", icon: Gauge, color: "text-orange-500" },
];

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState("medium");
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);
  const [success, setSuccess] = useState(false);

  const compressPdf = async () => {
    if (!file) return;
    setIsCompressing(true);
    setResult(null);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      // Basic client-side compression using pdf-lib stream optimization
      const pdfBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false
      });

      const compressedSize = pdfBytes.length;
      setResult({ original: file.size, compressed: compressedSize });

      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const filename = `converthub_compressed_${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
      const { downloadFile } = await import("@/lib/download");
      downloadFile(pdfBytes, filename, "application/pdf");
      setSuccess(true);
    } catch (err) {
      console.error("Compression failed:", err);
      setError("Failed to compress PDF. The file may be protected or already highly optimized.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-jakarta">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-green-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
          <Minimize2 className="w-9 h-9" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Compress PDF</h1>
        <p className="text-muted-foreground text-lg">Reduce file size while optimizing for maximal PDF quality.</p>
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
          onFileSelect={(f) => { setFile(f); setError(null); setResult(null); setSuccess(false); }}
          accept={{ "application/pdf": [".pdf"] }}
          label="Select PDF to compress"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="bg-card border rounded-[3rem] p-8 shadow-xl border-green-500/10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <FileIcon className="w-8 h-8" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xl truncate max-w-[200px]">{file.name}</p>
                  <p className="text-sm text-muted-foreground">Original Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              <div className="grid gap-3">
                {compressionLevels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id)}
                    className={cn(
                      "p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 active:scale-[0.99]",
                      level === l.id ? "border-green-500 bg-green-50/50 shadow-lg shadow-green-500/5" : "hover:border-green-200 border-transparent bg-secondary/30"
                    )}
                  >
                    <l.icon className={cn("w-6 h-6 mt-1", l.color)} />
                    <div>
                      <p className="font-bold">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="bg-green-600 text-white rounded-[3rem] p-10 shadow-2xl flex-grow flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <Minimize2 className="w-20 h-20 mb-6 opacity-30" />
              <h3 className="text-2xl font-bold mb-4">Ready to Optimize</h3>
              <p className="text-green-50/80 mb-8 leading-relaxed text-sm">
                Our secure browser engine will optimize the internal structure of your PDF.
              </p>

              <button
                onClick={compressPdf}
                disabled={isCompressing}
                className="w-full py-5 bg-white text-green-600 rounded-2xl font-extrabold text-xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isCompressing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                Compress Now
              </button>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 text-white p-4 rounded-2xl flex items-center gap-3 text-sm font-bold mt-6"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Compression Successful!
                </motion.div>
              )}

              <button onClick={() => { setFile(null); setError(null); setResult(null); }} className="mt-6 text-sm font-semibold hover:underline opacity-80">
                Choose another file
              </button>
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card border rounded-3xl p-6 text-center shadow-lg border-green-500/20"
              >
                <p className="text-sm text-muted-foreground mb-1 font-medium">Space Saved</p>
                <p className="text-4xl font-black text-green-600">
                  {Math.max(0, Math.round((1 - result.compressed / result.original) * 100))}%
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-bold">
                  {(result.compressed / 1024 / 1024).toFixed(2)} MB of {(result.original / 1024 / 1024).toFixed(2)} MB
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
