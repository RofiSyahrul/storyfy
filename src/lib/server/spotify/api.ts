import type { Cookies } from '@sveltejs/kit';

import { SPOTIFY_REQUEST_DEBUG } from '$env/static/private';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '$lib/constants/cookie-keys';
import type { SpotifyUserProfile, SpotifyUserProfileResponse } from '$lib/types/spotify';
import { spotifyAuth } from './auth';
import Fetcher from '../fetcher';

class SpotifyAPI extends Fetcher {
  constructor() {
    super({
      baseURL: 'https://api.spotify.com',
      debug: SPOTIFY_REQUEST_DEBUG === 'true',
      getDefaultHeaders(cookies) {
        return { Authorization: `Bearer ${cookies.get(SPOTIFY_ACCESS_TOKEN)}` };
      },
    });
  }

  public async fetchCurrentUserProfile(
    cookies: Cookies,
    retryCount = 0,
  ): Promise<SpotifyUserProfile> {
    try {
      const response = await this.fetcher<SpotifyUserProfileResponse>({
        cookies,
        path: `/v1/me`,
      });

      return {
        displayName: response.display_name,
        id: response.id,
        image: response.images[0] ?? null,
      };
    } catch (error) {
      const maxRetry = 3;
      if (retryCount >= maxRetry || !cookies.get(SPOTIFY_REFRESH_TOKEN)) throw error;

      await spotifyAuth.fetchAndSaveCredentials(cookies);
      return this.fetchCurrentUserProfile(cookies, retryCount + 1);
    }
  }
}

export const spotifyAPI = new SpotifyAPI();
