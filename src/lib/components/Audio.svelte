<script lang="ts">
  export let isMuted: boolean;
  export let src: string;

  let audio: HTMLAudioElement;

  export function toggleAudioPlaying() {
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
</script>

{#key src}
  <audio bind:this={audio} autoplay muted={isMuted} on:timeupdate on:ended>
    <source {src} type="audio/mpeg" />
    <em>Your browser does not support to play audio</em>
  </audio>
{/key}
