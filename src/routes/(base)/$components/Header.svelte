<script lang="ts">
  import StoryfyIcon from '$lib/icons/storyfy.svg?component';

  export let isLoggedIn: boolean;
</script>

<header>
  <div class="fixed">
    <div class="inner">
      <StoryfyIcon width="56" height="56" />
      <h1>Storyfy</h1>
      {#if isLoggedIn}
        <form action="/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      {:else}
        <a href="/login" class="btn" data-sveltekit-preload-data="off">Login with Spotify</a>
      {/if}
    </div>
  </div>
</header>

<style lang="scss">
  header {
    position: relative;
    z-index: 10;
  }

  .fixed {
    position: fixed;
    top: 0;
    width: 100%;
    box-shadow: var(--shadow-md);
    padding: 0 8px;
    background-color: var(--color-bg-body);

    @include sm {
      padding: 0 12px;
    }
  }

  .inner {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;

    :global(svg) {
      width: auto;
      height: 80%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
    }
  }

  header,
  .inner {
    height: var(--header-height);
  }

  h1 {
    font-weight: bold;
    margin: 0;
    flex: 1;
    text-align: left;
  }

  form {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      min-height: 32px;
      padding: 4px;
    }
  }
</style>
