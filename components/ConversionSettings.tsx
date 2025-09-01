"use client";

import useStore from "@/lib/store";
import { Settings2 } from "lucide-react";

const resolutionPresets = [
  { label: "720p (1280x720)", value: "1280x720" },
  { label: "1080p Square (1080x1080)", value: "1080x1080" },
  { label: "1080p (1920x1080)", value: "1920x1080" },
];

const fpsOptions = [15, 24, 30, 60];

const ConversionSettings = () => {
  const { settings, updateSettings } = useStore();

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">変換設定</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            解像度
          </label>
          <select
            value={settings.resolution}
            onChange={(e) => updateSettings({ resolution: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {resolutionPresets.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            背景フィット
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateSettings({ fitMode: "cover" })}
              className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                settings.fitMode === "cover"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-secondary"
              }`}
            >
              Cover
            </button>
            <button
              onClick={() => updateSettings({ fitMode: "contain" })}
              className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                settings.fitMode === "contain"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-secondary"
              }`}
            >
              Contain
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            フレームレート (FPS)
          </label>
          <select
            value={settings.fps}
            onChange={(e) => updateSettings({ fps: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {fpsOptions.map((fps) => (
              <option key={fps} value={fps}>
                {fps} fps
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            音量ゲイン調整
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="-10"
              max="10"
              value={settings.volumeGain}
              onChange={(e) => updateSettings({ volumeGain: Number(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">
              {settings.volumeGain > 0 ? "+" : ""}{settings.volumeGain} dB
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            タイトル (任意)
          </label>
          <input
            type="text"
            value={settings.title || ""}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder="動画のタイトルを入力"
            className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
};

export default ConversionSettings;