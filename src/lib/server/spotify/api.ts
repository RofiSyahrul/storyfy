import type { Cookies } from '@sveltejs/kit';

import { SPOTIFY_REQUEST_DEBUG } from '$env/static/private';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '$lib/constants/cookie-keys';
import type {
  SpotifyNowPlaingResponse,
  SpotifyNowPlayingData,
  SpotifyUserProfile,
  SpotifyUserProfileResponse,
} from '$lib/types/spotify';
import { spotifyAuth } from './auth';
import Fetcher from '../fetcher';

class SpotifyAPI extends Fetcher {
  private MAX_RETRY = 3;

  constructor() {
    super({
      baseURL: 'https://api.spotify.com',
      debug: SPOTIFY_REQUEST_DEBUG === 'true',
      getDefaultHeaders(cookies) {
        return { Authorization: `Bearer ${cookies.get(SPOTIFY_ACCESS_TOKEN)}` };
      },
    });
  }

  private hasAccessToken(cookies: Cookies) {
    return !!cookies.get(SPOTIFY_ACCESS_TOKEN);
  }

  private async handleError(error: Error, cookies: Cookies, retryCount: number) {
    const { status } = this.parseError(error);
    if (retryCount < this.MAX_RETRY && status === 401 && cookies.get(SPOTIFY_REFRESH_TOKEN)) {
      await spotifyAuth.fetchAndSaveCredentials(cookies);
      return;
    }

    throw error;
  }

  private async _fetchCurrentUserProfile(
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
      await this.handleError(error, cookies, retryCount);
      return this._fetchCurrentUserProfile(cookies, retryCount + 1);
    }
  }

  public async fetchCurrentUserProfile(cookies: Cookies) {
    return this._fetchCurrentUserProfile(cookies);
  }

  private async _fetchNowPlaying(
    cookies: Cookies,
    retryCount = 0,
  ): Promise<SpotifyNowPlayingData | null> {
    if (!this.hasAccessToken(cookies)) return null;
    try {
      const res = await this.fetcher<SpotifyNowPlaingResponse>({
        cookies,
        path: `/v1/me/player/currently-playing`,
      });
      if (!res.is_playing) return null;
      return {
        albumName: res.item.album.name,
        artists: res.item.artists.map((artist) => artist.name),
        image: res.item.album.images[0] ?? null,
        previewURL: res.item.preview_url,
        title: res.item.name,
        trackID: res.item.id,
        trackURL: res.item.external_urls.spotify,
      };
    } catch (error) {
      await this.handleError(error, cookies, retryCount);
      return this._fetchNowPlaying(cookies, retryCount + 1);
    }
  }

  public async fetchNowPlaying(cookies: Cookies) {
    try {
      return this._fetchNowPlaying(cookies);
    } catch (error) {
      this.log(`Failed to fetch Spotify now playing data. Error: `, error?.message);
      return null;
    }
  }
}

export const spotifyAPI = new SpotifyAPI();
