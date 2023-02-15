<script lang="ts">
  import { goBack } from '$lib/client/go-back';
  import Audio from '$lib/components/Audio.svelte';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import {
    activeStoryMediaElement,
    getActiveStoryStore,
    goToNextStory,
    handleStoryTimeUpdate,
    isStoryMuted,
  } from '$lib/store/stories';
  import type { TopTrackStoryItem } from '$lib/types/stories';

  const MAX_IMAGE_SIZE = 250;
  const IMAGE_SIZE_RATIO = 15;
  const activeStoryStore = getActiveStoryStore<TopTrackStoryItem>();

  let audio: Audio;

  $: ({ activeStory, canNext } = $activeStoryStore);
  $: ({ artists, image, previewURL, rank, title, trackURL } = activeStory.detail);
  $: if (audio) {
    activeStoryMediaElement.set(audio.getAudioElement());
  }
</script>

<div class="rank">
  <h3>My top track in last 4 weeks</h3>
  <strong>#{rank}</strong>
</div>

{#if image?.url}
  {@const size = `${MAX_IMAGE_SIZE - (rank - 1) * IMAGE_SIZE_RATIO}px`}
  <img alt={title} src={image.url} width={size} height={size} crossorigin="anonymous" />
{/if}

<a href={trackURL} target="_blank" rel="noopener noreferrer" title="Open in Spotify">
  {title}
</a>

{#if artists.length}
  <p>{artists.join(', ')}</p>
{/if}

<Audio
  bind:this={audio}
  isMuted={$isStoryMuted}
  src={previewURL}
  on:ended={canNext ? goToNextStory : goBack}
  on:timeupdate={handleStoryTimeUpdate}
/>

<button on:click={() => audio.toggleAudioPlaying()} title="Play/Pause" class="hidden center">
  <VisuallyHidden>Play/Pause</VisuallyHidden>
</button>

<style lang="scss">
  .rank {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: nowrap;
    margin-bottom: 8px;

    @include sm {
      margin-bottom: 16px;
    }

    h3 {
      flex: 1;
      font-size: 14px;
      line-height: 16px;

      @include sm {
        font-size: 20px;
        line-height: 28px;
      }
    }

    strong {
      font-size: 24px;
      line-height: 32px;
      color: var(--color-text-primary);

      @include sm {
        font-size: 48px;
        line-height: 1;
      }
    }
  }

  img {
    object-fit: contain;
    border-radius: 8px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }

  a {
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    z-index: 10;

    @include sm {
      font-size: 36px;
      line-height: 40px;
    }
  }

  p {
    margin: 0;
    font-size: 18px;
    line-height: 28px;
    text-align: center;
  }
</style>
