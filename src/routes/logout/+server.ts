import { redirect } from '@sveltejs/kit';

import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '$lib/constants/cookie-keys';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete(SPOTIFY_ACCESS_TOKEN);
  cookies.delete(SPOTIFY_REFRESH_TOKEN);
  throw redirect(302, '/');
};
