import { noop } from 'svelte/internal';
import { writable, type Readable, type Writable } from 'svelte/store';

import type { SpotifyUserProfile } from '$lib/types/spotify';

let userProfileStore: Writable<SpotifyUserProfile | null> | undefined;

export function initUserProfileStore(profile: SpotifyUserProfile | null) {
  userProfileStore = writable(profile);
}

export const userProfile: Readable<SpotifyUserProfile | null> = {
  subscribe(run, invalidate) {
    if (!userProfileStore) return noop;
    return userProfileStore.subscribe(run, invalidate);
  },
};
