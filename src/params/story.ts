import { STORY_NOW_PLAYING_SLUG, STORY_RECENT_PLAYED_PREFIX_SLUG } from '$lib/types/stories';

export function match(param: string): boolean {
  return param === STORY_NOW_PLAYING_SLUG || param.startsWith(STORY_RECENT_PLAYED_PREFIX_SLUG);
}
