// See https://kit.svelte.dev/docs/types#app

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
      userProfile: SpotifyUserProfile | null;
    }

    interface PageData {
      seo: SEOMeta;
    }

    // interface Platform {}
  }
}

export {};
