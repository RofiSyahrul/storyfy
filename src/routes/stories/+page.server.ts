import { getStoriesSession } from '$lib/server/session/stories';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    const form = await request.formData();
    const lastOpenedStory = form.get('lastOpenedStory');
    const session = getStoriesSession(cookies);
    if (lastOpenedStory && typeof lastOpenedStory === 'string') {
      session.setLastOpenedStory(lastOpenedStory);
    } else {
      session.removeLastOpenedStory();
    }
    return { success: true };
  },
};
