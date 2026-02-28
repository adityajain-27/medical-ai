import { useState, useRef, useCallback } from "react";
import { Upload, X, Eye, Camera, ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    category: string;
    aiAnalysis?: string;
    analyzing: boolean;
}

const IMAGE_CATEGORIES = [
    { value: 'skin-rash', label: 'Skin Rash / Lesion', icon: '🔴' },
    { value: 'wound', label: 'Wound / Injury', icon: '🩹' },
    { value: 'eye', label: 'Eye Redness / Irritation', icon: '👁️' },
    { value: 'swelling', label: 'Swelling / Inflammation', icon: '🫱' },
    { value: 'other', label: 'Other Symptom', icon: '📷' },
];

// Simulated AI vision analysis results
const MOCK_ANALYSES: Record<string, string> = {
    'skin-rash': 'Visual analysis suggests possible erythematous papular rash. Pattern consistent with contact dermatitis or early-stage viral exanthem. Recommend dermatological evaluation.',
    'wound': 'Image shows open wound with surrounding erythema. Signs of possible early infection (mild edema noted). Wound care and prophylactic antibiotics may be warranted.',
    'eye': 'Significant conjunctival injection observed. Pattern suggests viral or bacterial conjunctivitis. No corneal involvement visible. Recommend ophthalmologic evaluation.',
    'swelling': 'Localized edema detected. Swelling pattern may indicate inflammatory response. Differential includes localized infection, allergic reaction, or venous insufficiency.',
    'other': 'Image uploaded successfully. AI visual analysis complete. Findings will be incorporated into the clinical assessment.',
};

interface ImageUploadProps {
    onImagesChange?: (images: UploadedImage[]) => void;
}

export default function ImageUpload({ onImagesChange }: ImageUploadProps) {
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateAnalysis = (id: string, category: string) => {
        setTimeout(() => {
            setImages(prev => {
                const updated = prev.map(img =>
                    img.id === id
                        ? { ...img, analyzing: false, aiAnalysis: MOCK_ANALYSES[category] }
                        : img
                );
                onImagesChange?.(updated);
                return updated;
            });
        }, 2000);
    };

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;
        const newImages: UploadedImage[] = Array.from(files)
            .filter(f => f.type.startsWith('image/'))
            .slice(0, 3 - images.length) // max 3 images
            .map(file => ({
                id: `img-${Date.now()}-${Math.random()}`,
                file,
                preview: URL.createObjectURL(file),
                category: 'skin-rash',
                analyzing: true,
            }));

        const updated = [...images, ...newImages];
        setImages(updated);
        onImagesChange?.(updated);
        newImages.forEach(img => simulateAnalysis(img.id, img.category));
    }, [images]);

    const removeImage = (id: string) => {
        const updated = images.filter(img => img.id !== id);
        setImages(updated);
        onImagesChange?.(updated);
    };

    const updateCategory = (id: string, category: string) => {
        const updated = images.map(img =>
            img.id === id ? { ...img, category, analyzing: true, aiAnalysis: undefined } : img
        );
        setImages(updated);
        onImagesChange?.(updated);
        simulateAnalysis(id, category);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            {images.length < 3 && (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${isDragging
                            ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-blue-100' : 'bg-slate-100'
                            }`}>
                            <Upload className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-slate-500'}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                Drag & drop or <span className="text-blue-600 underline underline-offset-2">browse</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Upload skin rash, wound, eye images (max 3)
                            </p>
                        </div>
                        <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">JPG</Badge>
                            <Badge variant="secondary" className="text-xs">PNG</Badge>
                            <Badge variant="secondary" className="text-xs">HEIC</Badge>
                        </div>
                    </div>
                </div>
            )}

            {/* Uploaded Images */}
            <AnimatePresence>
                {images.map((img) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                        <div className="flex gap-3 p-3">
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={img.preview}
                                    alt="Symptom"
                                    className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                                />
                                <button
                                    onClick={() => setPreviewImage(img.preview)}
                                    className="absolute bottom-1 right-1 w-6 h-6 bg-black/50 rounded-md flex items-center justify-center hover:bg-black/70 transition-colors"
                                >
                                    <Eye className="w-3 h-3 text-white" />
                                </button>
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-xs font-medium text-slate-700 truncate max-w-[160px]">
                                            {img.file.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {(img.file.size / 1024).toFixed(0)} KB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="p-1 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>

                                {/* Category selector */}
                                <select
                                    value={img.category}
                                    onChange={(e) => updateCategory(img.id, e.target.value)}
                                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                >
                                    {IMAGE_CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.icon} {cat.label}
                                        </option>
                                    ))}
                                </select>

                                {/* AI Analysis */}
                                {img.analyzing ? (
                                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                                        <Loader2 className="w-3 h-3 text-blue-500 animate-spin flex-shrink-0" />
                                        <span className="text-xs text-blue-700">AI Vision analyzing image...</span>
                                    </div>
                                ) : img.aiAnalysis ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                                            <span className="text-xs font-semibold text-green-700">AI Vision Analysis</span>
                                        </div>
                                        <p className="text-xs text-green-800 leading-relaxed">{img.aiAnalysis}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Full-size preview modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                        onClick={() => setPreviewImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full rounded-xl shadow-2xl"
                            />
                            <button
                                onClick={() => setPreviewImage(null)}
                                className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {images.length === 3 && (
                <p className="text-xs text-slate-500 text-center">Maximum 3 images uploaded</p>
            )}
        </div>
    );
}
