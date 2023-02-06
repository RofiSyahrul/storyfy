import { redirect, type ServerLoadEvent } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { ONE_YEAR_IN_SECONDS } from '$lib/constants/times';
import { LOGIN_REDIRECT_URL } from '../cookie-keys';

export function checkAuth({
  cookies,
  locals,
  url,
}: Pick<ServerLoadEvent, 'cookies' | 'locals' | 'url'>) {
  if (locals.userProfile) return;

  const loginRedirectURL = `${url.pathname}${url.search}`;
  cookies.set(LOGIN_REDIRECT_URL, loginRedirectURL, {
    path: '/',
    maxAge: ONE_YEAR_IN_SECONDS,
    secure: !dev,
  });

  throw redirect(307, '/');
}
