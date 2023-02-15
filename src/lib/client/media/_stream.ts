export function getAudioStream(mediaElement: HTMLMediaElement): MediaStream {
  const clonedElement = mediaElement.cloneNode(true) as HTMLMediaElement;

  const audioCtx = new AudioContext();
  const streamDest = audioCtx.createMediaStreamDestination();
  const sourceNode = audioCtx.createMediaElementSource(clonedElement);

  sourceNode.connect(streamDest);
  clonedElement.play();

  return streamDest.stream;
}
