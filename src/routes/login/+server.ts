import { redirect } from '@sveltejs/kit';

import { spotifyAuth } from '$lib/server/spotify';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  const authURL = spotifyAuth.getAuthURL(cookies);
  throw redirect(302, authURL);
};
