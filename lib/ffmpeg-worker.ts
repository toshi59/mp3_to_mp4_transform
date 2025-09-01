import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export interface ConversionProgress {
  percent: number;
  step: 'preparing' | 'encoding' | 'finalizing' | 'complete';
  message: string;
}

export interface ConversionParams {
  audioFile: File;
  imageFile?: File | null;
  resolution: string;
  fps: number;
  fitMode: 'cover' | 'contain';
  volumeGain: number;
  title?: string;
}

const initFFmpeg = async (onProgress: (progress: ConversionProgress) => void) => {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  onProgress({
    percent: 0,
    step: 'preparing',
    message: 'FFmpegを初期化中...',
  });

  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  ffmpeg.on('progress', ({ progress }) => {
    const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));
    onProgress({
      percent,
      step: 'encoding',
      message: `エンコード中: ${percent}%`,
    });
  });

  ffmpeg.on('log', ({ message }) => {
    console.log('FFmpeg:', message);
  });

  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    onProgress({
      percent: 15,
      step: 'preparing',
      message: 'FFmpegの初期化完了',
    });
  } catch (error) {
    console.error('FFmpeg initialization error:', error);
    throw new Error('FFmpegの初期化に失敗しました。ブラウザを再読み込みしてください。');
  }

  return ffmpeg;
};

export const convertToMP4 = async (
  params: ConversionParams,
  onProgress: (progress: ConversionProgress) => void
): Promise<Blob> => {
  try {
    const ffmpegInstance = await initFFmpeg(onProgress);
    
    onProgress({
      percent: 20,
      step: 'preparing',
      message: 'ファイルを準備中...',
    });

    // ファイルをArrayBufferとして読み込み
    const audioArrayBuffer = await params.audioFile.arrayBuffer();
    await ffmpegInstance.writeFile('input.mp3', new Uint8Array(audioArrayBuffer));

    const [width, height] = params.resolution.split('x').map(Number);
    let outputArgs: string[];

    if (params.imageFile) {
      const imageArrayBuffer = await params.imageFile.arrayBuffer();
      await ffmpegInstance.writeFile('image.png', new Uint8Array(imageArrayBuffer));
      
      let filterComplex: string;
      if (params.fitMode === 'cover') {
        filterComplex = `[1:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}[v]`;
      } else {
        filterComplex = `[1:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black[v]`;
      }
      
      outputArgs = [
        '-i', 'input.mp3',
        '-loop', '1',
        '-i', 'image.png',
        '-filter_complex', filterComplex,
        '-map', '[v]',
        '-map', '0:a',
        '-c:v', 'libx264',
        '-profile:v', 'baseline',
        '-level', '3.0',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100',
        '-ac', '2',
        '-r', params.fps.toString(),
        '-movflags', '+faststart',
        '-shortest',
        '-y',
        'output.mp4'
      ];
    } else {
      outputArgs = [
        '-i', 'input.mp3',
        '-f', 'lavfi',
        '-i', `color=c=black:s=${width}x${height}:r=${params.fps}`,
        '-map', '1:v',
        '-map', '0:a',
        '-c:v', 'libx264',
        '-profile:v', 'baseline',
        '-level', '3.0',
        '-preset', 'medium',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100',
        '-ac', '2',
        '-r', params.fps.toString(),
        '-movflags', '+faststart',
        '-shortest',
        '-y',
        'output.mp4'
      ];
    }

    // 音量調整を追加
    if (params.volumeGain !== 0) {
      const volumeIndex = outputArgs.indexOf('-c:a');
      outputArgs.splice(volumeIndex, 0, '-af', `volume=${params.volumeGain}dB`);
    }

    // タイトルメタデータを追加
    if (params.title) {
      const metadataIndex = outputArgs.indexOf('-y');
      outputArgs.splice(metadataIndex, 0, '-metadata', `title=${params.title}`);
    }

    onProgress({
      percent: 30,
      step: 'encoding',
      message: 'MP4に変換中...',
    });

    await ffmpegInstance.exec(outputArgs);

    onProgress({
      percent: 90,
      step: 'finalizing',
      message: '最終処理中...',
    });

    const data = await ffmpegInstance.readFile('output.mp4');
    // FileDataを安全にBlobPartに変換
    const buffer = new ArrayBuffer((data as Uint8Array).length);
    const view = new Uint8Array(buffer);
    view.set(data as Uint8Array);
    const blob = new Blob([buffer], { type: 'video/mp4' });

    // クリーンアップ
    await ffmpegInstance.deleteFile('input.mp3');
    if (params.imageFile) {
      await ffmpegInstance.deleteFile('image.png');
    }
    await ffmpegInstance.deleteFile('output.mp4');

    onProgress({
      percent: 100,
      step: 'complete',
      message: '変換完了！',
    });

    return blob;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`変換に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};