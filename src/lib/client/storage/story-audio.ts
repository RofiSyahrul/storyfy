import { browser } from '$app/environment';

const KEY = '660eab72-1838-4aac-852b-e11643a31fb4';

export function isAudioMuted() {
  return browser ? localStorage.getItem(KEY) !== 'on' : true;
}

export function setAudio(value: 'on' | 'off') {
  if (!browser) return;
  localStorage.setItem(KEY, value);
}
