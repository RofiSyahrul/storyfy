<script lang="ts">
  import VisuallyHidden from '$lib/components/VisuallyHidden.svelte';
  import SoundOffIcon from '$lib/icons/sound-off.svg?component';
  import SoundOnIcon from '$lib/icons/sound-on.svg?component';
  import { isStoryMuted, toggleStoryAudio } from '$lib/store/stories';
</script>

<button title="Toggle audio" on:click={toggleStoryAudio}>
  {#if $isStoryMuted}
    <SoundOffIcon aria-label="Audio is muted" width="16" height="16" />
  {:else}
    <SoundOnIcon aria-label="Audio is playing" width="16" height="16" />
  {/if}
  <VisuallyHidden>Toggle audio</VisuallyHidden>
</button>
