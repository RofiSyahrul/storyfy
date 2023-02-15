<script lang="ts">
  import StorifyIcon from '$lib/icons/storyfy.svg?component';
  import { HIGHLIGHT_TOP_TRACKS, type HighlightName } from '$lib/types/highlights';
  import Avatar from './$components/Avatar.svelte';
  import Header from './$components/Header.svelte';
  import Highlights from './$components/Highlights.svelte';
  import NowPlaying from './$components/NowPlaying.svelte';
  import UserInfo from './$components/UserInfo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: hasStories = Boolean(data.nowPlaying?.previewURL || data.hasRecentlyPlayedTracks);

  let highlightNames: HighlightName[] = [];
  $: {
    if (data.hasTopTracks) {
      highlightNames = highlightNames.concat(HIGHLIGHT_TOP_TRACKS);
    }
  }
</script>

<Header isLoggedIn={!!data.userProfile} />

{#if data.userProfile}
  <main class="logged-in">
    <UserInfo imageSrc={data.userProfile.image?.url} name={data.userProfile.displayName}>
      <Avatar slot="avatar" let:alt let:src {hasStories}>
        {#if src}
          <img {alt} {src} width="176" height="176" />
        {:else}
          <StorifyIcon width="176" height="176" />
        {/if}
      </Avatar>
      <NowPlaying slot="now-playing" data={data.nowPlaying} />
    </UserInfo>
    <NowPlaying component="section" data={data.nowPlaying} />

    {#if highlightNames.length}
      <Highlights {highlightNames} />
    {/if}
  </main>
{:else}
  <main class="non-logged-in">
    {#if data.isForbidden}
      <h2>Storyfy doesn't have access to your Spotify account</h2>
    {:else}
      <h2>{data.seo.description}</h2>
      <a href="/login" class="btn umami--click--login-body" data-sveltekit-preload-data="off">
        Login with Spotify
      </a>
    {/if}
  </main>
{/if}

<style lang="scss">
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px;
  }

  main.logged-in {
    max-width: 1024px;
    margin: 0 auto;
    --now-playing-display: flex;

    @include sm {
      --now-playing-display: none;
    }
  }

  main.non-logged-in {
    height: calc(100vh - var(--header-height));
    align-items: center;
    justify-content: center;

    h2 {
      margin: 0;
      text-align: center;
    }

    .btn {
      min-height: 64px;
      padding: 16px;
    }
  }
</style>
