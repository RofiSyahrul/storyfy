import { goto } from '$app/navigation';
import { isInternalRouting } from './storage/internal-routing';

export function goBack() {
  if (isInternalRouting()) {
    // history?.back();
    goto('/', { replaceState: true });
  } else {
    window.location.pathname = '/';
  }
}
