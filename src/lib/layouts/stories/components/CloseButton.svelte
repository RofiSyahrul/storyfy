<script lang="ts">
  import { goBack } from '$lib/client/go-back';
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import CloseIcon from '$lib/icons/close.svg?component';
</script>

<button title="Close" on:click={goBack}>
  <CloseIcon aria-label="Close" width="20" height="20" viewBox="0 0 16 16" />
  <VisuallyHidden>Close</VisuallyHidden>
</button>
