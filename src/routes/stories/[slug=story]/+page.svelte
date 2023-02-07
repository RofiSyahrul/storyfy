<script lang="ts">
  import { goBack } from '$lib/client/go-back';
  import Audio from '$lib/components/Audio.svelte';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import {
    getActiveStoryStore,
    goToNextStory,
    handleStoryTimeUpdate,
    isStoryMuted,
  } from '$lib/store/stories';
  import type { NowPlayingStoryItem, RecentPlayedStoryItem } from '$lib/types/stories';

  const activeStoryStore = getActiveStoryStore<NowPlayingStoryItem | RecentPlayedStoryItem>();

  let audio: Audio;

  $: ({ activeStory, canNext } = $activeStoryStore);
</script>

{#if activeStory.detail.image?.url}
  <img
    alt={activeStory.detail.title}
    src={activeStory.detail.image.url}
    height="250px"
    width="250px"
  />
{/if}

<a
  href={activeStory.detail.trackURL}
  target="_blank"
  rel="noopener noreferrer"
  title="Open in Spotify"
>
  {activeStory.detail.title}
</a>

{#if activeStory.detail.artists.length}
  <p>{activeStory.detail.artists.join(', ')}</p>
{/if}

<Audio
  bind:this={audio}
  isMuted={$isStoryMuted}
  src={activeStory.detail.previewURL}
  on:ended={canNext ? goToNextStory : goBack}
  on:timeupdate={handleStoryTimeUpdate}
/>

<button on:click={() => audio.toggleAudioPlaying()} title="Play/Pause" class="hidden center">
  <VisuallyHidden>Play/Pause</VisuallyHidden>
</button>

<style lang="scss">
  img {
    object-fit: contain;
    border-radius: 4px;
  }

  a {
    font-weight: 700;
    font-size: 36px;
    line-height: 40px;
    text-align: center;
    z-index: 10;
  }

  p {
    margin: 0;
    font-size: 18px;
    line-height: 28px;
    text-align: center;
  }
</style>
