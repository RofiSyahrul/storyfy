import type { Handle } from '@sveltejs/kit';

import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_FORBIDDEN,
  SPOTIFY_REFRESH_TOKEN,
} from '$lib/server/cookie-keys';
import { spotifyAPI } from '$lib/server/spotify';

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get(SPOTIFY_ACCESS_TOKEN);
  if (!accessToken) {
    event.locals.userProfile = null;
    event.locals.isForbidden = event.cookies.get(SPOTIFY_FORBIDDEN) === 'true';
    return resolve(event);
  }

  try {
    const userProfile = await spotifyAPI.fetchCurrentUserProfile(event.cookies);
    event.locals.userProfile = userProfile;
    event.locals.isForbidden = false;
    event.cookies.delete(SPOTIFY_FORBIDDEN);
  } catch (error) {
    event.locals.userProfile = null;
    const { status } = spotifyAPI.parseError(error);
    if (status === 403) {
      event.cookies.delete(SPOTIFY_ACCESS_TOKEN);
      event.cookies.delete(SPOTIFY_REFRESH_TOKEN);
      event.cookies.set(SPOTIFY_FORBIDDEN, 'true');
      event.locals.isForbidden = true;
    }
  }

  return resolve(event);
};
