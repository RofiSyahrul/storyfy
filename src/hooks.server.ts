import type { Handle } from '@sveltejs/kit';

import { SPOTIFY_ACCESS_TOKEN } from '$lib/server/cookie-keys';
import { spotifyAPI } from '$lib/server/spotify';

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get(SPOTIFY_ACCESS_TOKEN);
  if (!accessToken) {
    event.locals.userProfile = null;
    return resolve(event);
  }

  try {
    const userProfile = await spotifyAPI.fetchCurrentUserProfile(event.cookies);
    event.locals.userProfile = userProfile;
  } catch {
    event.locals.userProfile = null;
    return resolve(event);
  }

  return resolve(event);
};
