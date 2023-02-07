import type { Cookies } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { ONE_DAY_IN_HOURS, ONE_HOUR_IN_MINUTES, ONE_MINUTE_IN_SECONDS } from '$lib/constants/times';
import type { HighlightName } from '$lib/types/highlights';
import { decode, encode } from '../codec';

type CookieValueParsed = Partial<Record<HighlightName, string>>;

const COOKIE_KEY = '__s_loh__';
const MAX_AGE_IN_DAYS = 14;

function stringifyCookieValue(parsed: CookieValueParsed): string {
  return encode(JSON.stringify(parsed));
}

function parseCookieValue(raw: string | undefined): CookieValueParsed {
  if (!raw) return {};
  try {
    const decoded = decode(raw);
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export function getHighlightsSession(cookies: Cookies) {
  const rawCookieValue = cookies.get(COOKIE_KEY);
  const parsed = parseCookieValue(rawCookieValue);

  function saveCookie() {
    cookies.set(COOKIE_KEY, stringifyCookieValue(parsed), {
      maxAge: MAX_AGE_IN_DAYS * ONE_DAY_IN_HOURS * ONE_HOUR_IN_MINUTES * ONE_MINUTE_IN_SECONDS,
      path: '/',
      secure: !dev,
    });
  }

  return {
    getLastOpened(name: HighlightName) {
      return parsed[name];
    },
    setLastOpened(name: HighlightName, slug: string) {
      parsed[name] = slug;
      saveCookie();
    },
    removeLastOpened(name: HighlightName) {
      parsed[name] = undefined;
      saveCookie();
    },
  };
}
