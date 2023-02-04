<script lang="ts">
  export let imageSrc = '';
  export let name: string;
</script>

<section>
  {#if imageSrc}
    <slot name="avatar" alt={name} src={imageSrc} />
  {/if}
  <div>
    <h2>{name}</h2>
    {#if $$slots.nowPlaying}
      <slot name="nowPlaying" />
    {/if}
  </div>
</section>

<style lang="scss">
  section {
    width: 100%;
    display: flex;
    gap: 16px;
    align-items: center;

    @media (min-width: 640px) {
      align-items: flex-start;
    }

    div {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;

      h2 {
        margin: 0;
        font-weight: bold;
        font-size: 24px;
        line-height: 32px;

        @media (min-width: 640px) {
          font-size: 30px;
          line-height: 36px;
        }
      }
    }
  }
</style>
