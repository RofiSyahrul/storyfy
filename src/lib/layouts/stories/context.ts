import { getContext, setContext } from 'svelte';

import type { HighlightName } from '$lib/types/highlights';

export interface StoriesContext {
  name: 'stories' | HighlightName;
}

const CONTEXT_KEY = Symbol('STORIES');

export function setStoriesContext(context: StoriesContext) {
  setContext(CONTEXT_KEY, context);
}

export function getStoriesContext() {
  return getContext<StoriesContext>(CONTEXT_KEY);
}
