"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { Stamp, Download, Plus, X, File as FileIcon, Loader2, AlertCircle, Type, ImageIcon, Settings2, Sliders, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";


export default function WatermarkPdfPage() {
    const [file, setFile] = useState<File | null>(null);
    const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Text Watermark Settings
    const [text, setText] = useState("CONFIDENTIAL");
    const [fontSize, setFontSize] = useState(50);
    const [opacity, setOpacity] = useState(0.4);
    const [rotation, setRotation] = useState(-45);
    const [textColor, setTextColor] = useState("#000000");

    // Image Watermark Settings
    const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
    const [imgScale, setImgScale] = useState(0.5);
    const [imgOpacity, setImgOpacity] = useState(0.5);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
            setSuccess(false);
        }
    };

    const onDropImage = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setWatermarkImage(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const watermarkImgZone = useDropzone({
        onDrop: onDropImage,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        multiple: false
    });

    const addWatermark = async () => {
        if (!file) return;
        if (watermarkType === "image" && !watermarkImage) {
            setError("Please upload a watermark image.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            let embedImg: any = null;
            if (watermarkType === "image" && watermarkImage) {
                const imgBuffer = await watermarkImage.arrayBuffer();
                if (watermarkImage.type === "image/png") {
                    embedImg = await pdfDoc.embedPng(imgBuffer);
                } else {
                    embedImg = await pdfDoc.embedJpg(imgBuffer);
                }
            }

            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            // Hex to RGB helper
            const hexToRgb = (hex: string) => {
                const r = parseInt(hex.slice(1, 3), 16) / 255;
                const g = parseInt(hex.slice(3, 5), 16) / 255;
                const b = parseInt(hex.slice(5, 7), 16) / 255;
                return rgb(r, g, b);
            };

            for (const page of pages) {
                const { width, height } = page.getSize();

                if (watermarkType === "text") {
                    page.drawText(text, {
                        x: width / 2 - (font.widthOfTextAtSize(text, fontSize) / 2),
                        y: height / 2,
                        size: fontSize,
                        font,
                        color: hexToRgb(textColor),
                        opacity: opacity,
                        rotate: degrees(rotation),
                    });
                } else if (embedImg) {
                    const dims = embedImg.scale(imgScale);
                    page.drawImage(embedImg, {
                        x: width / 2 - dims.width / 2,
                        y: height / 2 - dims.height / 2,
                        width: dims.width,
                        height: dims.height,
                        opacity: imgOpacity,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const { downloadFile } = await import("@/lib/download");
            await downloadFile(pdfBytes, `watermarked_${file.name.replace(/\.[^/.]+$/, "")}.pdf`, "application/pdf");
            setSuccess(true);
        } catch (err) {
            console.error("Watermarking failed:", err);
            setError("Failed to add watermark. The file might be protected.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <Stamp className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#202124]">Watermark PDF</h1>
                <p className="text-muted-foreground text-lg">Add text or image stamps to your PDF with custom styles and transparency.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-4 border-dashed rounded-[3.5rem] p-20 text-center transition-all cursor-pointer group relative overflow-hidden h-[400px] flex flex-col items-center justify-center",
                                isDragActive ? "border-amber-500 bg-amber-50" : "border-[#DADCE0] hover:border-amber-500/50 hover:bg-secondary/30"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                <Plus className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black italic mb-2">Select PDF file</h3>
                            <p className="text-muted-foreground font-medium">or drag and drop it here</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border rounded-[3rem] p-12 shadow-2xl space-y-8 relative overflow-hidden"
                        >
                            <div className="absolute top-8 right-8">
                                <button onClick={() => setFile(null)} className="p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                                    <FileIcon className="w-12 h-12" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-3xl font-black italic truncate max-w-[400px]">{file.name}</h3>
                                    <p className="text-[#5F6368] font-bold text-lg">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for Stamping</p>
                                </div>
                            </div>

                            <div className="bg-secondary/20 rounded-[2.5rem] p-10 border border-dashed flex items-center justify-center min-h-[300px]">
                                {watermarkType === "text" ? (
                                    <div
                                        style={{
                                            fontSize: `${fontSize}px`,
                                            opacity: opacity,
                                            transform: `rotate(${rotation}deg)`,
                                            color: textColor
                                        }}
                                        className="font-black break-all text-center"
                                    >
                                        {text || "PREVIEW"}
                                    </div>
                                ) : watermarkImage ? (
                                    <img
                                        src={URL.createObjectURL(watermarkImage)}
                                        alt="Watermark"
                                        style={{ opacity: imgOpacity, transform: `scale(${imgScale * 2})` }}
                                        className="max-h-[200px] object-contain"
                                    />
                                ) : (
                                    <p className="text-muted-foreground font-bold italic">Upload a watermark image to preview</p>
                                )}
                            </div>

                            <button
                                onClick={addWatermark}
                                disabled={isProcessing}
                                className="w-full py-7 bg-amber-500 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 italic"
                            >
                                {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8" />}
                                Add Watermark & Download
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
                                        <p className="text-sm font-medium opacity-80">Watermarked PDF has been downloaded.</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="bg-white border border-[#DADCE0] rounded-[3rem] p-8 shadow-xl space-y-8">
                        <div className="flex items-center gap-3">
                            <Settings2 className="w-6 h-6 text-amber-500" />
                            <h3 className="text-xl font-black italic">Settings</h3>
                        </div>

                        <div className="flex bg-secondary/30 p-1.5 rounded-2xl gap-2">
                            <button
                                onClick={() => setWatermarkType("text")}
                                className={cn(
                                    "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                    watermarkType === "text" ? "bg-white shadow-md text-amber-600" : "text-muted-foreground hover:bg-white/50"
                                )}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Type className="w-4 h-4" /> Text
                                </div>
                            </button>
                            <button
                                onClick={() => setWatermarkType("image")}
                                className={cn(
                                    "flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                                    watermarkType === "image" ? "bg-white shadow-md text-amber-600" : "text-muted-foreground hover:bg-white/50"
                                )}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> Image
                                </div>
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {watermarkType === "text" ? (
                                <motion.div
                                    key="text-settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368] ml-2">Watermark Text</label>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 ring-amber-500/10 focus:border-amber-500 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368]">Opacity</label>
                                            <span className="text-xs font-black text-amber-600">{(opacity * 100).toFixed(0)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1" value={opacity}
                                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                            className="w-full accent-amber-500 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368] ml-2">Font Size</label>
                                            <input
                                                type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-xl p-3 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368] ml-2">Rotation</label>
                                            <input
                                                type="number" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}
                                                className="w-full bg-[#F8F9FA] border border-[#DADCE0] rounded-xl p-3 font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368] ml-2">Text Color</label>
                                        <input
                                            type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
                                            className="w-full h-12 bg-[#F8F9FA] border border-[#DADCE0] rounded-xl cursor-pointer"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="image-settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div
                                        {...watermarkImgZone.getRootProps()}
                                        className={cn(
                                            "border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all",
                                            watermarkImgZone.isDragActive ? "border-amber-500 bg-amber-50" : "border-[#DADCE0] hover:bg-secondary/30"
                                        )}
                                    >
                                        <input {...watermarkImgZone.getInputProps()} />
                                        {watermarkImage ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-bold truncate">{watermarkImage.name}</p>
                                                <X className="w-4 h-4 text-red-500 ml-auto" onClick={(e) => { e.stopPropagation(); setWatermarkImage(null); }} />
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold">Select PNG/JPG</p>
                                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Transparent PNG Recommended</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368]">Scale</label>
                                            <span className="text-xs font-black text-amber-600">{(imgScale * 100).toFixed(0)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0.1" max="2" step="0.1" value={imgScale}
                                            onChange={(e) => setImgScale(parseFloat(e.target.value))}
                                            className="w-full accent-amber-500 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5F6368]">Opacity</label>
                                            <span className="text-xs font-black text-amber-600">{(imgOpacity * 100).toFixed(0)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1" value={imgOpacity}
                                            onChange={(e) => setImgOpacity(parseFloat(e.target.value))}
                                            className="w-full accent-amber-500 h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
