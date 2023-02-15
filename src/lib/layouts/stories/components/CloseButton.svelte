<script lang="ts">
  import { goBack } from '$lib/client/go-back';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import CloseIcon from '$lib/icons/close.svg?component';
  import { getStoriesContext } from '../context';

  const { name } = getStoriesContext();
</script>

<button title="Close" on:click={goBack} class={`umami--click--${name}-close`}>
  <CloseIcon aria-label="Close" width="20" height="20" viewBox="0 0 16 16" />
  <VisuallyHidden>Close</VisuallyHidden>
</button>
