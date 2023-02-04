<script lang="ts">
  import Avatar from './$components/Avatar.svelte';
  import Header from './$components/Header.svelte';
  import Highlights from './$components/Highlights.svelte';
  import UserInfo from './$components/UserInfo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Header isLoggedIn={!!data.userProfile} />

{#if data.userProfile}
  <main class="logged-in">
    <UserInfo
      imageSrc={data.userProfile.image?.url}
      name={data.userProfile.displayName || data.userProfile.id}
    >
      <Avatar slot="avatar" let:alt let:src>
        <img {alt} {src} width="176" height="176" />
      </Avatar>
    </UserInfo>
    <Highlights />
  </main>
{:else}
  <main class="non-logged-in">
    <h2>{data.seo.description}</h2>
    <a href="/login" class="btn" data-sveltekit-preload-data="off"> Login with Spotify </a>
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
