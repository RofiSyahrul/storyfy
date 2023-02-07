import type { Cookies } from '@sveltejs/kit';
import dayjs from 'dayjs';

import { SPOTIFY_REQUEST_DEBUG } from '$env/static/private';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '$lib/server/cookie-keys';
import type {
  SpotifyNowPlaingResponse,
  SpotifyNowPlayingData,
  SpotifyRecentlyPlayedItem,
  SpotifyRecentlyPlayedResponse,
  SpotifyRecentlyPlayedTrack,
  SpotifyTopTrackItem,
  SpotifyTopTracksResponse,
  SpotifyTrack,
  SpotifyUserProfile,
  SpotifyUserProfileResponse,
} from '$lib/types/spotify';
import { spotifyAuth } from './auth';
import Fetcher from '../fetcher';

function isTrackHasPreview(track: SpotifyTrack): track is SpotifyTrack<string> {
  return !!track.preview_url;
}

function isItemHasPreview(
  item: SpotifyRecentlyPlayedItem,
): item is SpotifyRecentlyPlayedItem<string> {
  return isTrackHasPreview(item.track);
}

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
    if (status === 401) {
      if (!cookies.get(SPOTIFY_REFRESH_TOKEN)) {
        cookies.delete(SPOTIFY_ACCESS_TOKEN);
        throw error;
      }

      if (retryCount >= this.MAX_RETRY) {
        cookies.delete(SPOTIFY_ACCESS_TOKEN);
        cookies.delete(SPOTIFY_REFRESH_TOKEN);
        throw error;
      }

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
        displayName: response.display_name || response.id,
        id: response.id,
        image: response.images[0] ?? null,
      };
    } catch (error) {
      await this.handleError(error, cookies, retryCount);
      return this._fetchCurrentUserProfile(cookies, retryCount + 1);
    }
  }

  public async fetchCurrentUserProfile(cookies: Cookies) {
    return await this._fetchCurrentUserProfile(cookies);
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
      return await this._fetchNowPlaying(cookies);
    } catch (error) {
      this.log(`Failed to fetch Spotify now playing data. Error: `, error?.message);
      return null;
    }
  }

  private async _fetchRecentlyPlayedRawData(
    cookies: Cookies,
    retryCount = 0,
  ): Promise<SpotifyRecentlyPlayedItem<string>[]> {
    if (!this.hasAccessToken(cookies)) return [];
    try {
      const res = await this.fetcher<
        SpotifyRecentlyPlayedResponse,
        { after: number; limit: number }
      >({
        cookies,
        path: `/v1/me/player/recently-played`,
        query: {
          after: dayjs().subtract(24, 'hours').unix(),
          limit: 50,
        },
      });

      const items: SpotifyRecentlyPlayedItem<string>[] = [];
      const trackIds: string[] = [];
      const maxItems = 5;

      for (const item of res.items) {
        if (items.length >= maxItems) break;
        if (isItemHasPreview(item) && !trackIds.includes(item.track.id)) {
          items.push(item);
          trackIds.push(item.track.id);
        }
      }

      return items;
    } catch (error) {
      await this.handleError(error, cookies, retryCount);
      return this._fetchRecentlyPlayedRawData(cookies, retryCount + 1);
    }
  }

  private async fetchRecentlyPlayedRawData(cookies: Cookies) {
    try {
      return await this._fetchRecentlyPlayedRawData(cookies);
    } catch (error) {
      this.log(`Failed to fetch Spotify recently played data. Error: `, error?.message);
      return [];
    }
  }

  public async hasRecentlyPlayedTracks(cookies: Cookies) {
    const items = await this.fetchRecentlyPlayedRawData(cookies);
    return items.length > 0;
  }

  public async fetchRecentlyPlayedTracks(cookies: Cookies) {
    const items = await this.fetchRecentlyPlayedRawData(cookies);
    return items.reverse().map<SpotifyRecentlyPlayedTrack>((item) => ({
      albumName: item.track.album.name,
      artists: item.track.artists.map((artist) => artist.name),
      id: item.track.id,
      image: item.track.album.images[0] ?? null,
      playedAt: item.played_at,
      previewURL: item.track.preview_url,
      title: item.track.name,
      trackURL: item.track.external_urls.spotify,
    }));
  }

  private async _fetchTopTracksRawData(
    cookies: Cookies,
    retryCount: number,
  ): Promise<SpotifyTrack<string>[]> {
    if (!this.hasAccessToken(cookies)) return [];
    try {
      const res = await this.fetcher<SpotifyTopTracksResponse>({
        cookies,
        path: `/v1/me/top/tracks`,
        query: {
          limit: 50,
          time_range: 'short_term',
        },
      });

      const topTracks: SpotifyTrack<string>[] = [];
      const maxTracks = 10;

      for (const track of res.items) {
        if (topTracks.length >= maxTracks) break;
        if (isTrackHasPreview(track)) {
          topTracks.push(track);
        }
      }

      return topTracks;
    } catch (error) {
      await this.handleError(error, cookies, retryCount);
      return this._fetchTopTracksRawData(cookies, retryCount + 1);
    }
  }

  private async fetchTopTracksRawData(cookies: Cookies) {
    try {
      return await this._fetchTopTracksRawData(cookies, 0);
    } catch (error) {
      this.log(`Failed to get Spotify top tracks. ${error?.message}`);
      return [];
    }
  }

  public async hasTopTracks(cookies: Cookies) {
    const topTracks = await this.fetchTopTracksRawData(cookies);
    return topTracks.length > 0;
  }

  public async fetchTopTracks(cookies: Cookies) {
    const rawTopTracks = await this.fetchTopTracksRawData(cookies);
    return rawTopTracks.map<SpotifyTopTrackItem>((track, index) => ({
      albumName: track.album.name,
      artists: track.artists.map((artist) => artist.name),
      id: track.id,
      image: track.album.images[0] ?? null,
      previewURL: track.preview_url,
      rank: index + 1,
      title: track.name,
      trackURL: track.external_urls.spotify,
    }));
  }
}

export const spotifyAPI = new SpotifyAPI();
