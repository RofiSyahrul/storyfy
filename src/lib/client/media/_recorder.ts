import { noop } from 'svelte/internal';

import { ONE_SECONDS_IN_MS } from '$lib/constants/times';

interface Params {
  audioStream: MediaStream;
  canvas: HTMLCanvasElement;
  /** Recording duration in seconds */
  duration: number;
  /** @default 60 */
  frameRate?: number;
  /**
   * @param progress number from `progressMin` to `progressMax`
   */
  onProgress?: (progress: number) => void;
  /** @default 100 */
  progressMax?: number;
  /** @default 0 */
  progressMin?: number;
}

let timer: ReturnType<typeof setInterval> | undefined;

export async function recordCanvasAndAudioStream({
  audioStream,
  canvas,
  duration,
  frameRate = 60,
  onProgress = noop,
  progressMax = 100,
  progressMin = 0,
}: Params): Promise<Blob | null> {
  const recordedChunks: Blob[] = [];

  const MAX_PROGRESS_VALUE = 100;
  if (progressMax > MAX_PROGRESS_VALUE) {
    progressMax = MAX_PROGRESS_VALUE;
  }

  const MIN_PROGRESS_VALUE = 0;
  if (progressMin < MIN_PROGRESS_VALUE) {
    progressMin = MIN_PROGRESS_VALUE;
  }

  if (progressMax < progressMin) {
    [progressMin, progressMax] = [progressMax, progressMin];
  }

  const progressDiff = progressMax - progressMin;

  const MIN_DURATION = 1;
  if (duration < MIN_DURATION) {
    duration = MIN_DURATION;
  }

  return new Promise<Blob | null>((resolve) => {
    const stream = canvas.captureStream(frameRate);
    const audioTracks = audioStream.getAudioTracks();
    stream.addTrack(audioTracks[0]);

    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp8,opus',
      // mimeType: 'video/webm;codecs=h264',
    });

    recorder.ondataavailable = (event) => {
      if (event.data?.size) {
        recordedChunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      clearInterval(timer);
      timer = undefined;

      if (!recordedChunks.length) {
        resolve(null);
        return;
      }

      const blob = new Blob(recordedChunks, { type: recordedChunks[0].type });
      resolve(blob);
    };

    recorder.start(ONE_SECONDS_IN_MS);

    let timeElapsed = 0;

    clearInterval(timer);
    timer = setInterval(() => {
      timeElapsed++;

      const progress = progressMin + (progressDiff * timeElapsed) / duration;
      if (progress < progressMax) {
        onProgress(progress);
        return;
      }

      recorder.stop();
      onProgress(progressMax);
    }, ONE_SECONDS_IN_MS);
  });
}
