// See https://kit.svelte.dev/docs/types#app

import type { ComponentType, SvelteComponentTyped } from 'svelte';
import type { SVGAttributes } from 'svelte/elements';

import type { SpotifyUserProfile } from '$lib/types/spotify';

// for information about these interfaces
declare global {
  namespace App {
    interface SEOMeta {
      description: string;
      image?: string;
      keyword?: string;
      shouldBlockSearchIndex?: boolean;
      title: string;
    }

    // interface Error {}

    interface Locals {
      isForbidden: boolean;
      userProfile: SpotifyUserProfile | null;
    }

    interface PageData {
      seo: SEOMeta;
    }

    // interface Platform {}
  }

  declare module '*.svg?component' {
    const content: ComponentType<SvelteComponentTyped<SVGAttributes<SVGSVGElement>>>;

    export default content;
  }

  declare module '*.svg?src' {
    const content: string;
    export default content;
  }

  declare module '*.svg?url' {
    const content: string;
    export default content;
  }
}

export {};
