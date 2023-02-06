<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import RefreshIcon from '$lib/icons/refresh.svg?component';
  import SpotifyIcon from '$lib/icons/spotify.svg?component';
  import type { SpotifyNowPlayingData } from '$lib/types/spotify';

  export let data: SpotifyNowPlayingData | null;
  export let component: 'div' | 'section' = 'div';
</script>

<svelte:element this={component} class="now-playing">
  <div class="title">
    <SpotifyIcon height="24" width="24" />
    <h3>Now Playing</h3>
    <button on:click|stopPropagation={invalidateAll} title="Refresh">
      <RefreshIcon />
      <VisuallyHidden>Refresh</VisuallyHidden>
    </button>
  </div>

  {#if !data}
    <em>No Activity</em>
  {:else}
    <div class="detail">
      {#if data.image?.url}
        <img alt={data.title} src={data.image.url} height="80" width="80" />
      {/if}
      <div class="track-info">
        <a href={data.trackURL} target="_blank" rel="noopener noreferrer" title="Open in Spotify">
          {data.title}
        </a>
        <strong>{data.artists.join(', ')}</strong>
      </div>
    </div>
  {/if}
</svelte:element>

<style lang="scss">
  .now-playing {
    display: var(--now-playing-display);
    flex-direction: column;
    gap: 8px;
    border-radius: 8px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    padding: 8px;

    @media (min-width: 1024px) {
      padding: 12px;
    }

    .title {
      display: flex;
      gap: 4px;
      align-items: center;

      h3 {
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
        margin: 0;
        flex: 1;
      }
    }

    button {
      min-height: 32px;
      padding: 4px;
      z-index: 1;
    }

    .detail {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 16px;
      line-height: 24px;

      @media (min-width: 1024px) {
        gap: 12px;
      }

      img {
        object-fit: contain;
        border-radius: 4px;
      }
    }

    .track-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      a {
        font-weight: 600;
        font-size: 18px;
        line-height: 28px;
      }
    }
  }
</style>
