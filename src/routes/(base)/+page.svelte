<script lang="ts">
  import SpotifyIcon from '$lib/icons/spotify.svg?component';
  import Avatar from './$components/Avatar.svelte';
  import Header from './$components/Header.svelte';
  import Highlights from './$components/Highlights.svelte';
  import NowPlaying from './$components/NowPlaying.svelte';
  import UserInfo from './$components/UserInfo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: hasStories = Boolean(data.nowPlaying?.previewURL || data.hasRecentlyPlayedTracks);
</script>

<Header isLoggedIn={!!data.userProfile} />

{#if data.userProfile}
  <main class="logged-in">
    <UserInfo
      imageSrc={data.userProfile.image?.url}
      name={data.userProfile.displayName || data.userProfile.id}
    >
      <Avatar slot="avatar" let:alt let:src {hasStories}>
        {#if src}
          <img {alt} {src} width="176" height="176" />
        {:else}
          <SpotifyIcon width="176" height="176" />
        {/if}
      </Avatar>
      <NowPlaying slot="now-playing" data={data.nowPlaying} />
    </UserInfo>
    <NowPlaying component="section" data={data.nowPlaying} />
    <Highlights />
  </main>
{:else}
  <main class="non-logged-in">
    {#if data.isForbidden}
      <h2>Storyfy doesn't have access to your Spotify account</h2>
    {:else}
      <h2>{data.seo.description}</h2>
      <a href="/login" class="btn" data-sveltekit-preload-data="off"> Login with Spotify </a>
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

    @media (min-width: 640px) {
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
