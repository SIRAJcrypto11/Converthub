"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, CheckCircle2, FileText, Image, File, FileArchive, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
    onFilesSelect?: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxSize?: number;
    label?: string;
    multiple?: boolean;
    maxFiles?: number;
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(file: File) {
    const type = file.type;
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-400" />;
    if (type.includes("image")) return <Image className="w-5 h-5 text-blue-400" />;
    if (type.includes("word") || type.includes("document")) return <FileText className="w-5 h-5 text-blue-500" />;
    if (type.includes("zip") || type.includes("archive")) return <FileArchive className="w-5 h-5 text-yellow-400" />;
    return <File className="w-5 h-5 text-gray-400" />;
}

export default function FileUploadZone({
    onFileSelect,
    onFilesSelect,
    accept,
    maxSize = 50 * 1024 * 1024,
    label = "Upload file",
    multiple = false,
    maxFiles = 10,
}: FileUploadZoneProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setError(null);
            if (rejectedFiles.length > 0) {
                const err = rejectedFiles[0].errors[0];
                if (err.code === "file-too-large") {
                    setError(`File terlalu besar. Maksimal ${formatFileSize(maxSize)}.`);
                } else if (err.code === "file-invalid-type") {
                    setError("Format file tidak didukung.");
                } else {
                    setError(err.message);
                }
                return;
            }
            if (acceptedFiles.length > 0) {
                if (multiple) {
                    const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxFiles);
                    setSelectedFiles(newFiles);
                    onFilesSelect?.(newFiles);
                    if (newFiles.length > 0) onFileSelect(newFiles[0]);
                } else {
                    const file = acceptedFiles[0];
                    setSelectedFiles([file]);
                    onFileSelect(file);
                    // Simulate progress
                    setUploadProgress(0);
                    const interval = setInterval(() => {
                        setUploadProgress((prev) => {
                            if (prev >= 100) { clearInterval(interval); return 100; }
                            return prev + 20;
                        });
                    }, 80);
                }
            }
        },
        [onFileSelect, onFilesSelect, selectedFiles, multiple, maxFiles, maxSize]
    );

    const removeFile = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        setUploadProgress(0);
        setError(null);
        if (newFiles.length > 0) {
            onFileSelect(newFiles[0]);
            onFilesSelect?.(newFiles);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple,
    });

    return (
        <div className="w-full space-y-3">
            <motion.div
                {...getRootProps()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                    isDragActive
                        ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                        : selectedFiles.length > 0
                            ? "border-green-500 bg-green-500/5"
                            : "border-gray-600 bg-gray-800/50 hover:border-gray-400 hover:bg-gray-800"
                )}
            >
                <input {...getInputProps()} />
                <AnimatePresence mode="wait">
                    {isDragActive ? (
                        <motion.div
                            key="drag"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <motion.div
                                animate={{ y: [-4, 4, -4] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Upload className="w-12 h-12 text-blue-400" />
                            </motion.div>
                            <p className="text-blue-400 font-semibold text-lg">Lepaskan file di sini...</p>
                        </motion.div>
                    ) : selectedFiles.length > 0 && !multiple ? (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                            <p className="text-green-400 font-semibold">{selectedFiles[0].name}</p>
                            <p className="text-gray-400 text-sm">{formatFileSize(selectedFiles[0].size)}</p>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="w-full max-w-xs bg-gray-700 rounded-full h-2 mt-2">
                                    <motion.div
                                        className="bg-green-500 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                            )}
                            <p className="text-gray-500 text-xs mt-1">Klik untuk mengganti file</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-gray-200 font-semibold text-lg">{label}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Drag & drop atau <span className="text-blue-400 underline">pilih file</span>
                                </p>
                                <p className="text-gray-500 text-xs mt-1">Maks. {formatFileSize(maxSize)}{multiple ? ` · hingga ${maxFiles} file` : ""}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Multiple file list */}
            {multiple && selectedFiles.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                >
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                        {selectedFiles.length} file dipilih
                    </p>
                    {selectedFiles.map((file, index) => (
                        <motion.div
                            key={`${file.name}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {getFileIcon(file)}
                                <div className="min-w-0">
                                    <p className="text-gray-200 text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => removeFile(index, e)}
                                className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 hover:bg-red-500/20 hover:text-red-400 text-gray-400 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}