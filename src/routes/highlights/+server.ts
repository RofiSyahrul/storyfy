import { fail, json } from '@sveltejs/kit';

import { getHighlightsSession } from '$lib/server/session/highlights';
import type { RequestHandler } from './$types';
import type { SubmitHighlightPayload } from './types';

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const payload: SubmitHighlightPayload = (await request.json()) ?? {};
    const session = getHighlightsSession(cookies);
    if (payload.slug) {
      session.setLastOpened(payload.name, payload.slug);
    } else {
      session.removeLastOpened(payload.name);
    }
    return json({ success: true });
  } catch (error) {
    throw fail(500, { message: error?.message });
  }
};
