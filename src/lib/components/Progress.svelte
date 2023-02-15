<script lang="ts">
  export let label = 'Loading...';
  /** number 0-100 */
  export let value: number;
</script>

<progress aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} max={100} {value}>
  {label}
</progress>

<style lang="scss">
  progress {
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
    color: var(--color-primary);

    &,
    &[value] {
      appearance: none;
    }

    &,
    &[value],
    &::-webkit-progress-bar,
    &[value]::-webkit-progress-bar {
      background-color: var(--color-text-subtle);
      border-radius: 99999px;
    }

    &::-webkit-progress-value,
    &[value]::-webkit-progress-value,
    &::-moz-progress-bar {
      background-color: var(--color-primary) !important;
      border-radius: 99999px;
    }
  }
</style>
