import { redirect } from '@sveltejs/kit';

import { spotifyAuth } from '$lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url }) => {
  const code = url.searchParams.get('code') ?? '';
  const state = url.searchParams.get('state') ?? '';

  try {
    await spotifyAuth.fetchAndSaveCredentials(cookies, { code, state });
  } catch (error) {
    const { message } = spotifyAuth.parseError(error);
    throw redirect(302, `/?error=${message}`);
  }

  throw redirect(302, '/');
};
