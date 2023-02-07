import { TOP_TRACK_PREFIX_SLUG } from '$lib/types/stories';

const pattern = new RegExp(`^${TOP_TRACK_PREFIX_SLUG}-([1-9]|10)$`);

export function match(param: string): boolean {
  return pattern.test(param);
}
