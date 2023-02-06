<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { noop } from 'svelte/internal';
  import { fly } from 'svelte/transition';

  import { goto } from '$app/navigation';
  import { goBack } from '$lib/client/go-back';
  import {
    initStoriesStore,
    updateStories,
    type StoriesCloseHandlerParams,
  } from '$lib/store/stories';
  import { getActiveStoryStore } from '$lib/store/stories';
  import type { GenericStoryItem } from '$lib/types/stories';
  import AudioToggleButton from './components/AudioToggleButton.svelte';
  import CloseButton from './components/CloseButton.svelte';
  import InvisibleNavButtons from './components/InvisibleNavButtons.svelte';
  import Progress from './components/Progress.svelte';
  import Title from './components/Title.svelte';
  import { setStoriesContext, type StoriesContext } from './context';

  type StoriesLayoutEventMap = {
    close: StoriesCloseHandlerParams;
  };

  export let buildStoryPathname: (slug: string) => string;
  export let initialActiveIndex: number;
  export let name: StoriesContext['name'];
  export let stories: GenericStoryItem[];

  const dispatch = createEventDispatcher<StoriesLayoutEventMap>();

  function handleNextAndPrev(story: GenericStoryItem) {
    const pathname = buildStoryPathname(story.slug);
    goto(pathname, { replaceState: true });
  }

  initStoriesStore({
    initialActiveIndex,
    onClose(params) {
      dispatch('close', params);
    },
    onNext: handleNextAndPrev,
    onPrev: handleNextAndPrev,
    stories,
  });

  setStoriesContext({ name });

  const activeStoryStore = getActiveStoryStore();

  $: updateStories(stories);
  $: ({ activeIndex, activeStory, prevActiveIndex } = $activeStoryStore);
  $: activeSlug = activeStory.slug;

  let flyOffsetX = 0;
  const FLY_OFFSET_X = 576;
  $: if (activeIndex > prevActiveIndex) {
    flyOffsetX = FLY_OFFSET_X;
  } else if (activeIndex < prevActiveIndex) {
    flyOffsetX = -1 * FLY_OFFSET_X;
  }
</script>

<div class="container">
  <div class="mask" on:click={goBack} on:keydown={noop} />

  <div class="inner-container">
    <header>
      <div class="progresses">
        {#each stories as story (story.slug)}
          <Progress slug={story.slug} />
        {/each}
      </div>

      <div class="title-and-actions">
        <Title />
        <div>
          <AudioToggleButton />
          <CloseButton />
        </div>
      </div>
    </header>

    {#key activeSlug}
      <main in:fly={{ x: flyOffsetX }}>
        <slot />
        <InvisibleNavButtons />
      </main>
    {/key}
  </div>
</div>

<style lang="scss">
  .container {
    position: relative;
    width: 100%;
    background-color: var(--color-bg-body);
  }

  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .inner-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 576px;
    height: 100vh;
    margin: 0 auto;
    background-color: var(--color-bg-body);
    box-shadow: var(--shadow-xl);
  }

  header {
    position: absolute;
    top: 8px;
    left: 0;
    width: 100%;
    z-index: 10;
  }

  .progresses {
    display: flex;
    gap: 2px;
    margin-bottom: 8px;
  }

  .title-and-actions {
    width: 100%;
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;

    > :global(div) {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    :global(button) {
      min-height: 24px;
      padding: 4px;
      background-color: transparent;
      color: var(--color-text-body);
    }
  }

  main {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 48px 16px;

    :global(button.hidden) {
      position: absolute;
      top: 0;
      padding: 0;
      background-color: transparent;
    }

    :global(button.hidden.center) {
      right: 0;
      bottom: 0;
      left: 0;
    }

    :global(button.hidden.left) {
      left: 0;
    }

    :global(button.hidden.right) {
      right: 0;
    }

    :global(button.hidden.left),
    :global(button.hidden.right) {
      width: 33%;
      height: 100%;
    }
  }
</style>
