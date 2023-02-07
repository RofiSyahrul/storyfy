import { redirect } from '@sveltejs/kit';

import { checkAuth } from '$lib/server/middlewares';
import { getHighlightsSession } from '$lib/server/session/highlights';
import { spotifyAPI } from '$lib/server/spotify';
import { HIGHLIGHT_TOP_TRACKS } from '$lib/types/highlights';
import { type TopTrackStoryItem, TOP_TRACK_PREFIX_SLUG } from '$lib/types/stories';
import type { LayoutServerLoad } from './$types';
import { buildTopTrackPathname } from './utils';

export const load: LayoutServerLoad = async ({ cookies, locals, url }) => {
  checkAuth({ cookies, locals, url });

  const topTracks = await spotifyAPI.fetchTopTracks(cookies);

  if (!topTracks.length) {
    throw redirect(307, '/');
  }

  const { pathname } = url;

  const topTrackStories: TopTrackStoryItem[] = topTracks.map((track) => ({
    slug: `${TOP_TRACK_PREFIX_SLUG}-${track.rank}`,
    title: `Top Track #${track.rank}`,
    detail: track,
  }));

  let initialActiveIndex = topTrackStories.findIndex((story) => {
    return buildTopTrackPathname(story.slug) === pathname;
  });

  if (initialActiveIndex >= 0) {
    return {
      initialActiveIndex,
      topTrackStories,
      seo: {
        title: topTrackStories[initialActiveIndex].title,
      },
    };
  }

  const session = getHighlightsSession(cookies);
  const initialActiveSlug = session.getLastOpened(HIGHLIGHT_TOP_TRACKS);

  if (initialActiveSlug) {
    initialActiveIndex = topTrackStories.findIndex((story) => story.slug === initialActiveSlug);
  }

  if (initialActiveIndex < 0) initialActiveIndex = 0;

  throw redirect(307, buildTopTrackPathname(topTrackStories[initialActiveIndex].slug));
};
