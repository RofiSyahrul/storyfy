import { redirect } from '@sveltejs/kit';

import { LOGIN_REDIRECT_URL, SPOTIFY_FORBIDDEN } from '$lib/server/cookie-keys';
import { spotifyAuth } from '$lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
  const code = url.searchParams.get('code') ?? '';
  const state = url.searchParams.get('state') ?? '';

  try {
    await spotifyAuth.fetchAndSaveCredentials(cookies, { code, state });
  } catch (error) {
    const { status, message } = spotifyAuth.parseError(error);
    if (status === 403) {
      cookies.set(SPOTIFY_FORBIDDEN, 'true');
    }
    throw redirect(302, `/?error=${message}`);
  }

  let loginRedirectURL = cookies.get(LOGIN_REDIRECT_URL);
  if (!loginRedirectURL || !loginRedirectURL.startsWith('/')) {
    loginRedirectURL = '/';
  } else if (loginRedirectURL) {
    cookies.delete(LOGIN_REDIRECT_URL);
  }

  throw redirect(302, loginRedirectURL);
};
