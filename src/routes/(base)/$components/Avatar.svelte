<script lang="ts">
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';

  export let hasStories = false;
</script>

{#if hasStories}
  <a href="/stories" class="avatar" title="See my stories">
    <slot />
    <VisuallyHidden>See my stories</VisuallyHidden>
  </a>
{:else}
  <div class="avatar">
    <slot />
  </div>
{/if}

<style lang="scss">
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border-width: 2px;

    @include sm {
      width: 128px;
      height: 128px;
    }

    @include md {
      width: 176px;
      height: 176px;
    }

    :global(img),
    :global(svg) {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
      border: 1px solid var(--color-border);
    }
  }

  div.avatar {
    border-color: transparent;
  }

  a.avatar {
    border-style: solid;
    border-color: var(--color-primary);
  }
</style>
