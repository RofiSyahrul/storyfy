/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { onMount } from 'svelte';
import { noop } from 'svelte/internal';
import { get, writable, type Readable, type Subscriber, type Writable } from 'svelte/store';

import { isAudioMuted, setAudio } from '$lib/client/storage/story-audio';
import type { GenericStoryItem } from '$lib/types/stories';

interface ActiveStoryStore<TSlug extends string = string, TDetail = unknown> {
  activeIndex: number;
  activeStory: GenericStoryItem<TSlug, TDetail>;
  canNext: boolean;
  canPrev: boolean;
  prevActiveIndex: number;
}

export interface StoriesCloseHandlerParams {
  activeStory: GenericStoryItem;
  canNext: boolean;
}

type StoriesCloseHandler = (params: StoriesCloseHandlerParams) => void;

interface InitStoriesStoreParams {
  initialActiveIndex: number;
  onClose: StoriesCloseHandler;
  onNext?: (story: GenericStoryItem) => void;
  onPrev?: (story: GenericStoryItem) => void;
  stories: GenericStoryItem[];
}

let activeStoryStore: Writable<ActiveStoryStore> | undefined;
let storiesStore: Writable<GenericStoryItem[]> | undefined;
let storyProgressStore: Writable<Record<string, number>> | undefined;
const storyIsMutedStore = writable(isAudioMuted());

function throwError(): never {
  throw new Error('stories store has not been initialized');
}

export let goToNextStory: () => void = throwError;
export let goToPrevStory: () => void = throwError;
export let updateStories: (stories: GenericStoryItem[]) => void = throwError;

let setActiveStoryProgress: (value: number) => void = throwError;

export function handleStoryTimeUpdate(event: Event) {
  const { currentTime, duration } = event.currentTarget as HTMLAudioElement | HTMLVideoElement;
  setActiveStoryProgress((currentTime * 100) / duration);
}

export function toggleStoryAudio() {
  const isMuted = !get(storyIsMutedStore);
  storyIsMutedStore.set(isMuted);
  const sound = isMuted ? 'off' : 'on';
  setAudio(sound);
  return sound;
}

export function initStoriesStore({
  initialActiveIndex,
  onClose,
  onNext,
  onPrev,
  stories: initialStories,
}: InitStoriesStoreParams) {
  storiesStore = writable(initialStories);
  const stories = get(storiesStore);

  const initialProgress = stories.reduce<Record<string, number>>((progressObj, story, index) => {
    progressObj[story.slug] = index < initialActiveIndex ? 100 : 0;
    return progressObj;
  }, {});

  const totalStories = stories.length;

  function isNextAvailable(activeIndex: number) {
    return activeIndex < totalStories - 1;
  }

  function isPrevAvailable(activeIndex: number) {
    return activeIndex > 0;
  }

  function getActiveStory(prevIndex: number, index: number): ActiveStoryStore {
    const currentStories = get(storiesStore!);
    return {
      activeIndex: index,
      activeStory: { ...currentStories[index] },
      canNext: isNextAvailable(index),
      canPrev: isPrevAvailable(index),
      prevActiveIndex: prevIndex,
    };
  }

  activeStoryStore = writable(getActiveStory(initialActiveIndex, initialActiveIndex));
  storyProgressStore = writable({ ...initialProgress });

  goToNextStory = () => {
    const { activeIndex, activeStory } = get(activeStoryStore!);
    const newIndex = activeIndex + 1;
    if (newIndex >= totalStories) return;

    const prevSlug = activeStory.slug;
    const newActiveStory = getActiveStory(activeIndex, newIndex);
    const newSlug = newActiveStory.activeStory.slug;

    activeStoryStore!.set(newActiveStory);
    storyProgressStore!.update((prevProgress) => ({
      ...prevProgress,
      [prevSlug]: 100,
      [newSlug]: 0,
    }));

    onNext?.(newActiveStory.activeStory);
  };

  goToPrevStory = () => {
    const { activeIndex, activeStory } = get(activeStoryStore!);
    const newIndex = activeIndex - 1;
    if (newIndex < 0) return;

    const prevSlug = activeStory.slug;
    const newActiveStory = getActiveStory(activeIndex, newIndex);
    const newSlug = newActiveStory.activeStory.slug;

    activeStoryStore!.set(newActiveStory);
    storyProgressStore!.update((prevProgress) => ({
      ...prevProgress,
      [prevSlug]: 0,
      [newSlug]: 0,
    }));

    onPrev?.(newActiveStory.activeStory);
  };

  setActiveStoryProgress = (value: number) => {
    const {
      activeStory: { slug },
    } = get(activeStoryStore!);
    storyProgressStore!.update((old) => {
      return { ...old, [slug]: value };
    });
  };

  updateStories = (updatedStories) => {
    storiesStore!.set(updatedStories);
  };

  onMount(() => {
    function handleCloseOrPopState() {
      if (!activeStoryStore) return;

      const { activeStory, canNext } = get(activeStoryStore);
      onClose({ activeStory, canNext });
    }

    window.addEventListener('beforeunload', handleCloseOrPopState);
    window.addEventListener('popstate', handleCloseOrPopState);

    return () => {
      handleCloseOrPopState();
      window.removeEventListener('beforeunload', handleCloseOrPopState);
      window.removeEventListener('popstate', handleCloseOrPopState);
    };
  });
}

export const getActiveStoryStore = <T extends GenericStoryItem = GenericStoryItem>(): Readable<
  ActiveStoryStore<T['slug'], T['detail']>
> => ({
  subscribe(run, invalidate) {
    if (!activeStoryStore) return noop;
    return activeStoryStore.subscribe(
      run as Subscriber<ActiveStoryStore>,
      invalidate as (value?: ActiveStoryStore) => void,
    );
  },
});

export const storyProgress: Readable<Record<string, number>> = {
  subscribe(run, invalidate) {
    if (!storyProgressStore) return noop;
    return storyProgressStore.subscribe(run, invalidate);
  },
};

export const isStoryMuted: Readable<boolean> = {
  subscribe: storyIsMutedStore.subscribe,
};
