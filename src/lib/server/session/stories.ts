import type { Cookies } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { ONE_DAY_IN_HOURS, ONE_HOUR_IN_MINUTES, ONE_MINUTE_IN_SECONDS } from '$lib/constants/times';

const COOKIE_KEY = '__s_los__';

export function getStoriesSession(cookies: Cookies) {
  return {
    getLastOpenedStory() {
      return cookies.get(COOKIE_KEY);
    },
    setLastOpenedStory(slug: string) {
      cookies.set(COOKIE_KEY, slug, {
        maxAge: ONE_DAY_IN_HOURS * ONE_HOUR_IN_MINUTES * ONE_MINUTE_IN_SECONDS,
        path: '/',
        secure: !dev,
      });
    },
    removeLastOpenedStory() {
      cookies.delete(COOKIE_KEY);
    },
  };
}
