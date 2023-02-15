<script lang="ts">
  import { storyProgress } from '$lib/store/stories';

  export let slug: string;

  $: progress = $storyProgress[slug] ?? 0;
</script>

<div class="progress">
  <div class="mask" />
  <div class="bar" style:width={`${Math.min(progress, 100)}%`} />
</div>

<style lang="scss">
  .progress {
    position: relative;
    flex-grow: 1;
    height: 2px;

    .mask,
    .bar {
      height: 2px;
      border-radius: 2px;
      top: 0;
    }

    .mask {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      vertical-align: baseline;
      background-color: var(--color-text-subtle);
    }

    .bar {
      position: absolute;
      transition: width 10ms linear;
      will-change: width;
      background-color: var(--color-text-body);
    }
  }
</style>
