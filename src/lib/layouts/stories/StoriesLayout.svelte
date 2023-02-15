<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { noop, onMount } from 'svelte/internal';
  import { fly } from 'svelte/transition';

  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { goBack } from '$lib/client/go-back';
  import {
    canRecordMedia,
    convertWebmToMp4,
    createCanvas,
    createFile,
    downloadBlob,
    getAudioStream,
    hasFileReader,
    hasNativeShare,
    recordCanvasAndAudioStream,
  } from '$lib/client/media';
  import Popup from '$lib/components/Popup.svelte';
  import Progress from '$lib/components/Progress.svelte';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import DownloadIcon from '$lib/icons/download.svg?component';
  import ShareIcon from '$lib/icons/share.svg?component';
  import storyfyIconSrc from '$lib/icons/storyfy.svg?src';
  import {
    activeStoryMediaElement,
    initStoriesStore,
    updateStories,
    type StoriesCloseHandlerParams,
  } from '$lib/store/stories';
  import { getActiveStoryStore } from '$lib/store/stories';
  import type { GenericStoryItem } from '$lib/types/stories';
  import AudioToggleButton from './components/AudioToggleButton.svelte';
  import CloseButton from './components/CloseButton.svelte';
  import InvisibleNavButtons from './components/InvisibleNavButtons.svelte';
  import StoryProgress from './components/StoryProgress.svelte';
  import Title from './components/Title.svelte';
  import { setStoriesContext, type StoriesContext } from './context';

  type StoriesLayoutEventMap = {
    close: StoriesCloseHandlerParams;
  };

  interface ShareData {
    files?: File[];
    text?: string;
    title?: string;
    url?: string;
  }

  export let buildStoryPathname: (slug: string) => string;
  export let initialActiveIndex: number;
  export let isShareable = false;
  export let name: StoriesContext['name'];
  export let stories: GenericStoryItem[];

  let container: HTMLDivElement;
  let canDownload = false;
  let canShare = false;
  let creatingFileProgress: number | null = null;
  let creatingFileDesc = '';
  let isFilePopupOpened = false;
  let sharedData: ShareData | null = null;
  let sharedFile: File | null = null;

  const dispatch = createEventDispatcher<StoriesLayoutEventMap>();

  function handleNextAndPrev(story: GenericStoryItem) {
    sharedFile = null;
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

  onMount(() => {
    canDownload = canRecordMedia();
    canShare = canDownload && hasFileReader() && hasNativeShare();
  });

  $: updateStories(stories);
  $: ({ activeIndex, activeStory, prevActiveIndex } = $activeStoryStore);
  $: activeSlug = activeStory.slug;
  $: isCreatingStoryFile = typeof creatingFileProgress === 'number';

  let flyOffsetX = 0;
  const FLY_OFFSET_X = 576;
  $: if (activeIndex > prevActiveIndex) {
    flyOffsetX = FLY_OFFSET_X;
  } else if (activeIndex < prevActiveIndex) {
    flyOffsetX = -1 * FLY_OFFSET_X;
  }

  async function createStoryFile() {
    if (!$activeStoryMediaElement) {
      return;
    }

    $activeStoryMediaElement.currentTime = 0;
    $activeStoryMediaElement.pause();

    if (sharedFile) {
      isFilePopupOpened = true;
      return;
    }

    creatingFileProgress = 0;
    creatingFileDesc = `Capturing ${activeStory.title}`;
    const canvas = await createCanvas(container, {
      ignoredClassNames: ['progresses', 'actions'],
      ignoredTagNames: ['AUDIO', 'BUTTON', 'VIDEO'],
      onClone(doc, element) {
        const style = getComputedStyle(doc.body);
        const borderColor = style.getPropertyValue('--color-border');

        const wrapper = doc.createElement('div');
        wrapper.style.margin = 'auto';
        wrapper.style.transform = 'scale(0.8)';
        wrapper.style.border = `1px solid ${borderColor}`;
        wrapper.style.borderRadius = '4px';
        wrapper.className = element.className;

        element.childNodes.forEach((childNode) => {
          wrapper.appendChild(childNode);
        });

        element.appendChild(wrapper);

        const footer = element.getElementsByTagName('footer').item(0);
        if (footer) {
          footer.style.display = 'flex';
        }
      },
    });

    creatingFileProgress += 10;
    creatingFileDesc = `Recording ${activeStory.title}`;
    const audioStream = getAudioStream($activeStoryMediaElement);
    const blob = await recordCanvasAndAudioStream({
      audioStream,
      canvas,
      duration: $activeStoryMediaElement.duration,
      onProgress(progress) {
        creatingFileProgress = progress;
      },
      progressMax: 90,
      progressMin: creatingFileProgress,
    });

    if (!blob) {
      // TODO: handle empty blob
      return;
    }

    let mp4Blob: Blob | undefined;
    try {
      creatingFileDesc = `Converting ${activeStory.title} video to mp4`;
      mp4Blob = await convertWebmToMp4(blob, activeSlug);
      creatingFileProgress = 100;
    } catch (error) {
      // TODO: handle error
      if (dev) {
        // eslint-disable-next-line no-console
        console.log('ERROR on converting webm to mp4', error);
      }
    }

    creatingFileProgress = null;
    creatingFileDesc = '';
    sharedFile = createFile(mp4Blob ?? blob, activeSlug);
    sharedData = {
      files: [sharedFile],
      title: activeStory.title,
      text: activeStory.title,
      url: 'https://storyfy.rofi.link',
    };

    canShare = canShare && navigator?.canShare?.(sharedData);
    isFilePopupOpened = true;
  }

  function handleDownload() {
    if (sharedFile) {
      downloadBlob(sharedFile, sharedFile.name);
      isFilePopupOpened = false;
    }
  }

  async function handleShare() {
    if (!sharedFile || !sharedData) return;

    try {
      await navigator.share(sharedData);
      isFilePopupOpened = false;
      return;
    } catch (error) {
      // TODO: handle error
      if (dev) {
        // eslint-disable-next-line no-console
        console.log('navigator.share error', error);
      }
    }

    downloadBlob(sharedFile, sharedFile.name);
    isFilePopupOpened = false;
  }
</script>

<div class="container" class:is-creating-story-file={isCreatingStoryFile}>
  <div class="mask" on:click={goBack} on:keydown={noop} />

  <div class="inner-container" bind:this={container}>
    <header>
      <div class="progresses">
        {#each stories as story (story.slug)}
          <StoryProgress slug={story.slug} />
        {/each}
      </div>

      <div class="title-and-actions">
        <Title />
        <div class="actions">
          {#if isShareable && canDownload}
            <button
              on:click={createStoryFile}
              class={`umami--click--trigger-${canShare ? 'share' : 'download'}-${activeSlug}`}
            >
              {#if canShare}
                <ShareIcon aria-label="Share" width="20" height="20" viewBox="0 0 24 24" />
                <VisuallyHidden>Share</VisuallyHidden>
              {:else}
                <DownloadIcon aria-label="Download" width="20" height="20" viewBox="0 0 24 24" />
                <VisuallyHidden>Download</VisuallyHidden>
              {/if}
            </button>
          {/if}
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

    <footer>
      {@html `Made with ${storyfyIconSrc} Storyfy`}
    </footer>
  </div>
</div>

<Popup isOpen={isCreatingStoryFile}>
  {#if isCreatingStoryFile}
    <Progress label={`Creating file ${activeStory.title}`} value={creatingFileProgress ?? 0} />
    <p>{creatingFileDesc || 'Creating file'}...</p>
  {/if}
</Popup>

<Popup
  isOpen={isFilePopupOpened && !!sharedFile}
  on:close={() => {
    isFilePopupOpened = false;
  }}
>
  {#if sharedFile}
    <p>Your file is ready: <strong>{sharedFile.name}</strong></p>
    <div class="file-actions">
      {#if canShare}
        <button
          on:click={handleDownload}
          class={`outline umami--click--download-outline-${activeSlug}`}
        >
          <DownloadIcon aria-label="Download" viewBox="0 0 24 24" />
          Download
        </button>
        <button on:click={handleShare} class={`umami--click--share-${activeSlug}`}>
          <ShareIcon aria-label="Share" viewBox="0 0 24 24" />
          Share
        </button>
      {:else}
        <button on:click={handleDownload} class={`umami--click--download-${activeSlug}`}>
          <DownloadIcon aria-label="Download" viewBox="0 0 24 24" />
          Download
        </button>
      {/if}
    </div>
  {/if}
</Popup>

<style lang="scss">
  .container {
    position: relative;
    width: 100%;
    background-color: var(--color-bg-body);

    &.is-creating-story-file {
      pointer-events: none;
    }
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
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    padding-top: 8px;
    background-color: var(--color-bg-body);
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
    padding: 72px 16px 48px;
    overflow: hidden;

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

  footer {
    position: absolute;
    bottom: 12px;
    right: 12px;
    color: var(--color-text-subtle);
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    font-style: italic;
    text-align: right;
    display: none;
    align-items: center;
    gap: 4px;
  }

  .file-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
