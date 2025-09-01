"use client";

import { ConversionProgress as Progress } from "@/lib/ffmpeg-worker";
import { Loader2, CheckCircle } from "lucide-react";

interface ConversionProgressProps {
  progress: Progress | null;
  logs: string[];
}

const ConversionProgress = ({ progress, logs }: ConversionProgressProps) => {
  if (!progress) return null;

  const getStepLabel = (step: Progress['step']) => {
    switch (step) {
      case 'preparing':
        return '準備中';
      case 'encoding':
        return 'エンコード中';
      case 'finalizing':
        return '最終処理';
      case 'complete':
        return '完了';
    }
  };

  const getStepColor = (step: Progress['step']) => {
    switch (step) {
      case 'complete':
        return 'text-green-600';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${getStepColor(progress.step)}`}>
            {getStepLabel(progress.step)}
          </span>
          <span className="text-sm font-medium">
            {progress.percent}%
          </span>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          {progress.step === 'complete' ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          )}
          <p className="text-sm text-muted-foreground">
            {progress.message}
          </p>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium mb-2">ログ</h3>
          <div className="bg-secondary rounded p-3 max-h-32 overflow-y-auto">
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-muted-foreground font-mono">
                {log}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionProgress;