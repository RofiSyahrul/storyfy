/* START: Entities */

export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyExternalURL {
  spotify: string;
}

export interface SpotifyAlbum {
  album_type: 'album' | 'single' | 'compilation';
  external_urls: SpotifyExternalURL;
  id: string;
  images: SpotifyImage[];
  name: string;
}

export interface SpotifyArtist {
  external_urls: SpotifyExternalURL;
  id: string;
  name: string;
}

export interface SpotifyTrack<TPreview = string | null> {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  duration_ms: number;
  external_urls: SpotifyExternalURL;
  id: string;
  name: string;
  preview_url: TPreview;
}

export interface SpotifyRecentlyPlayedItem<TPreview = string | null> {
  played_at: string;
  track: SpotifyTrack<TPreview>;
}

/* END: Entities */

/* START: Responses */

export interface SpotifyUserProfileResponse {
  display_name: string | null;
  id: string;
  images: SpotifyImage[];
}

export interface SpotifyUserProfile {
  displayName: string;
  id: string;
  image: SpotifyImage | null;
}

export interface SpotifyNowPlaingResponse {
  is_playing: boolean;
  item: SpotifyTrack;
}

export interface SpotifyNowPlayingData {
  albumName: string;
  artists: string[];
  image: SpotifyImage | null;
  previewURL: string | null;
  title: string;
  trackID: string;
  trackURL: string;
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayedItem[];
}

export interface SpotifyRecentlyPlayedTrack {
  albumName: string;
  artists: string[];
  id: string;
  image: SpotifyImage | null;
  playedAt: string;
  previewURL: string;
  title: string;
  trackURL: string;
}

/* END: Responses */
