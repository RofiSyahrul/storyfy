import { spotifyAPI } from '$lib/server/spotify';
import type { PageServerLoadEvent } from './$types';

export async function load({ cookies }: PageServerLoadEvent) {
  const nowPlaying = await spotifyAPI.fetchNowPlaying(cookies);
  return {
    nowPlaying,
  };
}
