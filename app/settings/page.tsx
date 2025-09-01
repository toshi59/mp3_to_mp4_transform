"use client";

import { useState, useEffect } from "react";
import useStore from "@/lib/store";
import { Settings, Trash2, Zap, Info, Key } from "lucide-react";

export default function SettingsPage() {
  const { clearHistory } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [workerMode, setWorkerMode] = useState(true);
  const [wasmMemory, setWasmMemory] = useState(256);

  useEffect(() => {
    setIsClient(true);
    
    const savedWorkerMode = localStorage.getItem('workerMode');
    const savedWasmMemory = localStorage.getItem('wasmMemory');
    
    if (savedWorkerMode !== null) {
      setWorkerMode(JSON.parse(savedWorkerMode));
    }
    if (savedWasmMemory !== null) {
      setWasmMemory(parseInt(savedWasmMemory));
    }
  }, []);

  const handleWorkerModeChange = (enabled: boolean) => {
    setWorkerMode(enabled);
    if (isClient) {
      localStorage.setItem('workerMode', JSON.stringify(enabled));
    }
  };

  const handleMemoryChange = (memory: number) => {
    setWasmMemory(memory);
    if (isClient) {
      localStorage.setItem('wasmMemory', memory.toString());
    }
  };

  const handleClearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      alert('キャッシュがクリアされました');
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary rounded w-48 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          設定
        </h1>
        <p className="text-muted-foreground">
          アプリケーションの動作設定を変更できます
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">パフォーマンス設定</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Web Worker使用</label>
                <p className="text-xs text-muted-foreground">
                  有効にするとUIがブロックされずに変換処理が実行されます
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleWorkerModeChange(!workerMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    workerMode ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      workerMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                WASMメモリ制限 (MB)
              </label>
              <select
                value={wasmMemory}
                onChange={(e) => handleMemoryChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={128}>128 MB (軽量)</option>
                <option value={256}>256 MB (標準)</option>
                <option value={512}>512 MB (高速)</option>
                <option value={1024}>1024 MB (最高速)</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                大きなファイルの処理時に必要に応じて増やしてください
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">データ管理</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">変換履歴をクリア</label>
                <p className="text-xs text-muted-foreground">
                  保存されている変換履歴を削除します
                </p>
              </div>
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                履歴クリア
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">キャッシュをクリア</label>
                <p className="text-xs text-muted-foreground">
                  ローカルストレージとブラウザキャッシュを削除します
                </p>
              </div>
              <button
                onClick={handleClearCache}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                キャッシュクリア
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">API設定</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    外部API連携なし
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    現在このアプリケーションは外部APIを使用していません。
                    すべての処理はブラウザ内で完結します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">アプリケーション情報</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-muted-foreground">バージョン</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div>
              <span className="block text-muted-foreground">技術スタック</span>
              <span className="font-medium">Next.js + FFmpeg.wasm</span>
            </div>
            <div>
              <span className="block text-muted-foreground">処理方式</span>
              <span className="font-medium">クライアントサイド</span>
            </div>
            <div>
              <span className="block text-muted-foreground">対応フォーマット</span>
              <span className="font-medium">MP3 → MP4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}