import type { Cookies } from '@sveltejs/kit';

import { dev } from '$app/environment';
import {
  SPOTIFY_AUTH_SCOPE,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_REQUEST_DEBUG,
} from '$env/static/private';
import { ONE_YEAR_IN_SECONDS } from '$lib/constants/times';
import {
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_AUTH_STATE,
  SPOTIFY_REFRESH_TOKEN,
} from '$lib/server/cookie-keys';
import Fetcher from '../fetcher';

class SpotifyAuth extends Fetcher {
  constructor() {
    super({
      baseURL: 'https://accounts.spotify.com',
      debug: SPOTIFY_REQUEST_DEBUG === 'true',
      getDefaultHeaders() {
        const authToken = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
          'base64',
        );
        return {
          Authorization: `Basic ${authToken}`,
        };
      },
    });
  }

  public getAuthURL(cookies: Cookies): string {
    const url = new URL('/authorize', this.baseURL);

    const state = crypto.randomUUID();
    cookies.set(SPOTIFY_AUTH_STATE, state, {});

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('client_id', SPOTIFY_CLIENT_ID);
    url.searchParams.set('scope', SPOTIFY_AUTH_SCOPE);
    url.searchParams.set('redirect_uri', SPOTIFY_REDIRECT_URI);

    return url.href;
  }

  public async fetchAndSaveCredentials(
    cookies: Cookies,
    options?: { code: string; state: string },
  ) {
    const { code, state } = options ?? {};
    const refreshToken = cookies.get(SPOTIFY_REFRESH_TOKEN);
    const body = new URLSearchParams();

    if (code) {
      const storedState = cookies.get(SPOTIFY_AUTH_STATE);
      if (!state || state !== storedState) {
        cookies.delete(SPOTIFY_ACCESS_TOKEN);
        cookies.delete(SPOTIFY_REFRESH_TOKEN);
        throw new Error(this.buildErrorMessage(400, 'state mismatch'));
      }
      body.set('code', code);
      body.set('redirect_uri', SPOTIFY_REDIRECT_URI);
      body.set('grant_type', 'authorization_code');
      cookies.delete(SPOTIFY_AUTH_STATE);
    } else if (refreshToken) {
      body.set('refresh_token', refreshToken);
      body.set('grant_type', 'refresh_token');
    } else {
      throw new Error(this.buildErrorMessage(400, 'code or refresh token is required'));
    }

    const response = await this.fetcher<{
      access_token: string;
      refresh_token?: string;
    }>({
      body,
      cookies,
      method: 'POST',
      path: '/api/token',
    });

    cookies.set(SPOTIFY_ACCESS_TOKEN, response.access_token, {
      maxAge: ONE_YEAR_IN_SECONDS,
      path: '/',
      secure: !dev,
    });

    if (response.refresh_token) {
      cookies.set(SPOTIFY_REFRESH_TOKEN, response.refresh_token, {
        maxAge: ONE_YEAR_IN_SECONDS,
        path: '/',
        secure: !dev,
      });
    }
  }
}

export const spotifyAuth = new SpotifyAuth();
