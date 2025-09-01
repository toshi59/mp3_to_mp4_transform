"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X, FileAudio, Image } from "lucide-react";

interface FileUploadProps {
  onAudioFile: (file: File) => void;
  onImageFile: (file: File | null) => void;
}

const FileUpload = ({ onAudioFile, onImageFile }: FileUploadProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{ audio?: string; image?: string }>({});
  
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const validateAudioFile = (file: File): boolean => {
    setErrors((prev) => ({ ...prev, audio: undefined }));
    
    if (!file.type.includes("audio/mpeg") && !file.name.endsWith(".mp3")) {
      setErrors((prev) => ({ ...prev, audio: "MP3ファイルのみ対応しています" }));
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, audio: "ファイルサイズは50MB以下にしてください" }));
      return false;
    }
    
    return true;
  };

  const validateImageFile = (file: File): boolean => {
    setErrors((prev) => ({ ...prev, image: undefined }));
    
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const validExtensions = [".png", ".jpg", ".jpeg", ".webp"];
    
    if (!validTypes.includes(file.type) && !validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setErrors((prev) => ({ ...prev, image: "PNG/JPG/WEBP画像のみ対応しています" }));
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "画像サイズは10MB以下にしてください" }));
      return false;
    }
    
    return true;
  };

  const handleAudioFile = (file: File) => {
    if (validateAudioFile(file)) {
      setAudioFile(file);
      onAudioFile(file);
    }
  };

  const handleImageFile = (file: File | null) => {
    if (file && !validateImageFile(file)) return;
    setImageFile(file);
    onImageFile(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    files.forEach((file) => {
      if (file.type.includes("audio") || file.name.endsWith(".mp3")) {
        handleAudioFile(file);
      } else if (file.type.includes("image")) {
        handleImageFile(file);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">ファイルをドラッグ&ドロップ</p>
        <p className="text-sm text-muted-foreground mb-4">または下のボタンから選択</p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => audioInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            MP3を選択
          </button>
          <button
            onClick={() => imageInputRef.current?.click()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            画像を選択（任意）
          </button>
        </div>
        
        <input
          ref={audioInputRef}
          type="file"
          accept=".mp3,audio/mpeg"
          onChange={(e) => e.target.files?.[0] && handleAudioFile(e.target.files[0])}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/*"
          onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      {(audioFile || imageFile) && (
        <div className="space-y-2">
          {audioFile && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <FileAudio className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAudioFile(null);
                  onAudioFile(null as any);
                }}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {imageFile && (
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{imageFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleImageFile(null)}
                className="p-1 hover:bg-accent rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {(errors.audio || errors.image) && (
        <div className="space-y-1">
          {errors.audio && (
            <p className="text-sm text-red-600">{errors.audio}</p>
          )}
          {errors.image && (
            <p className="text-sm text-red-600">{errors.image}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;