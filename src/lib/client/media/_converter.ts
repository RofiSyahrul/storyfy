import { dev } from '$app/environment';

interface FfmpegRunOptions {
  MEMFS: Array<{ name: string; data: string | ArrayBuffer }>;
  arguments: string[];
}

interface FfmpegResult {
  MEMFS: { data: Uint8Array }[];
}

interface FfmpegPostMessage<T extends string, TData = unknown> {
  type: T;
  data: TData;
}

interface FfmpegPostMessageRequest extends FfmpegRunOptions {
  type: 'run';
}

type FfmpegPostMessageResponse =
  | FfmpegPostMessage<'ready' | 'run', null>
  | FfmpegPostMessage<'stdout' | 'stderr' | 'error' | 'abort', string>
  | FfmpegPostMessage<'done', FfmpegResult>;

function blobToArrayBuffer(blob: Blob) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) resolve(result);
      else reject('Failed to read blob');
    };

    reader.onerror = () => {
      reject('Failed to read blob');
    };

    reader.readAsArrayBuffer(blob);
  });
}

export async function convertWebmToMp4(blob: Blob, fileName: string) {
  const buffer = await blobToArrayBuffer(blob);
  const FfmpegWorker = (await import('ffmpeg.js/ffmpeg-worker-mp4?worker')).default;
  const worker = new FfmpegWorker();

  return new Promise<Blob>((resolve, reject) => {
    worker.onmessage = ({ data }: MessageEvent<FfmpegPostMessageResponse>) => {
      switch (data.type) {
        case 'ready': {
          const payload: FfmpegPostMessageRequest = {
            type: 'run',
            MEMFS: [{ name: `${fileName}.webm`, data: buffer }],
            arguments: [
              '-fflags',
              '+genpts',
              '-i',
              `${fileName}.webm`,
              '-vf',
              'crop=trunc(iw/2)*2:trunc(ih/2)*2',
              '-r',
              '24',
              `${fileName}.mp4`,
            ],
          };
          worker.postMessage(payload);
          break;
        }

        case 'stderr':
        case 'stdout': {
          if (dev) {
            // eslint-disable-next-line no-console
            console.log('STD', fileName, data.type, data.data);
          }
          break;
        }

        case 'error':
        case 'abort': {
          reject(data.data);
          break;
        }

        case 'done': {
          const uint8Array = data?.data?.MEMFS?.[0]?.data;

          if (!uint8Array?.length) {
            reject('No data');
            break;
          }

          resolve(new Blob([uint8Array], { type: 'video/mp4' }));
          break;
        }

        default:
          break;
      }
    };
  });
}
