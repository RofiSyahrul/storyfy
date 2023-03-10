<script lang="ts" context="module">
  export type PopupEventMap = {
    close: MouseEvent & { currentTarget: EventTarget & HTMLElement };
  };
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { noop } from 'svelte/internal';

  import { browser } from '$app/environment';
  import { portal } from '$lib/actions/portal';

  type AnimationType = 'enter' | 'leave' | null;

  export let isOpen = false;

  let animationType: AnimationType = null;
  let isShown = false;

  const initialOverflowStyle = browser ? document.body.style.overflow : '';
  const dispatch = createEventDispatcher<PopupEventMap>();

  $: {
    if (isOpen) {
      animationType = 'enter';
      isShown = true;
    } else {
      animationType = 'leave';
    }
  }

  $: if (browser) {
    if (isShown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = initialOverflowStyle;
    }
  }

  onDestroy(() => {
    if (browser) document.body.style.overflow = initialOverflowStyle;
  });

  function handleAnimationEnd() {
    if (animationType === 'leave') isShown = false;
  }
</script>

<div
  use:portal
  aria-hidden={!isShown}
  class="popup"
  class:popup_enter={animationType === 'enter'}
  class:popup_leave={animationType === 'leave'}
  on:animationend={handleAnimationEnd}
>
  <div class="popup__mask" on:click={(e) => dispatch('close', e)} on:keydown={noop} />
  <dialog class="popup__dialog scrollable" open={isShown}>
    <slot />
  </dialog>
</div>

<style>
  @keyframes popup_fade-in {
    from {
      opacity: 0%;
    }
  }

  @keyframes popup_fade-out {
    to {
      opacity: 0%;
    }
  }

  @keyframes popup_zoom-in {
    from {
      transform: scale3d(0.3, 0.3, 0.3);
    }
  }

  @keyframes popup_zoom-out {
    to {
      transform: scale3d(0.3, 0.3, 0.3);
    }
  }

  .popup,
  .popup__mask {
    width: 100%;
    height: 100%;
    inset: 0;
  }

  .popup {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    animation-duration: 0.2s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
    z-index: 1000;

    --popup-max-height: 90%;
    --popup-max-width: 95%;
  }

  .popup__mask {
    position: absolute;
    background-color: var(--color-bg-subtle);
    opacity: 50%;
  }

  .popup[aria-hidden='true'] {
    display: none;
  }

  .popup_enter {
    animation-name: popup_fade-in;
  }

  .popup_leave {
    animation-name: popup_fade-out;
  }

  .popup_leave .popup__mask {
    pointer-events: none;
  }

  .popup__dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    overflow: auto;
    border: none;
    border-radius: 8px;
    box-shadow: var(--shadow-xl);
    color: var(--color-text-body);
    background-color: var(--color-bg-body);
    max-height: var(--popup-max-height);
    max-width: var(--popup-max-width);
    animation-duration: inherit;
    animation-fill-mode: inherit;
  }

  .popup_enter .popup__dialog {
    animation-name: popup_zoom-in;
    animation-timing-function: cubic-bezier(0.4, 0, 0, 1.5);
  }

  .popup_leave .popup__dialog {
    animation-name: popup_zoom-out;
  }
</style>
