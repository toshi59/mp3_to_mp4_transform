import { create } from 'zustand';

export interface ConversionSettings {
  resolution: string;
  fps: number;
  fitMode: 'cover' | 'contain';
  volumeGain: number;
  title?: string;
}

export interface ConversionHistory {
  id: string;
  timestamp: number;
  fileName: string;
  settings: ConversionSettings;
  duration?: number;
  thumbnail?: string;
}

interface AppState {
  settings: ConversionSettings;
  history: ConversionHistory[];
  updateSettings: (settings: Partial<ConversionSettings>) => void;
  addToHistory: (item: Omit<ConversionHistory, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const useStore = create<AppState>((set) => ({
  settings: {
    resolution: '1280x720',
    fps: 30,
    fitMode: 'cover',
    volumeGain: 0,
  },
  history: [],
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
  addToHistory: (item) =>
    set((state) => ({
      history: [
        {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        },
        ...state.history.slice(0, 9),
      ],
    })),
  clearHistory: () => set({ history: [] }),
}));

export default useStore;