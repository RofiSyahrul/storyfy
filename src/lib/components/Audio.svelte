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

  export function getAudioElement() {
    return audio;
  }
</script>

{#key src}
  <audio bind:this={audio} autoplay muted={isMuted} crossorigin="anonymous" on:timeupdate on:ended>
    <source {src} type="audio/mpeg" />
    <em>Your browser does not support to play audio</em>
  </audio>
{/key}
