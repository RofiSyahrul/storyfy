<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Storyfy</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if data.userProfile}
  <pre>
    <code>
      {JSON.stringify(data.userProfile, null, 2)}
    </code>
  </pre>
  <form action="/logout" method="post">
    <button type="submit">Logout</button>
  </form>
{:else}
  <a href="/login">Login with Spotify</a>
{/if}
