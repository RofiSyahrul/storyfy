export function canRecordMedia() {
  return (
    typeof MediaStream !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    typeof AudioContext !== 'undefined'
  );
}

export function hasFileReader() {
  return typeof FileReader !== 'undefined';
}

export function hasNativeShare() {
  return !!navigator.canShare;
}
