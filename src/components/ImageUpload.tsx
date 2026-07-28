"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 900;
        let { width, height } = img;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
      img.src = url;
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 10 * 1024 * 1024) {
          setError(`${file.name} is too large (max 10MB)`);
          continue;
        }
        const base64 = await compressImage(file);
        newImages.push(base64);
      }
      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    } catch {
      setError("Failed to process images. Try again.");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const urls = urlInput.split(",").map((u) => u.trim()).filter((u) => u.startsWith("http"));
    if (urls.length > 0) {
      onChange([...images, ...urls]);
      setUrlInput("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleReorder = (from: number, to: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt={`Car image ${i + 1}`}
                className="w-28 h-20 object-cover rounded-lg border-2 border-gray-200"
              />
              {i === 0 && (
                <span className="absolute top-0 left-0 bg-blue-900 text-white text-[10px] px-1.5 py-0.5 rounded-tl-lg rounded-br-lg font-bold">
                  MAIN
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(i, i - 1)}
                    className="bg-white text-gray-700 w-6 h-6 rounded text-xs hover:bg-blue-100"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="bg-red-500 text-white w-6 h-6 rounded text-xs hover:bg-red-600"
                  title="Remove"
                >
                  ✕
                </button>
                {i < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(i, i + 1)}
                    className="bg-white text-gray-700 w-6 h-6 rounded text-xs hover:bg-blue-100"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
              <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl-lg text-center w-full">
                {i === 0 ? "1st" : `${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
        />
        <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {uploading ? (
          <p className="text-blue-600 font-medium">Processing...</p>
        ) : (
          <>
            <p className="text-gray-600 font-medium">Click or drag images here to upload</p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP — Max 10MB each (auto-compressed) — {images.length}/{maxImages} used
            </p>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL(s) separated by commas..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Add URL
        </button>
      </div>
    </div>
  );
}
