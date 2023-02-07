<script lang="ts">
  import dayjs from 'dayjs';

  import { ONE_HOUR_IN_MINUTES } from '$lib/constants/times';
  import StoryfyIcon from '$lib/icons/storyfy.svg?component';
  import { getActiveStoryStore } from '$lib/store/stories';
  import { userProfile } from '$lib/store/user-profile';

  function getTimeDiff(timestamp: string): string {
    const now = dayjs();

    const diffInMinutes = now.diff(timestamp, 'minutes');
    if (diffInMinutes < 0) return 'Just now';

    if (diffInMinutes === 0) {
      return `${now.diff(timestamp, 'second')}s`;
    }

    const diffInHours = Math.floor(diffInMinutes / ONE_HOUR_IN_MINUTES);
    const minutesRem = diffInMinutes - ONE_HOUR_IN_MINUTES * diffInHours;

    if (diffInHours === 0) return `${minutesRem}m`;
    if (minutesRem === 0) return `${diffInHours}h`;
    return `${diffInHours}h ${minutesRem}m`;
  }

  const activeStoryStore = getActiveStoryStore();

  $: ({ activeStory } = $activeStoryStore);
  $: userImageSrc = $userProfile?.image?.url;
  $: userName = $userProfile?.displayName;
</script>

<div class="container">
  {#if userImageSrc}
    <img alt={userName} src={userImageSrc} width="48px" height="48px" />
  {:else}
    <StoryfyIcon width="48" height="48" />
  {/if}

  <div>
    {#if userName}
      <h1>{userName}</h1>
    {/if}

    <div>
      <svelte:element this={userName ? 'h2' : 'h1'}>
        {activeStory.title}
      </svelte:element>

      {#if activeStory.timestamp}
        <span class="time-diff">
          {getTimeDiff(activeStory.timestamp)}
        </span>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .container {
    > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
    }
  }

  img {
    object-fit: contain;
    border-radius: 50%;
  }

  h1,
  h2 {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    display: inline;
    text-align: left;
  }

  h1 {
    color: var(--color-text-subtle);
  }

  .time-diff {
    font-size: 16px;
    line-height: 24px;
    color: var(--color-text-subtle);
    margin-left: 2px;
  }
</style>
