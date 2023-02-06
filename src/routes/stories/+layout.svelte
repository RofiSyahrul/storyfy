<script lang="ts">
  import StoriesLayout from '$lib/layouts/stories/StoriesLayout.svelte';
  import type { StoriesCloseHandlerParams } from '$lib/store/stories';
  import type { LayoutData } from './$types';
  import { buildStoryPathname } from './utils';

  export let data: LayoutData;

  function handleClose(event: CustomEvent<StoriesCloseHandlerParams>) {
    const { activeStory, canNext } = event.detail;
    const body = new FormData();
    body.set('lastOpenedStory', canNext ? activeStory.slug : '');
    fetch('/stories', {
      method: 'POST',
      body,
    });
  }
</script>

<StoriesLayout {...data} {buildStoryPathname} name="stories" on:close={handleClose}>
  <slot />
</StoriesLayout>
