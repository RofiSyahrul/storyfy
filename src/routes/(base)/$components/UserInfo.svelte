<script lang="ts">
  export let imageSrc = '';
  export let name: string;
</script>

<section>
  <slot name="avatar" alt={name} src={imageSrc} />
  <div>
    <h2>{name}</h2>
    <slot name="now-playing" />
  </div>
</section>

<style lang="scss">
  section {
    width: 100%;
    display: flex;
    gap: 16px;
    align-items: center;
    --now-playing-display: none;

    @include sm {
      align-items: flex-start;
      --now-playing-display: flex;
    }

    > div {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 8px;

      h2 {
        margin: 0;
        font-weight: bold;
        font-size: 24px;
        line-height: 32px;

        @include sm {
          font-size: 30px;
          line-height: 36px;
        }
      }
    }
  }
</style>
