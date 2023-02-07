import type {
  SpotifyNowPlayingData,
  SpotifyRecentlyPlayedTrack,
  SpotifyTopTrackItem,
} from './spotify';

export interface GenericStoryItem<TSlug extends string = string, TDetail = unknown> {
  slug: TSlug;
  title: string;
  timestamp?: string;
  detail: TDetail;
}

interface SpotifyNowPlayingDataWithPreviewURL extends Omit<SpotifyNowPlayingData, 'previewURL'> {
  previewURL: string;
}

export const STORY_NOW_PLAYING_SLUG = 'now-playing' as const;
export const STORY_RECENT_PLAYED_PREFIX_SLUG = 'recent' as const;

export const TOP_TRACK_PREFIX_SLUG = 'top-track' as const;

export type NowPlayingStoryItem = GenericStoryItem<
  typeof STORY_NOW_PLAYING_SLUG,
  SpotifyNowPlayingDataWithPreviewURL
>;

export type RecentPlayedStoryItem = GenericStoryItem<
  `${typeof STORY_RECENT_PLAYED_PREFIX_SLUG}-${string}`,
  SpotifyRecentlyPlayedTrack
>;

export type TopTrackStoryItem = GenericStoryItem<
  `${typeof TOP_TRACK_PREFIX_SLUG}-${number}`,
  SpotifyTopTrackItem
>;
