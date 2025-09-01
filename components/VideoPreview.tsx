"use client";

import { useRef, useEffect } from "react";
import { Download, Play, Pause } from "lucide-react";

interface VideoPreviewProps {
  videoBlob: Blob | null;
  fileName?: string;
}

const VideoPreview = ({ videoBlob, fileName = "output.mp4" }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (videoBlob && videoRef.current) {
      const url = URL.createObjectURL(videoBlob);
      videoRef.current.src = url;
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoBlob]);

  const handleDownload = () => {
    if (videoBlob && downloadLinkRef.current) {
      const url = URL.createObjectURL(videoBlob);
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = fileName;
      downloadLinkRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!videoBlob) return null;

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">プレビュー</h3>
      
      <div className="space-y-4">
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            controls
            className="w-full max-h-[400px]"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span className="font-medium">ダウンロード</span>
          </button>
        </div>
        
        <a ref={downloadLinkRef} className="hidden" />
      </div>
    </div>
  );
};

export default VideoPreview;