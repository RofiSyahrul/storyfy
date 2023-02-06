<script lang="ts">
  import dayjs from 'dayjs';

  import { ONE_HOUR_IN_MINUTES } from '$lib/constants/times';
  import SpotifyIcon from '$lib/icons/spotify.svg?component';
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
</script>

<div>
  {#if $userProfile?.image?.url}
    <img alt={$userProfile.id} src={$userProfile.image.url} width="32px" height="32px" />
  {:else}
    <SpotifyIcon width="32" height="32" />
  {/if}

  <h1>{activeStory.title}</h1>

  {#if activeStory.timestamp}
    <span class="time-diff">
      {getTimeDiff(activeStory.timestamp)}
    </span>
  {/if}
</div>

<style lang="scss">
  img {
    object-fit: contain;
    border-radius: 50%;
  }

  h1 {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }

  .time-diff {
    font-size: 16px;
    line-height: 24px;
    color: var(--color-text-subtle);
  }
</style>
