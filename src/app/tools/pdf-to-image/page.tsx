"use client";

import { useState } from "react";
import { FileType, Download, File as FileIcon, Loader2, Sparkles, Image as ImageIcon, AlertCircle } from "lucide-react";
import FileUploadZone from "@/components/tools/FileUploadZone";
import { motion, AnimatePresence } from "framer-motion";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const convertPdfToImages = async (selectedFile: File) => {
    setIsProcessing(true);
    setPreviews([]);
    setError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjsLib.version + "/pdf.worker.min.js";

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const imageUrls: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await (page as any).render({
            canvasContext: context,
            viewport,
            canvas: canvas as any
          }).promise;
          const dataUrl = canvas.toDataURL("image/png");
          imageUrls.push(dataUrl);
        }
      }

      setPreviews(imageUrls);

      if (numPages > 1) {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        imageUrls.forEach((dataUrl, i) => {
          const base64Data = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "");
          zip.file("page_" + (i + 1) + ".png", base64Data, { base64: true });
        });
        const content = await zip.generateAsync({ type: "blob" });
        const { downloadBlob } = await import("@/lib/download");
        downloadBlob(content, "converthub_images.zip");
      } else if (numPages === 1) {
        downloadSingle(imageUrls[0], 0);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      setError("Failed to convert PDF to images. The file may be protected or contain complex vectors.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = async (dataUrl: string, index: number) => {
    try {
      const { downloadDataUrl } = await import("@/lib/download");
      downloadDataUrl(dataUrl, "converthub_page_" + (index + 1) + ".png");
    } catch (err) {
      setError("Download failed. Please try again.");
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setPreviews([]);
    convertPdfToImages(selectedFile);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto font-jakarta">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
          <FileType className="w-9 h-9" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">PDF to Image</h1>
        <p className="text-muted-foreground text-lg">Extract pages from your PDF and convert them to high-quality PNGs.</p>
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
          accept={{ "application/pdf": [".pdf"] }}
          label="Select PDF to extract images"
        />
      ) : (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-card border rounded-[3rem] shadow-2xl overflow-hidden relative border-rose-500/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-500" />
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center shadow-inner">
                <FileIcon className="w-10 h-10" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-2xl truncate max-w-[300px]">{file.name}</p>
                <div className="flex items-center gap-2 text-sm text-rose-500 font-bold mt-1">
                  <Sparkles className="w-4 h-4" /> {isProcessing ? "Processing..." : "Ready to Extract"}
                </div>
              </div>
            </div>

            <button
              onClick={() => convertPdfToImages(file)}
              disabled={isProcessing}
              className="px-10 py-5 bg-rose-500 text-white rounded-[2rem] font-extrabold text-xl shadow-xl shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
              {isProcessing ? "Extracting..." : "Download ZIP"}
            </button>
          </div>

          <AnimatePresence>
            {previews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {previews.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border rounded-3xl p-4 shadow-sm group hover:shadow-xl transition-all border-rose-500/5 hover:border-rose-500/20"
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-secondary/30 mb-4 border">
                      <img src={preview} alt={"page " + (index + 1)} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => downloadSingle(preview, index)}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-2xl hover:scale-110 transition-transform"
                        >
                          <Download className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
                        Page {index + 1}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Image {index + 1}</p>
                      <ImageIcon className="w-4 h-4 text-rose-500/30" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center">
            <button onClick={() => { setFile(null); setPreviews([]); setError(null); }} className="text-muted-foreground font-semibold hover:text-primary transition-colors underline underline-offset-8 decoration-rose-500/20 hover:decoration-rose-500 transition-all">
              Upload different file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
