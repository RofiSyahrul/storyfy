export function createFile(blob: Blob, fileName: string) {
  if (blob.type.includes('mp4')) {
    fileName += `.mp4`;
  } else if (blob.type.includes('webm')) {
    fileName += `.webm`;
  }

  return new File([blob], fileName, { type: blob.type });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1);
}
