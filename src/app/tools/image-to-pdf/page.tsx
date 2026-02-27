"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Image as ImageIcon, Download, File as FileIcon, Loader2, Plus, X, GripVertical, AlertCircle, CheckCircle2 } from "lucide-react";

import { useDropzone } from "react-dropzone";
import { motion, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ImageToPdfPage() {
    const [images, setImages] = useState<{ file: File; data: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onDrop = (acceptedFiles: File[]) => {
        setError(null);
        setSuccess(false);
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prev => [...prev, { file, data: e.target?.result as string }]);
            };
            reader.onerror = () => setError("Failed to read image file.");
            reader.readAsDataURL(file);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    });

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const convertToPdf = async () => {
        if (images.length === 0) return;
        setIsProcessing(true);
        setError(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const imgData of images) {
                const imgBytes = await fetch(imgData.data).then(res => res.arrayBuffer());
                let pdfImage;
                const type = imgData.file.type;

                if (type === 'image/jpeg' || type === 'image/jpg') {
                    pdfImage = await pdfDoc.embedJpg(imgBytes);
                } else {
                    pdfImage = await pdfDoc.embedPng(imgBytes);
                }

                const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
                page.drawImage(pdfImage, {
                    x: 0,
                    y: 0,
                    width: pdfImage.width,
                    height: pdfImage.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const { downloadFile } = await import("@/lib/download");
            downloadFile(pdfBytes, "converthub_images.pdf", "application/pdf");
            setSuccess(true);
        } catch (err) {
            console.error("Conversion failed:", err);
            setError("Failed to create PDF. Some images may be incompatible or too large.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto font-jakarta">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-blue-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl mx-auto mb-6">
                    <ImageIcon className="w-9 h-9" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">Image to PDF</h1>
                <p className="text-muted-foreground text-lg">Convert JPG, PNG, and WebP images to high-quality PDF docs.</p>
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

            <div className="space-y-12">
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-4 border-dashed rounded-[3rem] p-16 text-center transition-all cursor-pointer group relative overflow-hidden",
                        isDragActive ? "border-blue-500 bg-blue-50" : "border-border hover:border-blue-500/50 hover:bg-secondary/30 shadow-inner"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xl font-bold">Select images</p>
                            <p className="text-muted-foreground">or drag and drop them here</p>
                        </div>
                    </div>
                </div>

                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between px-4">
                            <h2 className="font-bold text-2xl">{images.length} Images</h2>
                            <p className="text-sm text-muted-foreground">Drag to rearrange pages</p>
                        </div>

                        <Reorder.Group
                            axis="y"
                            values={images}
                            onReorder={setImages}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {images.map((img, index) => (
                                <Reorder.Item
                                    key={img.file.name + index}
                                    value={img}
                                    className="bg-card border rounded-3xl p-4 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-200 transition-all group overflow-hidden"
                                >
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative bg-secondary/30">
                                        <img src={img.data} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform md:opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
                                            Page {index + 1}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <p className="font-bold text-sm truncate">{img.file.name}</p>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <div className="sticky bottom-8 left-0 right-0 max-w-md mx-auto z-10">
                            <button
                                onClick={convertToPdf}
                                disabled={isProcessing}
                                className="w-full py-5 bg-blue-500 text-white rounded-[2rem] font-extrabold text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                                Convert to PDF
                            </button>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-[2rem] flex items-center gap-4 font-bold italic mt-6"
                                >
                                    <CheckCircle2 className="w-8 h-8 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg">Convert Successful!</p>
                                        <p className="text-sm font-medium opacity-80">Images have been merged into a PDF.</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
