"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    accept?: Record<string, string[]>;
    maxSize?: number;
    label?: string;
}

export default function FileUploadZone({
    onFileSelect,
    accept,
    maxSize = 10 * 1024 * 1024,
    label = "Upload file"
}: FileUploadZoneProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
    };

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer group overflow-hidden",
                isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-secondary/30",
                selectedFile ? "border-accent bg-accent/5" : ""
            )}
        >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-xl font-bold mb-1">{label}</p>
                            <p className="text-muted-foreground text-sm">Drag & drop your files here, or click to browse</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent relative">
                            <File className="w-10 h-10" />
                            <div className="absolute -top-2 -right-2 bg-background border rounded-full p-1">
                                <CheckCircle2 className="w-6 h-6 fill-accent text-background" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xl font-bold truncate max-w-[200px]">{selectedFile.name}</p>
                            <p className="text-muted-foreground text-sm">
                                {(selectedFile.size / 1024).toFixed(2)} KB • Ready to process
                            </p>
                        </div>
                        <button
                            onClick={removeFile}
                            className="mt-2 text-sm text-destructive font-semibold hover:underline flex items-center gap-1"
                        >
                            <X className="w-4 h-4" /> Remove
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {isDragActive && (
                <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
            )}
        </div>
    );
}
