export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyUserProfileResponse {
  display_name: string | null;
  id: string;
  images: SpotifyImage[];
}

export interface SpotifyUserProfile {
  displayName: string | null;
  id: string;
  image: SpotifyImage | null;
}
