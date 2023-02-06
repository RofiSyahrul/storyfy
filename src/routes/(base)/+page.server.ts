import { spotifyAPI } from '$lib/server/spotify';
import type { PageServerLoadEvent } from './$types';

export async function load({ cookies }: PageServerLoadEvent) {
  const [nowPlaying, hasRecentlyPlayedTracks] = await Promise.all([
    spotifyAPI.fetchNowPlaying(cookies),
    spotifyAPI.hasRecentlyPlayedTracks(cookies),
  ]);

  return {
    hasRecentlyPlayedTracks,
    nowPlaying,
  };
}
