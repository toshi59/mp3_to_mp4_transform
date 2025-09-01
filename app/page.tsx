"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ConversionSettings from "@/components/ConversionSettings";
import ConversionProgress from "@/components/ConversionProgress";
import VideoPreview from "@/components/VideoPreview";
import useStore from "@/lib/store";
import { convertToMP4, ConversionProgress as Progress } from "@/lib/ffmpeg-worker";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  
  const { settings, addToHistory } = useStore();

  const handleConvert = async () => {
    if (!audioFile) {
      setError("MP3ファイルを選択してください");
      return;
    }

    setIsConverting(true);
    setError(null);
    setVideoBlob(null);
    setLogs([]);

    try {
      const blob = await convertToMP4(
        {
          audioFile,
          imageFile,
          ...settings,
        },
        (progress) => {
          setProgress(progress);
          setLogs((prev) => [...prev, progress.message]);
        }
      );

      setVideoBlob(blob);
      
      addToHistory({
        fileName: audioFile.name,
        settings,
        duration: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "変換中にエラーが発生しました");
      setProgress(null);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setAudioFile(null);
    setImageFile(null);
    setProgress(null);
    setLogs([]);
    setVideoBlob(null);
    setError(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          MP3 to MP4 変換
        </h1>
        <p className="text-muted-foreground">
          MP3音声ファイルに画像を重ねてMP4動画を生成します
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FileUpload
            onAudioFile={setAudioFile}
            onImageFile={setImageFile}
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">エラー</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {audioFile && !isConverting && !videoBlob && (
            <div className="flex gap-3">
              <button
                onClick={handleConvert}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                変換開始
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                リセット
              </button>
            </div>
          )}

          {videoBlob && (
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              新しいファイルを変換
            </button>
          )}
        </div>

        <div className="space-y-6">
          <ConversionSettings />
          
          {(progress || logs.length > 0) && (
            <ConversionProgress progress={progress} logs={logs} />
          )}
          
          {videoBlob && (
            <VideoPreview
              videoBlob={videoBlob}
              fileName={`${audioFile?.name.replace('.mp3', '')}_converted.mp4`}
            />
          )}
        </div>
      </div>
    </div>
  );
}