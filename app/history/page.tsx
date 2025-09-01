"use client";

import { useState, useEffect } from "react";
import useStore from "@/lib/store";
import { History, Play, RefreshCw, Trash2, Clock } from "lucide-react";

export default function HistoryPage() {
  const { history, clearHistory } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const formatSettings = (settings: any) => {
    return `${settings.resolution} • ${settings.fps}fps • ${settings.fitMode}`;
  };

  if (!isClient) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            変換履歴
          </h1>
          <p className="text-muted-foreground">
            過去の変換履歴を確認できます（セッション内のみ）
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            履歴クリア
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <History className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            履歴がありません
          </h3>
          <p className="text-muted-foreground mb-6">
            まだファイルの変換を行っていません
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            変換を開始
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {item.fileName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatSettings(item.settings)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(item.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-muted-foreground">解像度</span>
                  <span className="font-medium">{item.settings.resolution}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">FPS</span>
                  <span className="font-medium">{item.settings.fps}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">フィット</span>
                  <span className="font-medium capitalize">{item.settings.fitMode}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">音量調整</span>
                  <span className="font-medium">
                    {item.settings.volumeGain > 0 ? '+' : ''}{item.settings.volumeGain}dB
                  </span>
                </div>
              </div>
              
              {item.settings.title && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">タイトル: </span>
                  <span className="text-sm font-medium">{item.settings.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}