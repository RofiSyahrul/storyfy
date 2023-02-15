<script lang="ts">
  import StoriesLayout from '$lib/layouts/stories/StoriesLayout.svelte';
  import type { StoriesCloseHandlerParams } from '$lib/store/stories';
  import { HIGHLIGHT_TOP_TRACKS } from '$lib/types/highlights';
  import type { LayoutServerData } from './$types';
  import { buildTopTrackPathname } from './utils';
  import type { SubmitHighlightPayload } from '../types';

  export let data: LayoutServerData;

  function handleClose(event: CustomEvent<StoriesCloseHandlerParams>) {
    const { activeStory, canNext } = event.detail;
    const payload: SubmitHighlightPayload = {
      name: HIGHLIGHT_TOP_TRACKS,
      slug: canNext ? activeStory.slug : null,
    };

    fetch('/highlights', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
</script>

<StoriesLayout
  initialActiveIndex={data.initialActiveIndex}
  isShareable
  stories={data.topTrackStories}
  buildStoryPathname={buildTopTrackPathname}
  name={HIGHLIGHT_TOP_TRACKS}
  on:close={handleClose}
>
  <slot />
</StoriesLayout>
