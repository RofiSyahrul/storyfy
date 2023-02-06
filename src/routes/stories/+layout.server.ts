import { redirect } from '@sveltejs/kit';

import { getStoriesSession } from '$lib/server/session/stories';
import { spotifyAPI } from '$lib/server/spotify';
import {
  STORY_NOW_PLAYING_SLUG,
  STORY_RECENT_PLAYED_PREFIX_SLUG,
  type NowPlayingStoryItem,
  type RecentPlayedStoryItem,
} from '$lib/types/stories';
import type { LayoutServerLoadEvent } from './$types';
import { buildStoryPathname } from './utils';

export async function load({ cookies, url }: LayoutServerLoadEvent) {
  const [nowPlaying, recentlyPlayedTracks] = await Promise.all([
    spotifyAPI.fetchNowPlaying(cookies),
    spotifyAPI.fetchRecentlyPlayedTracks(cookies),
  ]);

  const stories: (NowPlayingStoryItem | RecentPlayedStoryItem)[] = [];

  if (recentlyPlayedTracks.length) {
    stories.push(
      ...recentlyPlayedTracks.map<RecentPlayedStoryItem>((track) => ({
        slug: `${STORY_RECENT_PLAYED_PREFIX_SLUG}-${track.id}` as const,
        title: `Recently Played`,
        timestamp: track.playedAt,
        detail: track,
      })),
    );
  }

  if (nowPlaying?.previewURL) {
    stories.push({
      slug: STORY_NOW_PLAYING_SLUG,
      title: 'Now Playing',
      detail: {
        ...nowPlaying,
        previewURL: nowPlaying.previewURL,
      },
    });
  }

  if (!stories.length) {
    throw redirect(307, '/');
  }

  const { pathname } = url;
  let initialActiveIndex = stories.findIndex(
    (story) => buildStoryPathname(story.slug) === pathname,
  );

  if (initialActiveIndex >= 0) {
    return { initialActiveIndex, stories };
  }

  const initialActiveSlug = getStoriesSession(cookies).getLastOpenedStory();
  if (initialActiveSlug) {
    initialActiveIndex = stories.findIndex((story) => story.slug === initialActiveSlug);
  }

  if (initialActiveIndex < 0) initialActiveIndex = 0;

  throw redirect(307, buildStoryPathname(stories[initialActiveIndex].slug));
}
