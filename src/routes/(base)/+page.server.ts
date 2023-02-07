import { spotifyAPI } from '$lib/server/spotify';
import type { PageServerLoadEvent } from './$types';

export async function load({ cookies }: PageServerLoadEvent) {
  const [nowPlaying, hasRecentlyPlayedTracks, hasTopTracks] = await Promise.all([
    spotifyAPI.fetchNowPlaying(cookies),
    spotifyAPI.hasRecentlyPlayedTracks(cookies),
    spotifyAPI.hasTopTracks(cookies),
  ]);

  return {
    hasRecentlyPlayedTracks,
    hasTopTracks,
    nowPlaying,
  };
}
