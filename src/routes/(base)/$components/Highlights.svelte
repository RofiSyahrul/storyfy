<script lang="ts">
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import SpotifyIcon from '$lib/icons/spotify.svg?component';
  import type { HighlightName } from '$lib/types/highlights';

  export let highlightNames: HighlightName[] = [];

  interface Highlight {
    label: string;
    pathname: string;
  }

  const highlights: Record<HighlightName, Highlight> = {
    'top-artists': {
      label: 'Top Artists',
      pathname: '/highlights/top-artists',
    },
    'top-tracks': {
      label: 'Top Tracks',
      pathname: '/highlights/top-tracks',
    },
  };
</script>

<ul data-sveltekit-reload data-sveltekit-preload-data="off">
  {#each highlightNames as name (name)}
    {@const { label, pathname } = highlights[name]}
    <li>
      <div>
        <a href={pathname} title={label}>
          <SpotifyIcon width="70%" height="70%" />
          <VisuallyHidden>{label}</VisuallyHidden>
        </a>
      </div>
      <small>{label}</small>
    </li>
  {/each}
</ul>

<style lang="scss">
  ul {
    width: 100%;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: nowrap;
    padding: 8px 0;
    overflow-x: auto;
    list-style: none;

    @include sm {
      padding: 0;
    }
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;

    div {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      padding: 2px;
      border: 2px solid var(--color-primary);
    }

    a {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-secondary);
      &:hover {
        filter: brightness(80%);
      }
    }

    small {
      font-weight: 600;
      color: var(--color-text-primary);
    }
  }
</style>
