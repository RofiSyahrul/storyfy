const STORAGE_KEY = 'aXNJbnRlcm5hbFJvdXRpbmc=';

export function isInternalRouting() {
  return sessionStorage.getItem(STORAGE_KEY) === 'true';
}

export function setIsInternalRouting(value: boolean) {
  if (value) {
    sessionStorage.setItem(STORAGE_KEY, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
