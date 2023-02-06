<script lang="ts">
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import { getActiveStoryStore, goToNextStory, goToPrevStory } from '$lib/store/stories';

  const activeStoryStore = getActiveStoryStore();

  $: ({ canNext, canPrev } = $activeStoryStore);
</script>

<button disabled={!canPrev} title="Previous" class="hidden left" on:click={goToPrevStory}>
  <VisuallyHidden>Previous</VisuallyHidden>
</button>

<button disabled={!canNext} title="Next" class="hidden right" on:click={goToNextStory}>
  <VisuallyHidden>Next</VisuallyHidden>
</button>
